# 🧪 Frontend Container Testing Guide

## 📋 **Overview**

This guide documents the comprehensive testing process used to verify that the production-ready frontend container is working correctly with all security features, performance optimizations, and functionality intact.

## 🚀 **Initial Deployment Test**

### 1. **Build and Deploy Container**
```bash
# Run the production-ready quick start script
./quick-start.sh
```

**Expected Output:**
```
🎯 Quick Start for Todo Frontend (Production Ready)
==================================================
📋 Loading environment variables from .env file...
✅ Environment variables loaded
🔍 Validating environment configuration...
🛑 Stopping existing frontend container...
🔨 Building Docker image (no cache)...
✅ Docker image built successfully
🚀 Starting frontend container with production settings...
✅ Frontend container started successfully
```

## 🔍 **Container Status Verification**

### 2. **Check Container Status**
```bash
# Verify container is running and healthy
docker ps --filter name=todo-frontend
```

**Expected Output:**
```
CONTAINER ID   IMAGE           COMMAND                  CREATED          STATUS                    PORTS
6300e12e20b7   todo-frontend   "/docker-entrypoint.…"   30 seconds ago   Up 30 seconds (healthy)   0.0.0.0:3000->3000/tcp, [::]:3000->3000/tcp   todo-frontend
```

**Key Indicators:**
- ✅ Status: `Up` (container is running)
- ✅ Health: `healthy` (health checks passing)
- ✅ Ports: `0.0.0.0:3000->3000/tcp` (port mapping correct)

## 🔒 **Security Verification**

### 3. **Verify Non-Root User**
```bash
# Check that container runs as non-root user
docker exec todo-frontend id
```

**Expected Output:**
```
uid=101(nginx) gid=101(nginx) groups=101(nginx)
```

**Security Check:**
- ✅ User ID: `101` (nginx user, not root)
- ✅ Group ID: `101` (nginx group)
- ✅ No root privileges

### 4. **Test Security Headers**
```bash
# Check for security headers in HTTP response
curl -I http://localhost:3000/
```

**Expected Output:**
```
HTTP/1.1 200 OK
Server: nginx/1.29.1
Date: Mon, 01 Sep 2025 20:46:39 GMT
Content-Type: text/html
Content-Length: 770
Last-Modified: Mon, 01 Sep 2025 20:45:57 GMT
Connection: keep-alive
ETag: "68b60605-302"
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self';
Accept-Ranges: bytes
```

**Security Headers Verified:**
- ✅ `X-Frame-Options: SAMEORIGIN` (prevents clickjacking)
- ✅ `X-Content-Type-Options: nosniff` (prevents MIME sniffing)
- ✅ `X-XSS-Protection: 1; mode=block` (XSS protection)
- ✅ `Strict-Transport-Security: max-age=31536000; includeSubDomains` (HSTS)
- ✅ `Content-Security-Policy` (resource loading restrictions)
- ✅ `Referrer-Policy: strict-origin-when-cross-origin` (referrer control)

## 🏥 **Health Check Verification**

### 5. **Test Health Endpoint**
```bash
# Verify health check endpoint is responding
curl -s http://localhost:3000/health
```

**Expected Output:**
```
healthy
```

**Health Check Indicators:**
- ✅ Status Code: `200 OK`
- ✅ Response: `healthy`
- ✅ Response Time: < 1 second

### 6. **Verify Health Check Status**
```bash
# Check container health status via Docker
docker inspect --format='{{.State.Health.Status}}' todo-frontend
```

**Expected Output:**
```
healthy
```

## 📊 **Performance Monitoring**

### 7. **Resource Usage Check**
```bash
# Monitor container resource usage
docker stats todo-frontend --no-stream
```

**Expected Output:**
```
CONTAINER ID   NAME            CPU %     MEM USAGE / LIMIT   MEM %     NET I/O           BLOCK I/O     PIDS
6300e12e20b7   todo-frontend   0.00%     3.258MiB / 512MiB   0.64%     2.01kB / 1.61kB   0B / 12.3kB   2
```

**Performance Indicators:**
- ✅ CPU Usage: Low (< 1%)
- ✅ Memory Usage: Within limits (3.258MiB / 512MiB)
- ✅ Memory Percentage: Low (0.64%)
- ✅ Process Count: Minimal (2 PIDs)
- ✅ Network I/O: Minimal activity

### 8. **Container Security Scan**
```bash
# Run Docker Scout security scan
docker scout quickview todo-frontend
```

**Note:** Requires Docker login for full scan
**Expected Output:** Security recommendations or "No vulnerabilities found"

## 🚫 **Rate Limiting Test**

### 9. **Test API Rate Limiting**
```bash
# Test rate limiting by making rapid requests
for i in {1..15}; do 
    echo "Request $i:"; 
    curl -s -w "Status: %{http_code}\n" http://localhost:3000/api/health; 
    sleep 0.1; 
done
```

**Expected Behavior:**
- ✅ First 5-10 requests: `200 OK` or `404 Not Found` (normal responses)
- ✅ Subsequent requests: `503 Service Unavailable` (rate limited)
- ✅ Rate limiting is working correctly

