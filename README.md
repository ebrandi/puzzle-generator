
# 🧩 Ebrandi Puzzle Generator

<div align="center">
  <img src="app/public/logos/logo-wide.png" alt="Ebrandi Puzzle Generator Logo" width="400">
</div>

<div align="center">
  <strong>Educational Puzzles for Learning Minds</strong>
</div>



A comprehensive, multilingual puzzle generator built with Next.js. Create professional-quality **crossword puzzles**, **word search games**, and **Sudoku puzzles** with customizable themes, difficulty levels, and export options.

## 📖 Table of Contents
- [Live Demo](#live-demo)
- [Key Features](#key-features)
- [Prerequisites](#prerequisites)
- [Quick Start (Automated)](#quick-start-automated)
- [Deployment Options](#deployment-options)
- [Manual Installation](#manual-installation)
- [Application Management](#application-management)
- [Server Management (Public Deployment)](#server-management-public-deployment)
- [Basic Usage](#basic-usage)
- [Support](#support)
- [Developer Documentation](#developer-documentation)

## 🔗 Live Demo

Visit the deployed application: Offline for now

Experience the full functionality of the Ebrandi Puzzle Generator with:
- ✅ All three game modes (Crossword, Word Search, Sudoku)
- ✅ Complete multilingual support (English, Portuguese, Spanish)
- ✅ Professional PDF export functionality
- ✅ Initial set of 50+ words per category per language

## ✨ Key Features

### 🎮 Three Game Modes
- **🧩 Crossword Puzzles**: Classic word puzzles with themed clues
- **🔍 Word Search Games**: Find hidden words in letter grids
- **🔢 Sudoku Puzzles**: Classic 9×9 number logic puzzles

### 🌍 Multilingual Support
- **English** - 50+ words per category
- **Português** - Brazilian Portuguese support (50+ words per category)
- **Español** - Spanish language support (50+ words per category)

### 📄 Professional Export
- High-quality PDF generation for puzzles and answer keys
- Optimized for printing and classroom use
- Professional branding integration

## 📋 Prerequisites

### System Requirements
- **Node.js**: 18.0.0 or higher
- **Yarn**: 1.22.0 or higher (recommended) or npm 9.0.0+
- **Operating System**: Ubuntu 24.04 LTS (or compatible Linux distribution)

### Hardware Requirements
- **RAM**: 2GB minimum (4GB recommended)
- **Storage**: 500MB free space
- **CPU**: Any modern processor (dual-core recommended)

## 🚀 Quick Start (Automated)

For the fastest setup, use our automated deployment script:

```bash
# Download and run the deployment script
bash <(curl -fsSL https://raw.githubusercontent.com/ebrandi/puzzle-generator/main/deploy.sh)
```

Or clone the repository and run locally:

```bash
git clone https://github.com/ebrandi/puzzle-generator.git
cd puzzle-generator
chmod +x deploy.sh
./deploy.sh
```

The script will:
✅ Check system requirements  
✅ Install missing dependencies  
✅ Build the application for production  
✅ Create and configure systemd service  
✅ Set up automatic startup on boot  
✅ Configure SSL and nginx (for public deployments)  
✅ Start the application service  
✅ Open the application in your browser (local deployments)  

## 🌐 Deployment Options

### 📱 Local Development (Default)
Perfect for development, testing, or personal use:
- Runs on `http://localhost:3000`
- No SSL certificate needed
- Firewall allows development port (3000)
- Quick setup and easy debugging

### 🌍 Public Deployment with SSL
Professional deployment ready for production:
- **Nginx Reverse Proxy**: Professional web server configuration
- **SSL Certificate**: Free Let's Encrypt certificate with auto-renewal
- **Secure Firewall**: Only ports 22 (SSH), 80 (HTTP), and 443 (HTTPS) exposed
- **HTTPS Redirect**: Automatic redirect from HTTP to HTTPS
- **Security Headers**: Enhanced security with modern web standards

#### Prerequisites for Public Deployment:
- Domain name pointing to your server's IP address
- Valid email address for SSL certificate notifications
- Server accessible from the internet on ports 80 and 443

#### DNS Setup:
Before running the deployment script for public installation, ensure your domain's DNS A record points to your server:

```bash
# Check if your domain resolves correctly (replace with your domain)
nslookup yourdomain.com

# The result should show your server's public IP address
```

## 🔧 Manual Installation

### Step 1: Update System Packages

```bash
sudo apt update && sudo apt upgrade -y
```

### Step 2: Install Node.js and Yarn

```bash
# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Yarn
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt update && sudo apt install yarn -y

# Verify installations
node --version  # Should be 18.x or higher
yarn --version  # Should be 1.22.x or higher
```

### Step 3: Clone the Repository

```bash
git clone https://github.com/ebrandi/puzzle-generator.git
cd puzzle-generator
```

### Step 4: Install Dependencies

```bash
cd app
yarn install
```

### Step 5: Build and Start the Application

#### Development Mode
```bash
yarn dev
# Application will be available at http://localhost:3000
```

#### Production Mode
```bash
yarn build
yarn start
# Application will be available at http://localhost:3000
```

### Step 6: Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

## 🛠️ Application Management

The Ebrandi Puzzle Generator runs as a systemd service for reliable operation and easy management:

### 🏗️ System Architecture

- **Installation Location**: `/opt/puzzle-generator`
- **Dedicated User**: `puzzle-generator` (system user, no login shell)
- **Service Management**: systemd service (`ebrandi-puzzle.service`)
- **Process Isolation**: Runs as dedicated user with security restrictions
- **Auto-Start**: Enabled to start automatically on system boot
- **Logging**: Centralized through systemd journal

### 🔧 Service Management Commands

#### Quick Management Script
Use the included management script for easy service control:

```bash
# Navigate to the application directory
cd /opt/puzzle-generator

# Check service status
./manage.sh status

# Start the service
./manage.sh start

# Stop the service
./manage.sh stop

# Restart the service
./manage.sh restart

# View real-time logs
./manage.sh logs

# View recent logs
./manage.sh recent

# Enable auto-start on boot
./manage.sh enable

# Disable auto-start on boot
./manage.sh disable
```

#### Direct systemctl Commands
You can also use systemctl commands directly:

```bash
# Check service status
sudo systemctl status ebrandi-puzzle

# Start the service
sudo systemctl start ebrandi-puzzle

# Stop the service
sudo systemctl stop ebrandi-puzzle

# Restart the service
sudo systemctl restart ebrandi-puzzle

# Enable auto-start on boot
sudo systemctl enable ebrandi-puzzle

# Disable auto-start on boot
sudo systemctl disable ebrandi-puzzle

# View service logs (real-time)
sudo journalctl -u ebrandi-puzzle -f

# View recent service logs
sudo journalctl -u ebrandi-puzzle -n 50
```

## 🛡️ Server Management (Public Deployment)

If you deployed using the public deployment option with nginx and SSL, here are additional management commands:

### 🔒 SSL Certificate Management

```bash
# Check certificate status
sudo certbot certificates

# Manually renew certificates (done automatically by cron job)
sudo certbot renew

# Test automatic renewal
sudo certbot renew --dry-run

# View certificate expiration dates
sudo certbot certificates
```

### 🌐 Nginx Management

```bash
# Check nginx status
sudo systemctl status nginx

# Restart nginx
sudo systemctl restart nginx

# Reload nginx configuration (without dropping connections)
sudo systemctl reload nginx

# Test nginx configuration for syntax errors
sudo nginx -t

# View nginx access logs
sudo tail -f /var/log/nginx/access.log

# View nginx error logs
sudo tail -f /var/log/nginx/error.log
```

### 🛡️ Firewall Management

```bash
# Check current firewall status
sudo ufw status

# View detailed firewall rules
sudo ufw status numbered

# Temporarily disable firewall (not recommended for production)
sudo ufw disable

# Re-enable firewall
sudo ufw enable

# Add new port (if needed)
sudo ufw allow [port]/tcp
```

### 🔍 Troubleshooting Public Deployment

#### SSL Certificate Issues
```bash
# If certificate generation failed
sudo certbot delete --cert-name yourdomain.com
sudo certbot --nginx -d yourdomain.com

# Check certificate chain
echo | openssl s_client -servername yourdomain.com -connect yourdomain.com:443 | openssl x509 -noout -dates
```

#### Nginx Issues
```bash
# Check nginx configuration
sudo nginx -t

# Reset nginx to default (if needed)
sudo rm /etc/nginx/sites-enabled/puzzle-generator
sudo systemctl restart nginx

# View specific error details
journalctl -u nginx.service
```

#### Domain/DNS Issues
```bash
# Check if domain resolves to your server
nslookup yourdomain.com

# Check if ports are accessible
telnet yourdomain.com 80
telnet yourdomain.com 443
```

### 📊 Monitoring and Maintenance

#### Regular Maintenance Tasks

1. **Weekly**: Check SSL certificate status and logs
2. **Monthly**: Review nginx logs for any issues
3. **Quarterly**: Update system packages and restart services

```bash
# System updates (run regularly)
sudo apt update && sudo apt upgrade -y

# Restart services after updates
sudo systemctl restart nginx
```

#### Log Rotation

Nginx logs are automatically rotated by the system, but you can manually manage them:

```bash
# Check log file sizes
sudo du -h /var/log/nginx/

# Manually rotate logs (if needed)
sudo logrotate -f /etc/logrotate.d/nginx
```

## 📖 Basic Usage

### Getting Started

1. **Select Game Type**: Choose from Crossword, Word Search, or Sudoku
2. **Configure Your Puzzle**: Each game type has specific options
3. **Generate**: Click the generate button to create your puzzle
4. **Preview**: Review the puzzle in the web interface
5. **Export**: Download as PDF (puzzle and answer key)

### Creating Puzzles

#### Crossword & Word Search
1. Select your preferred language
2. Adjust grid size and word count
3. Choose theme categories
4. Set difficulty level
5. Generate and export

#### Sudoku
1. Select difficulty level
2. Generate puzzle
3. Export puzzle and solution

### Common Issues

**"Not enough words available" Error**
- Solution: Reduce target word count or add more themes
- Check that your selected language has sufficient words for chosen themes

**PDF export not working**
- Solution: Ensure your browser allows PDF downloads
- Check that pop-up blockers aren't preventing downloads

**Application won't start**
- Solution: Ensure all dependencies are installed with `yarn install`
- Check that you're running Node.js 18.x or higher

## 📞 Support

Need help? Here are your options:

- **Documentation**: Check this README and the [Developer Guide](DEVELOPER-GUIDE.md)
- **Issues**: Create a GitHub issue for bugs or features
- **Demo Site**: Offline for now

## 📚 Developer Documentation

For detailed technical information, project structure, contributing guidelines, and extending the application, see the comprehensive [Developer Guide](DEVELOPER-GUIDE.md).

Topics covered in the Developer Guide:
- 🛠 Technology stack details
- 📁 Complete project structure
- 🔧 Extending the application (adding words, categories, languages)
- 🎨 Branding and design guidelines
- 🤝 Contributing guidelines
- 📊 Word database management
- 🔄 Development workflows

---

**Happy Puzzle Creating! 🧩🔍🔢**
