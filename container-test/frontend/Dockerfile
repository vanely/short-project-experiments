# Multi-stage build for React frontend (Production Ready)
# Stage 1: Build the application
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install security updates and build dependencies
RUN apk add --no-cache --upgrade \
    && apk add --no-cache \
        python3 \
        make \
        g++ \
        openssl \
        openssl-dev

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci --only=production=false

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Security scan (optional but recommended)
FROM node:18-alpine AS security-scan
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production=false
COPY . .
# Add security scanning here if needed
# RUN npm audit --audit-level=high

# Stage 3: Serve with nginx (Production)
FROM nginx:alpine

# Install security updates
RUN apk add --no-cache --upgrade \
    && apk add --no-cache \
        curl \
        wget \
        && rm -rf /var/cache/apk/*

# Use existing nginx user (already exists in nginx:alpine)
# The nginx user is already created with UID 101 in the base image

# Copy built application from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Set proper permissions
RUN chown -R nginx:nginx /usr/share/nginx/html \
    && chown -R nginx:nginx /var/cache/nginx \
    && chown -R nginx:nginx /var/log/nginx \
    && chown -R nginx:nginx /etc/nginx/conf.d \
    && touch /var/run/nginx.pid \
    && chown -R nginx:nginx /var/run/nginx.pid

# Create necessary directories with proper permissions
RUN mkdir -p /var/cache/nginx/client_temp \
    && mkdir -p /var/cache/nginx/proxy_temp \
    && mkdir -p /var/cache/nginx/fastcgi_temp \
    && mkdir -p /var/cache/nginx/uwsgi_temp \
    && mkdir -p /var/cache/nginx/scgi_temp \
    && chown -R nginx:nginx /var/cache/nginx

# Expose port
EXPOSE 3000

# Health check with proper timeout
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Switch to non-root user
USER nginx

# Start nginx
CMD ["nginx", "-g", "daemon off;"] 