**Rate Limiting Configuration:**
- API Zone: 10 requests/second with 5 burst
- General Zone: 30 requests/second with 20 burst

## 🌐 **Functionality Tests**

### 10. **Main Page Access**
```bash
# Test main application page
curl -s http://localhost:3000/ | head -10
```

**Expected Output:**
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Todo App - Manage Your Tasks</title>
    <meta name="description" content="A modern todo application built with React, TypeScript, and Chakra UI" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
```

**Functionality Indicators:**
- ✅ HTML Response: Valid HTML structure
- ✅ Title: "Todo App - Manage Your Tasks"
- ✅ Meta Tags: Proper SEO and viewport settings
- ✅ Resource Links: Fonts and assets loading

### 11. **API Proxy Test**
```bash
# Test API proxy to backend
curl -s http://localhost:3000/api/health
```

**Expected Output:**
```
{"success":false,"message":"Route not found"}
```

**Proxy Indicators:**
- ✅ Response: JSON from backend (even if route not found)
- ✅ Proxy Working: Request reaches backend via internal network
- ✅ Network Connectivity: `todo-backend:3001` accessible

## 🔧 **Advanced Testing Commands**

### 12. **Container Inspection**
```bash
# Detailed container information
docker inspect todo-frontend
```

**Key Information to Verify:**
- ✅ User: `"User": "101:101"`
- ✅ Network: Connected to `backend_todo-network`
- ✅ Health Check: Properly configured
- ✅ Resource Limits: CPU and memory limits set

### 13. **Log Analysis**
```bash
# Check container logs for errors
docker logs todo-frontend
```

**Expected Logs:**
```
/docker-entrypoint.sh: Configuration complete; ready for start up
```

**Log Indicators:**
- ✅ No error messages
- ✅ Nginx started successfully
- ✅ Configuration loaded properly

### 14. **Network Connectivity**
```bash
# Verify network connectivity
docker network inspect backend_todo-network
```

**Expected Output:**
```
[
    {
        "Name": "backend_todo-network",
        "Containers": {
            "todo-frontend": {
                "IPv4Address": "172.19.0.x/16"
            },
            "todo-backend": {
                "IPv4Address": "172.19.0.x/16"
            }
        }
    }
]
```

## 📋 **Testing Checklist**

### ✅ **Pre-Deployment Checks**
- [ ] Environment variables loaded correctly
- [ ] Docker image built without errors
- [ ] Container started successfully

### ✅ **Security Verification**
- [ ] Non-root user (UID 101)
- [ ] Security headers present
- [ ] Rate limiting functional
- [ ] Read-only filesystem (if applicable)

### ✅ **Performance Verification**
- [ ] Health checks passing
- [ ] Resource usage within limits
- [ ] Response times acceptable
- [ ] Memory usage stable

### ✅ **Functionality Verification**
- [ ] Main page accessible
- [ ] Health endpoint responding
- [ ] API proxy working
- [ ] Backend connectivity established

### ✅ **Monitoring Setup**
- [ ] Logs accessible
- [ ] Metrics available
- [ ] Health status visible
- [ ] Resource monitoring active

## 🚨 **Troubleshooting Commands**

### **Container Issues**
```bash
# Restart container
docker restart todo-frontend

# Check detailed logs
docker logs -f todo-frontend

# Enter container for debugging
docker exec -it todo-frontend sh

# Check container resource usage
docker stats todo-frontend
```

### **Network Issues**
```bash
# Check network connectivity
docker network ls
docker network inspect backend_todo-network

# Test internal communication
docker exec todo-frontend ping todo-backend
```

### **Security Issues**
```bash
# Verify user permissions
docker exec todo-frontend id
docker exec todo-frontend ls -la /usr/share/nginx/html

# Check security headers
curl -I http://localhost:3000/
```

## 📊 **Performance Benchmarks**

### **Expected Performance Metrics**
- **Startup Time**: < 30 seconds
- **Memory Usage**: < 50MB (initial), < 100MB (under load)
- **CPU Usage**: < 5% (idle), < 20% (under load)
- **Response Time**: < 100ms (health check), < 500ms (main page)
- **Concurrent Requests**: 30r/s (general), 10r/s (API)

### **Load Testing**
```bash
# Basic load test
ab -n 100 -c 10 http://localhost:3000/health

# API load test
ab -n 50 -c 5 http://localhost:3000/api/health
```

## 🎯 **Success Criteria**

The container is considered **successfully deployed** when:

1. ✅ **Container Status**: Running and healthy
2. ✅ **Security**: Non-root user, headers present, rate limiting active
3. ✅ **Performance**: Resource usage within limits, response times acceptable
4. ✅ **Functionality**: All endpoints accessible, proxy working
5. ✅ **Monitoring**: Logs available, health checks passing
6. ✅ **Network**: Backend connectivity established

## 📚 **Additional Resources**

- [Docker Security Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Nginx Configuration Guide](https://nginx.org/en/docs/)
- [Container Health Checks](https://docs.docker.com/engine/reference/builder/#healthcheck)
- [Rate Limiting with Nginx](https://nginx.org/en/docs/http/ngx_http_limit_req_module.html) 