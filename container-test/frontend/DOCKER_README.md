# Docker Setup for Todo Frontend

This directory contains Docker configuration files to run the React frontend application in containers.

## Files Overview

- `Dockerfile` - Production build with nginx
- `Dockerfile.dev` - Development build with hot reloading
- `nginx.conf` - Nginx configuration for production serving
- `.dockerignore` - Files to exclude from Docker build
- `env.example` - Environment variables template

## Quick Start

### Option 1: Production Build (Recommended for deployment)

1. **Copy environment variables:**
   ```bash
   cp env.example .env
   ```

2. **Build and run the production container:**
   ```bash
   # Build the image
   podman build -t todo-frontend .
   
   # Run the container
   podman run -d \
     --name todo-frontend \
     -e VITE_API_BASE_URL=http://localhost:3001 \
     -p 3000:3000 \
     todo-frontend
   ```

3. **Access the application:**
   - Frontend: http://localhost:3000
   - Health check: http://localhost:3000/health

### Option 2: Development Build (For development)

1. **Build and run the development container:**
   ```bash
   # Build the development image
   podman build -f Dockerfile.dev -t todo-frontend-dev .
   
   # Run the container with volume mount for hot reloading
   podman run -d \
     --name todo-frontend-dev \
     -e VITE_API_BASE_URL=http://localhost:3001 \
     -p 3000:3000 \
     -v $(pwd)/src:/app/src:Z \
     -v $(pwd)/public:/app/public:Z \
     todo-frontend-dev
   ```

2. **Access the development server:**
   - Frontend: http://localhost:3000
   - Hot reloading enabled

## Docker Compose Integration

To run the frontend with the backend and database, add this to your `docker-compose.yml`:

```yaml
version: '3.8'

services:
  # ... existing services (postgres, backend)
  
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: todo-frontend
    environment:
      VITE_API_BASE_URL: http://backend:3001
      VITE_API_TIMEOUT: 10000
    ports:
      - "3000:3000"
    depends_on:
      - backend
    networks:
      - todo-network
    restart: unless-stopped
```

## Environment Variables

### Required Variables

- `VITE_API_BASE_URL` - Backend API URL
- `VITE_API_TIMEOUT` - API request timeout (default: 10000ms)

### Optional Variables

- `VITE_DEV_MODE` - Enable development features
- `VITE_ENABLE_DEVTOOLS` - Enable React Query DevTools

## Build Configuration

### Production Build

The production Dockerfile uses a multi-stage build:

1. **Build Stage**: Node.js environment to build the React app
2. **Runtime Stage**: Nginx to serve the static files

### Development Build

The development Dockerfile:
- Uses Node.js with all dependencies
- Enables hot reloading
- Mounts source code as volumes

## Nginx Configuration

The `nginx.conf` includes:

- **SPA Routing**: Handles React Router routes
- **Static Asset Caching**: Optimized caching for JS/CSS files
- **Gzip Compression**: Reduces file sizes
- **Security Headers**: Basic security protections
- **API Proxy**: Optional proxy to backend (for development)

## Performance Optimizations

### Production

- Multi-stage build reduces image size
- Nginx serves static files efficiently
- Gzip compression enabled
- Long-term caching for static assets
- Optimized nginx configuration

### Development

- Hot reloading for fast development
- Volume mounts for live code changes
- Development server with full debugging

## Troubleshooting

### Common Issues

1. **Port already in use:**
   ```bash
   # Check what's using port 3000
   lsof -i :3000
   # Kill the process or change port
   ```

2. **API connection failed:**
   - Ensure backend is running
   - Check `VITE_API_BASE_URL` environment variable
   - Verify network connectivity between containers

3. **Build fails:**
   ```bash
   # Clean and rebuild
   podman system prune -f
   podman build --no-cache -t todo-frontend .
   ```

### Health Checks

- Production: `curl http://localhost:3000/health`
- Development: `curl http://localhost:3000/`

### Logs

```bash
# View frontend logs
podman logs todo-frontend

# Follow logs
podman logs -f todo-frontend
```

## Development Workflow

### Local Development

1. **Start development container:**
   ```bash
   podman run -d \
     --name todo-frontend-dev \
     -e VITE_API_BASE_URL=http://localhost:3001 \
     -p 3000:3000 \
     -v $(pwd)/src:/app/src:Z \
     -v $(pwd)/public:/app/public:Z \
     todo-frontend-dev
   ```

2. **Make changes to source code**
3. **Changes automatically reload in browser**

### Production Deployment

1. **Build production image:**
   ```bash
   podman build -t todo-frontend .
   ```

2. **Run with proper environment:**
   ```bash
   podman run -d \
     --name todo-frontend \
     -e VITE_API_BASE_URL=http://your-backend-url:3001 \
     -p 3000:3000 \
     todo-frontend
   ```

## Security Considerations

### Production

- Security headers enabled in nginx
- No source code exposed in container
- Minimal attack surface with nginx
- Proper file permissions

### Development

- Source code mounted for development
- Development tools enabled
- Less secure for production use

## Monitoring

### Health Checks

The container includes health checks:
- Production: HTTP health check endpoint
- Development: Vite dev server health check

### Logging

- Nginx access and error logs
- Application logs via console
- Structured logging for production

## Scaling

### Horizontal Scaling

```bash
# Run multiple instances
podman run -d --name todo-frontend-1 -p 3001:3000 todo-frontend
podman run -d --name todo-frontend-2 -p 3002:3000 todo-frontend
```

### Load Balancing

Use a reverse proxy (nginx, traefik) to distribute traffic across multiple frontend instances. 