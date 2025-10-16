# Digital Storming Loadboard

A cloud-based session management system with IP masking capabilities for DAT (Dispatch CRM) access.

## 🌟 Features

- **Cloud Deployment**: Deploy to DigitalOcean or any cloud provider
- **IP Masking**: All browsing routes through cloud server IP
- **Session Management**: Shared DAT sessions for multiple users
- **Super Admin Setup**: One-time setup by super admin, shared with all users
- **Global Access**: Users can connect from anywhere in the world
- **Privacy Protection**: User real IPs are completely hidden

## 🚀 Quick Deploy to DigitalOcean

### Prerequisites
- DigitalOcean account
- Ubuntu 22.04 droplet ($6/month)

### One-Command Deployment
```bash
# On your DigitalOcean droplet
wget -qO- https://raw.githubusercontent.com/YOUR_USERNAME/digital-storming-loadboard/main/deploy-to-cloud.sh | bash -s YOUR_DROPLET_IP
```

### Manual Deployment
```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/digital-storming-loadboard.git
cd digital-storming-loadboard

# Setup and start
cp CLOUD_CONFIG.env .env
# Edit .env with your droplet IP
npm install
npm run build
pm2 start dist/server.js --name loadboard-server
```

## 🔧 Configuration

### Environment Variables
Copy `CLOUD_CONFIG.env` to `.env` and update with your settings:

```bash
# Required
DATABASE_URL=your-postgresql-connection-string
CLOUD_SERVER_IP=your-droplet-ip
JWT_SECRET=your-secret-key

# Optional
CLOUD_PROXY_ENABLED=true
CORS_ORIGIN=*
```

## 📱 Client Application

The client application is located in the `Digital Storming Client` directory. Update its `.env` file:

```bash
API_BASE_URL=https://your-droplet-ip/api/v1
CLOUD_SERVER_IP=your-droplet-ip
```

## 🌐 How IP Masking Works

```
User PC → Cloud Server → DAT.com (Cloud IP visible)
```

All Chromium browsing routes through your cloud server, masking user IPs.

## 🛠️ Development

### Backend (Loadboard Server)
```bash
npm install
npm run build
npm run dev
```

### Client (Electron App)
```bash
cd "Digital Storming Client"
npm install
npm run dev
```

## 📋 API Endpoints

- `GET /api/v1/healthz` - Health check
- `POST /api/v1/auth/login` - User authentication
- `GET /api/v1/sessions/my-sessions` - Get user sessions
- `POST /api/v1/sessions/:id/mark-ready` - Mark session as ready (super admin)

## 🔒 Security

- JWT-based authentication
- Role-based access control (SUPER_ADMIN, ADMIN, SUPPORT, USER)
- Proxy routing for IP masking
- CORS protection
- Input validation with Zod

## 📊 Database Schema

- **Users**: Authentication and role management
- **Domains**: DAT platform configuration
- **DatSessions**: Shared session management
- **AuditLogs**: Activity tracking

## 🚀 Deployment Options

### DigitalOcean (Recommended)
- Cost: $6/month
- Setup: Simple VPS deployment
- IP: Static public IP

### AWS EC2
- Cost: $10-20/month
- Setup: More complex but scalable

### Railway/Render
- Cost: $5-10/month
- Setup: One-click deployment

## 📖 Documentation

- [Cloud Deployment Guide](CLOUD_DEPLOYMENT_GUIDE.md)
- [Complete Setup Guide](CLOUD_SETUP_COMPLETE.md)
- [Super Admin Setup](Digital%20Storming%20Client/SUPER_ADMIN_SETUP_GUIDE.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation files
- Review the setup guides

---

**Ready to deploy?** 🚀

1. Create a DigitalOcean droplet
2. Clone this repository
3. Follow the deployment guide
4. Enjoy global access with IP masking!