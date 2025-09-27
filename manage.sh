#!/bin/bash

# Ebrandi Puzzle Generator - Service Management Script
# This script provides simple commands to manage the puzzle generator service

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

SERVICE_NAME="ebrandi-puzzle"
APP_DIR="/opt/puzzle-generator"
APP_USER="puzzle-generator"

# Print functions
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_header() {
    echo -e "\n${BLUE}╔══════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║          🧩 SERVICE MANAGER 🧩          ║${NC}"
    echo -e "${BLUE}╚══════════════════════════════════════════╝${NC}\n"
}

# Check if service exists
check_service() {
    if ! systemctl list-unit-files | grep -q "$SERVICE_NAME.service"; then
        print_error "Service '$SERVICE_NAME' not found!"
        print_info "Please run the deployment script first: ./deploy.sh"
        exit 1
    fi
}

# Show service status
status() {
    print_header
    print_info "Checking service status..."
    
    if systemctl is-active --quiet "$SERVICE_NAME"; then
        print_success "Service is running"
    else
        print_warning "Service is not running"
    fi
    
    if systemctl is-enabled --quiet "$SERVICE_NAME"; then
        print_success "Service is enabled (auto-start on boot)"
    else
        print_warning "Service is disabled (won't start on boot)"
    fi
    
    echo -e "\n${YELLOW}Detailed Status:${NC}"
    sudo systemctl status "$SERVICE_NAME" --no-pager
}

# Start the service
start() {
    print_header
    print_info "Starting service..."
    
    if systemctl is-active --quiet "$SERVICE_NAME"; then
        print_warning "Service is already running"
        return 0
    fi
    
    if sudo systemctl start "$SERVICE_NAME"; then
        sleep 3
        if systemctl is-active --quiet "$SERVICE_NAME"; then
            print_success "Service started successfully"
            print_info "Application is now accessible at configured URL"
        else
            print_error "Service failed to start properly"
            print_info "Check logs with: ./manage.sh logs"
        fi
    else
        print_error "Failed to start service"
        print_info "Check logs with: ./manage.sh logs"
    fi
}

# Stop the service
stop() {
    print_header
    print_info "Stopping service..."
    
    if ! systemctl is-active --quiet "$SERVICE_NAME"; then
        print_warning "Service is not running"
        return 0
    fi
    
    if sudo systemctl stop "$SERVICE_NAME"; then
        print_success "Service stopped successfully"
    else
        print_error "Failed to stop service"
    fi
}

# Restart the service
restart() {
    print_header
    print_info "Restarting service..."
    
    if sudo systemctl restart "$SERVICE_NAME"; then
        sleep 3
        if systemctl is-active --quiet "$SERVICE_NAME"; then
            print_success "Service restarted successfully"
            print_info "Application is now accessible at configured URL"
        else
            print_error "Service failed to restart properly"
            print_info "Check logs with: ./manage.sh logs"
        fi
    else
        print_error "Failed to restart service"
        print_info "Check logs with: ./manage.sh logs"
    fi
}

# Enable service (auto-start on boot)
enable() {
    print_header
    print_info "Enabling service to start on boot..."
    
    if sudo systemctl enable "$SERVICE_NAME"; then
        print_success "Service enabled - will start automatically on boot"
    else
        print_error "Failed to enable service"
    fi
}

# Disable service (don't auto-start on boot)
disable() {
    print_header
    print_info "Disabling service auto-start..."
    
    if sudo systemctl disable "$SERVICE_NAME"; then
        print_success "Service disabled - won't start automatically on boot"
        print_warning "Service is still running. Use './manage.sh stop' to stop it now."
    else
        print_error "Failed to disable service"
    fi
}

# Show logs
logs() {
    print_header
    print_info "Showing service logs (Press Ctrl+C to exit)..."
    echo -e "${YELLOW}Real-time logs:${NC}\n"
    
    sudo journalctl -u "$SERVICE_NAME" -f
}

# Show recent logs
logs_recent() {
    print_header
    print_info "Showing recent service logs..."
    echo -e "${YELLOW}Last 50 log entries:${NC}\n"
    
    sudo journalctl -u "$SERVICE_NAME" -n 50 --no-pager
}

# Show help
show_help() {
    print_header
    echo -e "${YELLOW}Available commands:${NC}"
    echo "  status     - Show service status and details"
    echo "  start      - Start the service"
    echo "  stop       - Stop the service"
    echo "  restart    - Restart the service"
    echo "  enable     - Enable auto-start on boot"
    echo "  disable    - Disable auto-start on boot"
    echo "  logs       - Show real-time logs (Ctrl+C to exit)"
    echo "  recent     - Show recent logs"
    echo "  help       - Show this help message"
    
    echo -e "\n${YELLOW}Usage examples:${NC}"
    echo "  ./manage.sh status"
    echo "  ./manage.sh restart"
    echo "  ./manage.sh logs"
    
    echo -e "\n${YELLOW}Quick checks:${NC}"
    echo "  Service status: sudo systemctl status $SERVICE_NAME"
    echo "  Application URL: Check deployment output for your URL"
}

# Main script logic
main() {
    # Check if running as root
    if [[ $EUID -eq 0 ]]; then
        print_error "Please don't run this script as root!"
        print_info "Run as a regular user with sudo privileges"
        exit 1
    fi
    
    # Check if service exists
    check_service
    
    case "${1:-help}" in
        "status")
            status
            ;;
        "start")
            start
            ;;
        "stop")
            stop
            ;;
        "restart")
            restart
            ;;
        "enable")
            enable
            ;;
        "disable")
            disable
            ;;
        "logs")
            logs
            ;;
        "recent")
            logs_recent
            ;;
        "help"|"-h"|"--help"|"")
            show_help
            ;;
        *)
            print_error "Unknown command: $1"
            echo ""
            show_help
            exit 1
            ;;
    esac
}

# Run the main function
main "$@"
