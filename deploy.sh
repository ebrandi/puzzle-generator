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
DEPLOYMENT_TYPE=""
DOMAIN=""
EMAIL=""
NGINX_CONFIG_PATH="/etc/nginx/sites-available/puzzle-generator"
NGINX_ENABLED_PATH="/etc/nginx/sites-enabled/puzzle-generator"

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

validate_domain() {
    local domain="$1"
    
    # Check if domain is empty
    if [[ -z "$domain" ]]; then
        return 1
    fi
    
    # Basic domain validation (simplified)
    if [[ ! "$domain" =~ ^[a-zA-Z0-9][a-zA-Z0-9\.-]*[a-zA-Z0-9]\.[a-zA-Z]{2,}$ ]]; then
        return 1
    fi
    
    return 0
}

validate_email() {
    local email="$1"
    
    # Basic email validation
    if [[ "$email" =~ ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$ ]]; then
        return 0
    else
        return 1
    fi
}

ask_deployment_type() {
    print_header "Deployment Configuration"
    
    echo -e "${YELLOW}Choose your deployment type:${NC}"
    echo -e "${BLUE}1) Local Development (localhost only)${NC}"
    echo -e "   - App runs on http://localhost:$PORT"
    echo -e "   - No SSL certificate needed"
    echo -e "   - Firewall allows development port"
    echo -e ""
    echo -e "${BLUE}2) Public Deployment (with SSL)${NC}"
    echo -e "   - App runs behind nginx reverse proxy"
    echo -e "   - SSL certificate from Let's Encrypt"
    echo -e "   - Firewall restricted to ports 22, 80, 443"
    echo -e "   - Requires domain name pointing to this server"
    echo -e ""
    
    while true; do
        read -p "Enter your choice (1 or 2): " choice
        
        case $choice in
            1)
                DEPLOYMENT_TYPE="local"
                print_success "Selected: Local Development"
                break
                ;;
            2)
                DEPLOYMENT_TYPE="public"
                print_success "Selected: Public Deployment with SSL"
                
                # Ask for domain name
                while true; do
                    echo -e "\n${YELLOW}Domain Configuration:${NC}"
                    read -p "Enter your domain name (e.g., puzzle.example.com): " domain_input
                    
                    if validate_domain "$domain_input"; then
                        DOMAIN="$domain_input"
                        print_success "Domain: $DOMAIN"
                        break
                    else
                        print_error "Invalid domain name. Please enter a valid domain (e.g., puzzle.example.com)"
                    fi
                done
                
                # Ask for email address for Let's Encrypt
                while true; do
                    read -p "Enter your email address for SSL certificate notifications: " email_input
                    
                    if validate_email "$email_input"; then
                        EMAIL="$email_input"
                        print_success "Email: $EMAIL"
                        break
                    else
                        print_error "Invalid email address. Please enter a valid email."
                    fi
                done
                
                # Warn about DNS requirements
                echo -e "\n${YELLOW}⚠️  IMPORTANT DNS REQUIREMENT:${NC}"
                echo -e "${YELLOW}Make sure your domain '$DOMAIN' is pointing to this server's IP address${NC}"
                echo -e "${YELLOW}before continuing. The SSL certificate generation will fail otherwise.${NC}"
                echo -e ""
                read -p "Press Enter to continue when DNS is configured, or Ctrl+C to exit..."
                
                break
                ;;
            *)
                print_error "Invalid choice. Please enter 1 or 2."
                ;;
        esac
    done
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

install_nginx() {
    print_header "Installing Nginx"
    
    # Check if Nginx is already installed
    if check_command nginx; then
        print_success "Nginx is already installed"
    else
        print_info "Installing nginx web server..."
        sudo apt install -y nginx > /dev/null
        print_success "Nginx installed successfully"
    fi
    
    # Ensure nginx is enabled and started
    sudo systemctl enable nginx > /dev/null 2>&1
    sudo systemctl start nginx > /dev/null 2>&1
    
    print_success "Nginx service configured"
}

create_nginx_config() {
    print_header "Configuring Nginx"
    
    print_info "Creating nginx configuration for $DOMAIN..."
    
    # Create nginx configuration
    sudo tee "$NGINX_CONFIG_PATH" > /dev/null <<EOF
server {
    listen 80;
    server_name $DOMAIN;
    
    # Redirect all HTTP requests to HTTPS
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name $DOMAIN;
    
    # SSL Configuration (will be updated by certbot)
    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
    
    # Modern SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    location / {
        proxy_pass http://localhost:$PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        
        # Increase proxy timeouts for better stability
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Static file serving optimization
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        proxy_pass http://localhost:$PORT;
    }
    
    # Handle favicon.ico and robots.txt
    location = /favicon.ico {
        log_not_found off;
        access_log off;
        proxy_pass http://localhost:$PORT;
    }
    
    location = /robots.txt {
        log_not_found off;
        access_log off;
        proxy_pass http://localhost:$PORT;
    }
}
EOF
    
    # Enable the site
    if [[ -f "$NGINX_ENABLED_PATH" ]]; then
        sudo rm "$NGINX_ENABLED_PATH"
    fi
    sudo ln -s "$NGINX_CONFIG_PATH" "$NGINX_ENABLED_PATH"
    
    # Remove default nginx site
    if [[ -f "/etc/nginx/sites-enabled/default" ]]; then
        sudo rm "/etc/nginx/sites-enabled/default"
    fi
    
    # Test nginx configuration
    if sudo nginx -t > /dev/null 2>&1; then
        print_success "Nginx configuration created successfully"
    else
        print_error "Nginx configuration test failed"
        exit 1
    fi
}

