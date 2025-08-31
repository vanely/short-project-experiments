# Production Scalability Guide: Nginx + Kubernetes + Prometheus

A comprehensive guide for building production-ready, auto-scaling web applications using Nginx, Kubernetes, and Prometheus.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Nginx Configuration](#nginx-configuration)
3. [Connection Pool Management](#connection-pool-management)
4. [Kubernetes Deployment](#kubernetes-deployment)
5. [Auto-Scaling Configuration](#auto-scaling-configuration)
6. [Monitoring & Observability](#monitoring--observability)
7. [Production Deployment](#production-deployment)
8. [Troubleshooting](#troubleshooting)
9. [Best Practices](#best-practices)

## Architecture Overview

### Production Architecture
```
┌─────────────────────────────────────────────────────────────────┐
│                        Kubernetes Cluster                         │
│                                                                   │
│  ┌─────────────────┐    ┌─────────────────┐    ┌──────────────┐  │
│  │ Ingress         │    │ HPA Controller  │    │ Prometheus   │  │
│  │ Controller      │    │ (Auto-scaling)  │    │ (Monitoring) │  │
│  │ (nginx-ingress) │    └─────────────────┘    └──────────────┘  │
│  └─────────────────┘                                    │         │
│           │                                              │         │
│           ▼                                              │         │
│  ┌─────────────────┐    ┌─────────────────┐             │         │
│  │ Nginx Pod 1     │    │ Nginx Pod 2     │             │         │
│  │ (3 workers)     │    │ (3 workers)     │             │         │
│  │ [1024 conn]     │    │ [1024 conn]     │◄────────────┘         │
│  └─────────────────┘    └─────────────────┘                        │
│           │                       │                               │
│           ▼                       ▼                               │
│  ┌─────────────────┐    ┌─────────────────┐                       │
│  │ Backend Pod 1   │    │ Backend Pod 2   │                       │
│  │ (Express.js)    │    │ (Express.js)    │                       │
│  └─────────────────┘    └─────────────────┘                       │
│           │                       │                               │
│           └───────────────────────┼───────────────────────────────┘
│                                   ▼
│                        ┌─────────────────┐
│                        │ PostgreSQL      │
│                        │ (Database)     │
│                        └─────────────────┘
└─────────────────────────────────────────────────────────────────┘
```

### Key Components

1. **Nginx**: High-performance web server with connection pooling
2. **Kubernetes**: Container orchestration and auto-scaling
3. **Prometheus**: Metrics collection and monitoring
4. **Horizontal Pod Autoscaler (HPA)**: Automatic scaling based on metrics
5. **Custom Metrics API**: Connection pool utilization monitoring

## Nginx Configuration

### Production Nginx Configuration

```nginx
# nginx.conf
events {
    worker_connections 1024;
    use epoll;
    multi_accept on;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    # Logging
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for" '
                    'rt=$request_time uct="$upstream_connect_time" '
                    'uht="$upstream_header_time" urt="$upstream_response_time"';

    access_log /var/log/nginx/access.log main;
    error_log /var/log/nginx/error.log warn;

    # Performance optimizations
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    keepalive_requests 100;
    types_hash_max_size 2048;
    client_max_body_size 10M;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=login:10m rate=1r/s;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_comp_level 6;
    gzip_proxied any;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;

    # Upstream backend servers
    upstream backend {
        least_conn;
        server backend1:3001 max_fails=3 fail_timeout=30s;
        server backend2:3001 max_fails=3 fail_timeout=30s;
        server backend3:3001 max_fails=3 fail_timeout=30s;
        keepalive 32;
    }

    server {
        listen 80;
        server_name localhost;

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Referrer-Policy "no-referrer-when-downgrade" always;
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
            add_header Vary "Accept-Encoding";
        }

        # API routes with rate limiting
        location /api/ {
            limit_req zone=api burst=20 nodelay;
            
            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
            
            # Timeout settings
            proxy_connect_timeout 60s;
            proxy_send_timeout 60s;
            proxy_read_timeout 60s;
            
            # Buffer settings
            proxy_buffering on;
            proxy_buffer_size 4k;
            proxy_buffers 8 4k;
        }

        # Metrics endpoint for Prometheus
        location /metrics {
            stub_status on;
            access_log off;
            allow 127.0.0.1;
            allow 10.0.0.0/8;  # Kubernetes cluster IPs
            deny all;
        }

        # Health check endpoint
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }

        # SPA routing (React Router)
        location / {
            try_files $uri $uri/ /index.html;
        }
    }
}
```

### Nginx Dockerfile

```dockerfile
# Multi-stage build for production
FROM nginx:alpine

# Install additional tools
RUN apk add --no-cache curl wget

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Create nginx user
RUN addgroup -g 1001 -S nginx && \
    adduser -S -D -H -u 1001 -h /var/cache/nginx -s /sbin/nologin -G nginx -g nginx nginx

# Set permissions
RUN chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/health || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

## Connection Pool Management

### Understanding Connection Pools

```c
// Nginx connection structure
typedef struct {
    int fd;                    // File descriptor
    ngx_connection_t *conn;    // Connection object
    ngx_event_t *read_event;   // Read event
    ngx_event_t *write_event;  // Write event
    ngx_uint_t requests;       // Number of requests
} ngx_connection_t;

// Connection pool (fixed size)
ngx_connection_t *connections[1024];  // worker_connections limit
```

### Connection States

1. **Idle**: Available for new requests
2. **Active**: Processing request
3. **Keep-alive**: Waiting for next request
4. **Closing**: Being terminated

### Connection Pool Monitoring

```bash
# Check current connections
curl http://nginx-pod:80/metrics

# Output:
nginx_connections_active 819    # Active connections
nginx_connections_reading 45     # Reading requests
nginx_connections_writing 123    # Writing responses
nginx_connections_waiting 651    # Keep-alive connections

# Calculate utilization
utilization = (active_connections / worker_connections) * 100
# Example: (819 / 1024) * 100 = 80%
```

### Scaling Triggers

| Utilization | Action | Response Time |
|-------------|--------|---------------|
| < 50% | No action | Normal |
| 50-80% | Monitor | Normal |
| 80-95% | Scale up | Slight delay |
| > 95% | Emergency scale | Delays possible |

## Kubernetes Deployment

### Deployment Configuration

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-backend
  labels:
    app: nginx-backend
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: nginx-backend
  template:
    metadata:
      labels:
        app: nginx-backend
      annotations:
        prometheus.io/scrape: "true"
        prometheus.io/port: "80"
        prometheus.io/path: "/metrics"
    spec:
      containers:
      - name: nginx
        image: nginx-backend:latest
        ports:
        - containerPort: 80
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 80
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /health
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 5
          timeoutSeconds: 3
          failureThreshold: 3
        volumeMounts:
        - name: nginx-config
          mountPath: /etc/nginx/nginx.conf
          subPath: nginx.conf
        - name: nginx-logs
          mountPath: /var/log/nginx
      volumes:
      - name: nginx-config
        configMap:
          name: nginx-config
      - name: nginx-logs
        emptyDir: {}
```

### Service Configuration

```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-backend-service
spec:
  selector:
    app: nginx-backend
  ports:
  - protocol: TCP
    port: 80
    targetPort: 80
  type: ClusterIP
```

### Ingress Configuration

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: nginx-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/rate-limit: "100"
    nginx.ingress.kubernetes.io/rate-limit-window: "1m"
spec:
  rules:
  - host: api.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: nginx-backend-service
            port:
              number: 80
  tls:
  - hosts:
    - api.example.com
    secretName: api-tls-secret
```

## Auto-Scaling Configuration

### Horizontal Pod Autoscaler (HPA)

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: nginx-connection-pool-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: nginx-backend
  minReplicas: 3
  maxReplicas: 20
  metrics:
  # Primary: Connection pool utilization
  - type: Object
    object:
      metric:
        name: nginx_connection_pool_utilization
      describedObject:
        apiVersion: v1
        kind: Service
        name: nginx-backend-service
      target:
        type: AverageValue
        averageValue: 80  # Scale when 80% of connection pool is used
  
  # Secondary: CPU usage
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  
  # Tertiary: Memory usage
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
  
  behavior:
    scaleUp:
      stabilizationWindowSeconds: 60  # Wait 1 minute before scaling up
      policies:
      - type: Percent
        value: 100
        periodSeconds: 15  # Scale up by 100% every 15 seconds
      - type: Pods
        value: 2
        periodSeconds: 15  # Or scale up by 2 pods every 15 seconds
      selectPolicy: Max
    scaleDown:
      stabilizationWindowSeconds: 300  # Wait 5 minutes before scaling down
      policies:
      - type: Percent
        value: 10
        periodSeconds: 60  # Scale down by 10% every minute
      - type: Pods
        value: 1
        periodSeconds: 60  # Or scale down by 1 pod every minute
      selectPolicy: Min
```

### Vertical Pod Autoscaler (VPA)

```yaml
apiVersion: autoscaling.k8s.io/v1
kind: VerticalPodAutoscaler
metadata:
  name: nginx-vpa
spec:
  targetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: nginx-backend
  updatePolicy:
    updateMode: "Auto"
  resourcePolicy:
    containerPolicies:
    - containerName: '*'
      minAllowed:
        cpu: 100m
        memory: 128Mi
      maxAllowed:
        cpu: 1000m
        memory: 1Gi
      controlledValues: RequestsAndLimits
```

### Custom Metrics API

```yaml
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  name: nginxconnectionpools.nginx.example.com
spec:
  group: nginx.example.com
  names:
    kind: NginxConnectionPool
    listKind: NginxConnectionPoolList
    plural: nginxconnectionpools
    singular: nginxconnectionpool
  scope: Namespaced
  versions:
  - name: v1
    served: true
    storage: true
    schema:
      openAPIV3Schema:
        type: object
        properties:
          spec:
            type: object
            properties:
              maxConnections:
                type: integer
                description: Maximum connections per worker
              currentConnections:
                type: integer
                description: Current active connections
              connectionUtilization:
                type: number
                format: float
                description: Connection pool utilization percentage
```

## Monitoring & Observability

### Prometheus Configuration

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: prometheus-config
data:
  prometheus.yml: |
    global:
      scrape_interval: 15s
      evaluation_interval: 15s
    
    rule_files:
      - "nginx_rules.yml"
    
    scrape_configs:
      - job_name: 'nginx-backend'
        static_configs:
          - targets: ['nginx-backend-service:80']
        metrics_path: /metrics
        scrape_interval: 10s
        scrape_timeout: 5s
        
      - job_name: 'kubernetes-pods'
        kubernetes_sd_configs:
          - role: pod
        relabel_configs:
          - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
            action: keep
            regex: true
          - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_path]
            action: replace
            target_label: __metrics_path__
            regex: (.+)
          - source_labels: [__address__, __meta_kubernetes_pod_annotation_prometheus_io_port]
            action: replace
            regex: ([^:]+)(?::\d+)?;(\d+)
            replacement: $1:$2
            target_label: __address__
    
    nginx_rules.yml: |
      groups:
      - name: nginx_connection_pool
        rules:
        - record: nginx_connection_pool_utilization
          expr: (nginx_connections_active / 1024) * 100
        
        - alert: NginxConnectionPoolHigh
          expr: nginx_connection_pool_utilization > 80
          for: 2m
          labels:
            severity: warning
          annotations:
            summary: "Nginx connection pool utilization is high"
            description: "Connection pool is {{ $value }}% utilized"
        
        - alert: NginxConnectionPoolCritical
          expr: nginx_connection_pool_utilization > 95
          for: 1m
          labels:
            severity: critical
          annotations:
            summary: "Nginx connection pool is nearly full"
            description: "Connection pool is {{ $value }}% utilized"
```

### Grafana Dashboard

```json
{
  "dashboard": {
    "title": "Nginx Connection Pool Monitoring",
    "panels": [
      {
        "title": "Connection Pool Utilization",
        "type": "graph",
        "targets": [
          {
            "expr": "nginx_connection_pool_utilization",
            "legendFormat": "{{pod}}"
          }
        ],
        "thresholds": [
          {"value": 80, "color": "yellow"},
          {"value": 95, "color": "red"}
        ]
      },
      {
        "title": "Active Connections",
        "type": "graph",
        "targets": [
          {
            "expr": "nginx_connections_active",
            "legendFormat": "{{pod}}"
          }
        ]
      },
      {
        "title": "Request Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(nginx_http_requests_total[5m])",
            "legendFormat": "{{pod}}"
          }
        ]
      }
    ]
  }
}
```

### Alerting Rules

```yaml
apiVersion: monitoring.coreos.com/v1alpha1
kind: PrometheusRule
metadata:
  name: nginx-alerts
spec:
  groups:
  - name: nginx
    rules:
    - alert: HighConnectionPoolUtilization
      expr: nginx_connection_pool_utilization > 80
      for: 2m
      labels:
        severity: warning
      annotations:
        summary: "High connection pool utilization"
        description: "Connection pool is {{ $value }}% utilized"
    
    - alert: CriticalConnectionPoolUtilization
      expr: nginx_connection_pool_utilization > 95
      for: 1m
      labels:
        severity: critical
      annotations:
        summary: "Critical connection pool utilization"
        description: "Connection pool is {{ $value }}% utilized"
    
    - alert: NginxPodDown
      expr: up{job="nginx-backend"} == 0
      for: 1m
      labels:
        severity: critical
      annotations:
        summary: "Nginx pod is down"
        description: "Pod {{ $labels.pod }} is not responding"
```

## Production Deployment

### Deployment Script

```bash
#!/bin/bash
# deploy.sh - Production deployment script

set -e

# Configuration
NAMESPACE="production"
REPLICAS=3
IMAGE_TAG="latest"

echo "🚀 Starting production deployment..."

# Create namespace
kubectl create namespace $NAMESPACE --dry-run=client -o yaml | kubectl apply -f -

# Apply configurations
echo "📦 Applying Kubernetes configurations..."
kubectl apply -f k8s-nginx-deployment.yaml -n $NAMESPACE
kubectl apply -f k8s-custom-metrics.yaml -n $NAMESPACE
kubectl apply -f k8s-hpa.yaml -n $NAMESPACE
kubectl apply -f k8s-prometheus-config.yaml -n $NAMESPACE

# Wait for deployments
echo "⏳ Waiting for deployments to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/nginx-backend -n $NAMESPACE
kubectl wait --for=condition=available --timeout=300s deployment/prometheus -n $NAMESPACE

# Check HPA status
echo "📊 Checking HPA status..."
kubectl get hpa -n $NAMESPACE

# Check pod status
echo "🔍 Checking pod status..."
kubectl get pods -n $NAMESPACE

# Check services
echo "🌐 Checking services..."
kubectl get svc -n $NAMESPACE

echo "✅ Deployment completed successfully!"
```

### Health Check Script

```bash
#!/bin/bash
# health-check.sh - Production health check

NAMESPACE="production"
SERVICE="nginx-backend-service"

echo "🏥 Performing health checks..."

# Check pod readiness
echo "📋 Checking pod readiness..."
kubectl get pods -n $NAMESPACE -l app=nginx-backend

# Check service endpoints
echo "🔗 Checking service endpoints..."
kubectl get endpoints -n $NAMESPACE $SERVICE

# Check HPA status
echo "📈 Checking HPA status..."
kubectl get hpa -n $NAMESPACE

# Check metrics
echo "📊 Checking metrics..."
kubectl get --raw "/apis/custom.metrics.k8s.io/v1beta1/namespaces/$NAMESPACE/services/$SERVICE/nginx_connection_pool_utilization"

# Check Prometheus targets
echo "🎯 Checking Prometheus targets..."
kubectl port-forward svc/prometheus-service 9090:9090 -n $NAMESPACE &
sleep 5
curl -s http://localhost:9090/api/v1/targets | jq '.data.activeTargets[] | select(.labels.job=="nginx-backend")'

echo "✅ Health checks completed!"
```

## Troubleshooting

### Common Issues

#### 1. Connection Pool Exhaustion

**Symptoms:**
- `accept() failed (24: Too many open files)`
- High connection pool utilization
- Connection refused errors

**Solutions:**
```bash
# Check current connections
kubectl exec -it nginx-pod -- curl http://localhost/metrics

# Increase worker connections
# Edit nginx.conf: worker_connections 2048;

# Scale up pods
kubectl scale deployment nginx-backend --replicas=5
```

#### 2. HPA Not Scaling

**Symptoms:**
- High utilization but no new pods
- HPA status shows no scaling

**Solutions:**
```bash
# Check HPA status
kubectl describe hpa nginx-connection-pool-hpa

# Check custom metrics
kubectl get --raw "/apis/custom.metrics.k8s.io/v1beta1/namespaces/default/services/nginx-backend-service/nginx_connection_pool_utilization"

# Check Prometheus metrics
kubectl port-forward svc/prometheus-service 9090:9090 &
curl "http://localhost:9090/api/v1/query?query=nginx_connection_pool_utilization"
```

#### 3. Prometheus Not Scraping

**Symptoms:**
- No metrics in Prometheus
- Targets showing as down

**Solutions:**
```bash
# Check Prometheus targets
kubectl port-forward svc/prometheus-service 9090:9090 &
curl http://localhost:9090/api/v1/targets

# Check nginx metrics endpoint
kubectl exec -it nginx-pod -- curl http://localhost/metrics

# Check service connectivity
kubectl exec -it nginx-pod -- curl http://nginx-backend-service/metrics
```

### Debugging Commands

```bash
# Check nginx logs
kubectl logs -f deployment/nginx-backend

# Check Prometheus logs
kubectl logs -f deployment/prometheus

# Check HPA events
kubectl get events --sort-by='.lastTimestamp' | grep HorizontalPodAutoscaler

# Check resource usage
kubectl top pods -l app=nginx-backend

# Check network policies
kubectl get networkpolicies

# Check ingress status
kubectl get ingress
kubectl describe ingress nginx-ingress
```

## Best Practices

### 1. Resource Planning

```yaml
# Calculate required resources
# Formula: (CPU cores × 2) + 1 workers
# Example: 4 CPU cores = 9 workers
worker_processes 9;
events {
    worker_connections 1024;
}
# Total connections: 9 × 1024 = 9,216
```

### 2. Monitoring Strategy

- **Real-time metrics**: Connection pool utilization
- **Alerting**: 80% and 95% thresholds
- **Logging**: Structured logs with correlation IDs
- **Tracing**: Distributed tracing for request flows

### 3. Security Considerations

```nginx
# Security headers
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

# Rate limiting
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
limit_req zone=api burst=20 nodelay;
```

### 4. Performance Optimization

```nginx
# Enable compression
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_comp_level 6;

# Enable caching
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 5. Auto-Scaling Best Practices

- **Multiple metrics**: Connection pool + CPU + Memory
- **Stabilization windows**: Prevent thrashing
- **Gradual scaling**: Avoid sudden spikes
- **Monitoring**: Track scaling effectiveness

### 6. Disaster Recovery

```bash
# Backup configuration
kubectl get configmap nginx-config -o yaml > nginx-config-backup.yaml

# Restore configuration
kubectl apply -f nginx-config-backup.yaml

# Rollback deployment
kubectl rollout undo deployment/nginx-backend
```

## Conclusion

This guide provides a comprehensive approach to building production-ready, auto-scaling web applications using Nginx, Kubernetes, and Prometheus. The key components work together to provide:

- **High Performance**: Nginx with optimized connection pooling
- **Auto-Scaling**: Kubernetes HPA based on connection pool utilization
- **Monitoring**: Prometheus with custom metrics and alerting
- **Reliability**: Health checks, rolling updates, and disaster recovery

By following these configurations and best practices, you can build scalable, resilient web applications that automatically handle traffic spikes and maintain optimal performance.

## Additional Resources

- [Nginx Documentation](https://nginx.org/en/docs/)
- [Kubernetes HPA Documentation](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/)
- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Dashboards](https://grafana.com/grafana/dashboards/) 