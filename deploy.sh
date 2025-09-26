#!/bin/bash

# 🧩 Ebrandi Puzzle Generator - Automated Deployment Script
# This script automates the deployment process for Ubuntu 24.04 LTS

set -e  # Exit on any error

# Colors for better output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
NODE_VERSION="18"
APP_NAME="Ebrandi Puzzle Generator"
GITHUB_REPO="https://github.com/ebrandi/puzzle-generator.git"
PROJECT_DIR="puzzle-generator"
APP_DIR=""
PORT=3000

# Helper functions
print_header() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE}🧩 $1${NC}"
    echo -e "${BLUE}========================================${NC}\n"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

check_command() {
    if command -v "$1" &> /dev/null; then
        return 0
    else
        return 1
    fi
}

check_version() {
    local cmd="$1"
    local required_version="$2"
    local current_version=$($cmd --version 2>/dev/null | head -n1 | grep -oE '[0-9]+\.[0-9]+' | head -n1)
    
    if [ -z "$current_version" ]; then
        return 1
    fi
    
    # Simple version comparison (works for major.minor)
    if awk "BEGIN {exit !($current_version >= $required_version)}"; then
        return 0
    else
        return 1
    fi
}

# Main installation functions
check_system() {
    print_header "Checking System Requirements"
    
    # Check OS
    if [[ -f /etc/os-release ]]; then
        source /etc/os-release
        print_info "OS: $PRETTY_NAME"
        if [[ "$ID" != "ubuntu" ]]; then
            print_warning "This script is optimized for Ubuntu 24.04 LTS"
            print_warning "It may work on other Debian-based systems but isn't guaranteed"
        fi
    fi
    
    # Check if running as root
    if [[ $EUID -eq 0 ]]; then
        print_error "Please don't run this script as root!"
        print_info "Run as a regular user with sudo privileges"
        exit 1
    fi
    
    # Check sudo privileges
    if ! sudo -n true 2>/dev/null; then
        print_info "This script requires sudo privileges for system package installation"
        print_info "You may be prompted for your password"
    fi
    
    print_success "System requirements check completed"
}

update_system() {
    print_header "Updating System Packages"
    
    print_info "Updating package list..."
    sudo apt update -qq
    
    print_info "Upgrading existing packages..."
    sudo apt upgrade -y -qq
    
    print_success "System packages updated"
}

install_node() {
    print_header "Installing Node.js and Package Managers"
    
    # Check if Node.js is already installed with correct version
    if check_command node && check_version node 18.0; then
        local node_ver=$(node --version)
        print_success "Node.js $node_ver is already installed"
    else
        print_info "Installing Node.js $NODE_VERSION..."
        
        # Install Node.js from NodeSource repository
        curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | sudo -E bash - > /dev/null
        sudo apt-get install -y nodejs > /dev/null
        
        local node_ver=$(node --version)
        print_success "Node.js $node_ver installed successfully"
    fi
    
    # Check if Yarn is installed
    if check_command yarn; then
        local yarn_ver=$(yarn --version)
        print_success "Yarn $yarn_ver is already installed"
    else
        print_info "Installing Yarn package manager..."
        
        # Install Yarn
        curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add - > /dev/null 2>&1
        echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list > /dev/null
        sudo apt update -qq
        sudo apt install yarn -y > /dev/null
        
        local yarn_ver=$(yarn --version)
        print_success "Yarn $yarn_ver installed successfully"
    fi
    
    # Install global dependencies if needed
    print_info "Installing global utilities..."
    if ! npm list -g pm2 &>/dev/null; then
        sudo npm install -g pm2 > /dev/null 2>&1 || print_warning "PM2 installation skipped (optional)"
    fi
}

install_system_dependencies() {
    print_header "Installing System Dependencies"
    
    # Essential build tools and libraries
    local packages=(
        "build-essential"
        "curl"
        "wget"
        "git"
        "unzip"
        "software-properties-common"
        "ca-certificates"
        "gnupg"
        "lsb-release"
    )
    
    print_info "Installing essential packages..."
    for package in "${packages[@]}"; do
        if ! dpkg -l | grep -q "^ii.*$package "; then
            print_info "Installing $package..."
            sudo apt install -y "$package" > /dev/null
        fi
    done
    
    print_success "System dependencies installed"
}