setup_ssl_certificate() {
    print_header "Setting up SSL Certificate"
    
    # Install certbot if not already installed
    if ! check_command certbot; then
        print_info "Installing certbot for SSL certificate management..."
        sudo apt install -y certbot python3-certbot-nginx > /dev/null
        print_success "Certbot installed successfully"
    else
        print_success "Certbot is already installed"
    fi
    
    # Create a temporary nginx config for initial certificate generation
    print_info "Creating temporary nginx configuration for certificate generation..."
    sudo tee "$NGINX_CONFIG_PATH" > /dev/null <<EOF
server {
    listen 80;
    server_name $DOMAIN;
    
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }
    
    location / {
        proxy_pass http://localhost:$PORT;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF
    
    # Reload nginx with temporary config
    sudo systemctl reload nginx
    
    print_info "Generating SSL certificate for $DOMAIN..."
    print_info "This may take a few moments..."
    
    # Generate SSL certificate
    if sudo certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos --email "$EMAIL" --redirect; then
        print_success "SSL certificate generated successfully"
        
        # Set up automatic renewal
        print_info "Setting up automatic certificate renewal..."
        if ! sudo crontab -l 2>/dev/null | grep -q "certbot renew"; then
            (sudo crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | sudo crontab -
        fi
        print_success "Automatic certificate renewal configured"
        
    else
        print_error "Failed to generate SSL certificate"
        print_info "Please check that:"
        print_info "1. Your domain '$DOMAIN' points to this server's IP"
        print_info "2. Ports 80 and 443 are accessible from the internet"
        print_info "3. No firewall is blocking the connection"
        exit 1
    fi
    
    # Update nginx config with the full SSL configuration
    create_nginx_config
    
    # Reload nginx with final configuration
    if sudo systemctl reload nginx; then
        print_success "Nginx reloaded with SSL configuration"
    else
        print_error "Failed to reload nginx"
        exit 1
    fi
}

setup_firewall() {
    print_header "Configuring Firewall"
    
    if check_command ufw; then
        print_info "Configuring UFW firewall rules..."
        
        # Reset UFW to ensure clean configuration
        sudo ufw --force reset > /dev/null 2>&1
        
        # Allow SSH (critical - always allow this first!)
        sudo ufw allow ssh > /dev/null 2>&1
        
        if [[ "$DEPLOYMENT_TYPE" == "public" ]]; then
            # Public deployment: only allow HTTP, HTTPS, and SSH
            sudo ufw allow 80/tcp > /dev/null 2>&1
            sudo ufw allow 443/tcp > /dev/null 2>&1
            
            # Set default policies
            sudo ufw default deny incoming > /dev/null 2>&1
            sudo ufw default allow outgoing > /dev/null 2>&1
            
            # Enable firewall
            if sudo ufw --force enable > /dev/null 2>&1; then
                print_success "Firewall configured for public deployment"
                print_info "Open ports: 22 (SSH), 80 (HTTP), 443 (HTTPS)"
            else
                print_warning "Could not enable UFW firewall"
            fi
        else
            # Local deployment: allow development port in addition to web ports
            sudo ufw allow 80/tcp > /dev/null 2>&1
            sudo ufw allow 443/tcp > /dev/null 2>&1
            sudo ufw allow $PORT/tcp > /dev/null 2>&1
            
            # Set default policies (more permissive for development)
            sudo ufw default deny incoming > /dev/null 2>&1
            sudo ufw default allow outgoing > /dev/null 2>&1
            
            # Enable firewall
            if sudo ufw --force enable > /dev/null 2>&1; then
                print_success "Firewall configured for local development"
                print_info "Open ports: 22 (SSH), 80 (HTTP), 443 (HTTPS), $PORT (App)"
            else
                print_warning "Could not enable UFW firewall"
            fi
        fi
        
        # Show firewall status
        print_info "Current firewall rules:"
        sudo ufw status numbered | grep -E "(Status|ALLOW)" || true
        
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
    
    # Test internal application first (always on localhost)
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
    
    # For public deployment, also test the domain access
    if [[ "$DEPLOYMENT_TYPE" == "public" ]]; then
        print_info "Testing public access through nginx..."
        attempt=0
        max_attempts=15  # Shorter timeout for external test
        
        while [ $attempt -lt $max_attempts ]; do
            if curl -s -k "https://$DOMAIN" > /dev/null 2>&1; then
                print_success "Public access working: https://$DOMAIN"
                break
            fi
            
            attempt=$((attempt + 1))
            sleep 2
            
            if [ $attempt -eq $max_attempts ]; then
                print_warning "Could not verify public access to https://$DOMAIN"
                print_info "This might be due to DNS propagation or network configuration"
                print_info "Please try accessing the URL manually in a few minutes"
            fi
        done
    fi
}

show_completion_info() {
    print_header "🎉 Deployment Complete!"
    
    echo -e "${GREEN}"
    echo "╔══════════════════════════════════════════╗"
    echo "║         🧩 DEPLOYMENT SUCCESSFUL! 🧩     ║"
    echo "╚══════════════════════════════════════════╝"
    echo -e "${NC}"
    
    if [[ "$DEPLOYMENT_TYPE" == "public" ]]; then
        # Public deployment information
        echo -e "${BLUE}🌐 Public URL:${NC} https://$DOMAIN"
        echo -e "${BLUE}🔒 SSL Certificate:${NC} Let's Encrypt (auto-renewing)"
        echo -e "${BLUE}🛡️  Reverse Proxy:${NC} Nginx"
        echo -e "${BLUE}🔥 Firewall:${NC} Restricted to ports 22, 80, 443"
        echo -e "${BLUE}📁 Application Directory:${NC} $APP_DIR"
        echo -e "${BLUE}🔧 Node.js Version:${NC} $(node --version)"
        echo -e "${BLUE}📦 Yarn Version:${NC} $(yarn --version)"
        
        echo -e "\n${YELLOW}📋 Next Steps:${NC}"
        echo "1. Visit your domain: https://$DOMAIN"
        echo "2. Create your first crossword puzzle!"
        echo "3. SSL certificate will auto-renew every 90 days"
        echo "4. Monitor your application with: sudo systemctl status nginx"
        
        echo -e "\n${YELLOW}📚 SSL & Nginx Management:${NC}"
        echo "• Check SSL certificate: sudo certbot certificates"
        echo "• Renew certificate manually: sudo certbot renew"
        echo "• Check nginx status: sudo systemctl status nginx"
        echo "• Reload nginx config: sudo systemctl reload nginx"
        echo "• View nginx logs: sudo tail -f /var/log/nginx/access.log"
        
        echo -e "\n${YELLOW}🔒 Security Features:${NC}"
        echo "• HTTPS redirect from HTTP automatically"
        echo "• Modern SSL/TLS configuration (TLS 1.2+)"
        echo "• Security headers enabled"
        echo "• Firewall configured for minimal attack surface"
        
    else
        # Local deployment information
        echo -e "${BLUE}🌐 Local URL:${NC} http://localhost:$PORT"
        echo -e "${BLUE}📁 Application Directory:${NC} $APP_DIR"
        echo -e "${BLUE}🔧 Node.js Version:${NC} $(node --version)"
        echo -e "${BLUE}📦 Yarn Version:${NC} $(yarn --version)"
        
        echo -e "\n${YELLOW}📋 Next Steps:${NC}"
        echo "1. Open your browser and visit: http://localhost:$PORT"
        echo "2. Create your first crossword puzzle!"
        echo "3. For production deployment, run: yarn build && yarn start"
        echo "4. To stop the application: pkill -f 'next.*dev'"
        
        echo -e "\n${YELLOW}📚 Development Commands:${NC}"
        echo "• Start development server: cd \"$APP_DIR\" && yarn dev"
        echo "• Build for production: cd \"$APP_DIR\" && yarn build"
        echo "• Start production server: cd \"$APP_DIR\" && yarn start"
        echo "• View application logs: cd \"$APP_DIR\" && yarn dev"
    fi
    
    echo -e "\n${YELLOW}🆘 Need Help?${NC}"
    echo "• Check the README.md for detailed documentation"
    echo "• Report issues on GitHub"
    if [[ "$DEPLOYMENT_TYPE" == "public" ]]; then
        echo "• Check nginx logs if domain doesn't work"
        echo "• Verify DNS records point to this server"
    else
        echo "• Run 'yarn dev' manually if auto-start fails"
    fi
    
    # Try to open browser (if GUI available and local deployment)
    if [[ "$DEPLOYMENT_TYPE" == "local" ]] && command -v xdg-open &> /dev/null; then
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
    
    # Ask user about deployment type
    ask_deployment_type
    
    # Run basic setup steps
    check_system
    update_system
    install_system_dependencies
    install_node
    download_project
    setup_application
    
    # Install and configure nginx for public deployment
    if [[ "$DEPLOYMENT_TYPE" == "public" ]]; then
        install_nginx
        setup_ssl_certificate
    fi
    
    # Configure firewall based on deployment type
    setup_firewall
    
    # Start and test the application
    start_application
    test_application
    show_completion_info
    
    print_success "Deployment completed successfully! 🎉"
}

# Check if script is being sourced or executed
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