download_project() {
    print_header "Downloading $APP_NAME"
    
    # Check if we need to download the project
    if [[ ! -f "README.md" ]] || [[ ! -d "app" ]]; then
        print_info "Project files not found locally. Downloading from GitHub..."
        
        # Ensure git is available
        if ! check_command git; then
            print_info "Git is not installed. Installing git..."
            sudo apt update -qq
            sudo apt install -y git
        fi
        
        # Remove existing directory if it exists but is incomplete
        if [[ -d "$PROJECT_DIR" ]]; then
            print_info "Removing incomplete project directory..."
            rm -rf "$PROJECT_DIR"
        fi
        
        # Clone the repository
        print_info "Cloning repository from $GITHUB_REPO..."
        if ! git clone "$GITHUB_REPO" "$PROJECT_DIR"; then
            print_error "Failed to clone repository from $GITHUB_REPO"
            print_info "Please check your internet connection and try again"
            exit 1
        fi
        
        # Change to project directory
        cd "$PROJECT_DIR" || {
            print_error "Cannot access project directory: $PROJECT_DIR"
            exit 1
        }
        
        print_success "Project downloaded successfully"
    else
        print_success "Running from existing project directory"
    fi
    
    # Set APP_DIR to the correct path
    APP_DIR="$(pwd)/app"
}

setup_application() {
    print_header "Setting Up $APP_NAME"
    
    # Navigate to app directory
    cd "$APP_DIR" || {
        print_error "Cannot access app directory: $APP_DIR"
        exit 1
    }
    
    # Check if package.json exists
    if [[ ! -f "package.json" ]]; then
        print_error "package.json not found in app directory"
        exit 1
    fi
    
    print_info "Installing project dependencies..."
    
    # Clear yarn cache to avoid potential issues
    yarn cache clean > /dev/null 2>&1 || true
    
    # Install dependencies
    yarn install --frozen-lockfile > /dev/null 2>&1 || {
        print_warning "Frozen lockfile install failed, trying regular install..."
        yarn install
    }
    
    print_success "Project dependencies installed"
    
    # Build the application
    print_info "Building the application..."
    yarn build > /dev/null || {
        print_error "Build failed! Check the output above for errors"
        exit 1
    }
    
    print_success "Application built successfully"
}

setup_firewall() {
    print_header "Configuring Firewall (Optional)"
    
    if check_command ufw; then
        print_info "Configuring UFW firewall rules..."
        
        # Allow SSH (important!)
        sudo ufw allow ssh > /dev/null 2>&1
        
        # Allow HTTP and HTTPS
        sudo ufw allow 80 > /dev/null 2>&1
        sudo ufw allow 443 > /dev/null 2>&1
        
        # Allow the development port
        sudo ufw allow $PORT > /dev/null 2>&1
        
        # Enable firewall if not already enabled
        if ! sudo ufw --force enable > /dev/null 2>&1; then
            print_warning "Could not enable UFW firewall"
        else
            print_success "Firewall configured for ports 22, 80, 443, and $PORT"
        fi
    else
        print_info "UFW firewall not found, skipping firewall configuration"
    fi
}

start_application() {
    print_header "Starting $APP_NAME"
    
    cd "$APP_DIR" || exit 1
    
    # Kill any existing processes on the port
    if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null; then
        print_info "Stopping existing application on port $PORT..."
        pkill -f "next.*start" > /dev/null 2>&1 || true
        pkill -f "next.*dev" > /dev/null 2>&1 || true
        sleep 2
    fi
    
    # Start the application in development mode
    print_info "Starting application in development mode..."
    print_info "This will run in the background. Use 'yarn start' for production mode."
    
    # Start in background
    nohup yarn dev > /dev/null 2>&1 &
    local app_pid=$!
    
    # Wait a moment for the app to start
    sleep 5
    
    # Check if the application is running
    if kill -0 $app_pid 2>/dev/null; then
        print_success "Application started successfully (PID: $app_pid)"
    else
        print_error "Failed to start the application"
        print_info "Try running 'yarn dev' manually in the app directory"
        exit 1
    fi
}

test_application() {
    print_header "Testing Application"
    
    print_info "Waiting for application to be ready..."
    local max_attempts=30
    local attempt=0
    
    while [ $attempt -lt $max_attempts ]; do
        if curl -s http://localhost:$PORT > /dev/null 2>&1; then
            print_success "Application is responding on port $PORT"
            break
        fi
        
        attempt=$((attempt + 1))
        sleep 2
        
        if [ $attempt -eq $max_attempts ]; then
            print_error "Application failed to respond after $((max_attempts * 2)) seconds"
            print_info "Check the logs by running: yarn dev"
            exit 1
        fi
    done
}

show_completion_info() {
    print_header "🎉 Deployment Complete!"
    
    echo -e "${GREEN}"
    echo "╔══════════════════════════════════════════╗"
    echo "║         🧩 DEPLOYMENT SUCCESSFUL! 🧩     ║"
    echo "╚══════════════════════════════════════════╝"
    echo -e "${NC}"
    
    echo -e "${BLUE}🌐 Application URL:${NC} http://localhost:$PORT"
    echo -e "${BLUE}📁 Application Directory:${NC} $APP_DIR"
    echo -e "${BLUE}🔧 Node.js Version:${NC} $(node --version)"
    echo -e "${BLUE}📦 Yarn Version:${NC} $(yarn --version)"
    
    echo -e "\n${YELLOW}📋 Next Steps:${NC}"
    echo "1. Open your browser and visit: http://localhost:$PORT"
    echo "2. Create your first crossword puzzle!"
    echo "3. For production deployment, run: yarn build && yarn start"
    echo "4. To stop the application: pkill -f 'next.*dev'"
    
    echo -e "\n${YELLOW}📚 Useful Commands:${NC}"
    echo "• Start development server: cd \"$APP_DIR\" && yarn dev"
    echo "• Build for production: cd \"$APP_DIR\" && yarn build"
    echo "• Start production server: cd \"$APP_DIR\" && yarn start"
    echo "• View application logs: cd \"$APP_DIR\" && yarn dev"
    
    echo -e "\n${YELLOW}🆘 Need Help?${NC}"
    echo "• Check the README.md for detailed documentation"
    echo "• Report issues on GitHub"
    echo "• Run 'yarn dev' manually if auto-start fails"
    
    # Try to open browser (if GUI available)
    if command -v xdg-open &> /dev/null; then
        print_info "Opening application in your default browser..."
        sleep 2
        xdg-open "http://localhost:$PORT" 2>/dev/null || print_info "Please open http://localhost:$PORT manually"
    fi
    
    echo -e "\n${GREEN}Happy puzzle creating! 🧩🔍🔢✨${NC}\n"
}

cleanup_on_error() {
    print_error "Deployment failed!"
    print_info "Check the error messages above for troubleshooting"
    print_info "You can try running the script again or follow the manual installation steps"
    exit 1
}

# Main deployment process
main() {
    # Trap errors
    trap cleanup_on_error ERR
    
    print_header "🧩 $APP_NAME - Automated Deployment"
    echo -e "${BLUE}This script will install and configure the Puzzle Generator${NC}"
    echo -e "${BLUE}on Ubuntu 24.04 LTS. Press Ctrl+C to cancel.${NC}"
    echo -e "${BLUE}${NC}"
    echo -e "${BLUE}Installation methods:${NC}"
    echo -e "${BLUE}• Remote: curl -fsSL https://raw.githubusercontent.com/ebrandi/puzzle-generator/main/deploy.sh | bash${NC}"
    echo -e "${BLUE}• Local:  git clone repo && cd puzzle-generator && ./deploy.sh${NC}\n"
    
    # Give user a chance to cancel
    sleep 3
    
    # Run deployment steps
    check_system
    update_system
    install_system_dependencies
    install_node
    download_project
    setup_application
    setup_firewall
    start_application
    test_application
    show_completion_info
    
    print_success "Deployment completed successfully! 🎉"
}

# Check if script is being sourced or executed
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi

