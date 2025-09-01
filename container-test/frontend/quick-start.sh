#!/bin/bash

echo "🎯 Quick Start for Todo Frontend (Production Ready)"
echo "=================================================="

# Check if .env exists
if [ ! -f .env.production ]; then
    echo "⚠️  .env.production file not found!"
    echo "📝 Copying env.example to .env.production..."
    cp env.example .env.production
    echo "✅ Please update .env.production with your production settings before continuing"
    echo "   Key settings to review:"
    echo "   - DOCKER_NETWORK_NAME"
    echo "   - VITE_DEV_MODE (should be false in production)"
    echo "   - Resource limits"
    echo ""
    read -p "Press Enter after updating .env.production file..."
fi

# Load environment variables from .env file
echo "📋 Loading environment variables from .env file..."
if [ -f .env.production ]; then
    # Load environment variables safely, handling complex values
    while IFS= read -r line; do
        # Skip comments and empty lines
        [[ $line =~ ^[[:space:]]*# ]] && continue
        [[ -z $line ]] && continue
        
        # Export the variable
        export "$line"
    done < .env.production
    echo "✅ Environment variables loaded"
else
    echo "❌ .env.production file not found"
    exit 1
fi

# Validate critical environment variables
echo "🔍 Validating environment configuration..."
if [ -z "$DOCKER_NETWORK_NAME" ]; then
    echo "❌ DOCKER_NETWORK_NAME not set in .env.production"
    exit 1
fi

if [ "$VITE_DEV_MODE" = "true" ]; then
    echo "⚠️  Warning: VITE_DEV_MODE is set to true (should be false in production)"
fi

# Stop and remove existing container if running
echo "🛑 Stopping existing frontend container..."
docker stop ${DOCKER_CONTAINER_NAME:-todo-frontend} 2>/dev/null || true
docker rm ${DOCKER_CONTAINER_NAME:-todo-frontend} 2>/dev/null || true

# Build Docker image without cache
echo "🔨 Building Docker image (no cache)..."
docker build --no-cache -t ${DOCKER_CONTAINER_NAME:-todo-frontend} .

if [ $? -eq 0 ]; then
    echo "✅ Docker image built successfully"
else
    echo "❌ Docker build failed"
    exit 1
fi

# Start the container with production-ready configuration
echo "🚀 Starting frontend container with production settings..."
docker run -d \
    --name ${DOCKER_CONTAINER_NAME:-todo-frontend} \
    -p ${DOCKER_PORT:-3000}:3000 \
    --network ${DOCKER_NETWORK_NAME} \
    --user ${DOCKER_UID:-101}:${DOCKER_GID:-101} \
    --cpus=${DOCKER_CPU_LIMIT:-0.5} \
    --memory=${DOCKER_MEMORY_LIMIT:-512m} \
    --cpu-shares=${DOCKER_CPU_SHARES:-512} \
    --memory-reservation=${DOCKER_MEMORY_RESERVATION:-256m} \
    --restart unless-stopped \
    --health-cmd="curl -f http://localhost:3000/health || exit 1" \
    --health-interval=${HEALTH_CHECK_INTERVAL:-30s} \
    --health-timeout=${HEALTH_CHECK_TIMEOUT:-10s} \
    --health-retries=${HEALTH_CHECK_RETRIES:-3} \
    --health-start-period=${HEALTH_CHECK_START_PERIOD:-30s} \
    -e VITE_API_BASE_URL="${VITE_API_BASE_URL:-http://localhost:3001}" \
    -e VITE_API_TIMEOUT="${VITE_API_TIMEOUT:-10000}" \
    -e VITE_DEV_MODE="${VITE_DEV_MODE:-false}" \
    -e VITE_ENABLE_DEVTOOLS="${VITE_ENABLE_DEVTOOLS:-false}" \
    -e NODE_ENV="${NODE_ENV:-production}" \
    -e VITE_APP_ENV="${VITE_APP_ENV:-production}" \
    -e VITE_APP_VERSION="${VITE_APP_VERSION:-1.0.0}" \
    -e VITE_ENABLE_METRICS="${VITE_ENABLE_METRICS:-true}" \
    -e VITE_METRICS_ENDPOINT="${VITE_METRICS_ENDPOINT:-/metrics}" \
    ${DOCKER_CONTAINER_NAME:-todo-frontend}

if [ $? -eq 0 ]; then
    echo "✅ Frontend container started successfully"
    echo ""
    echo "🌐 Frontend is available at: http://localhost:${DOCKER_PORT:-3000}"
    echo "🔗 Backend should be running at: ${VITE_API_BASE_URL:-http://localhost:3001}"
    echo "🔒 Production mode: ${VITE_DEV_MODE:-false}"
    echo "📊 Resource limits: CPU ${DOCKER_CPU_LIMIT:-0.5}, Memory ${DOCKER_MEMORY_LIMIT:-512m}"
    echo ""
    echo "📊 Container status:"
    docker ps --filter name=${DOCKER_CONTAINER_NAME:-todo-frontend}
    echo ""
    echo "📋 Container logs:"
    docker logs ${DOCKER_CONTAINER_NAME:-todo-frontend}
    echo ""
    echo "🔍 Health check:"
    sleep 5
    docker inspect --format='{{.State.Health.Status}}' ${DOCKER_CONTAINER_NAME:-todo-frontend} 2>/dev/null || echo "Health check not available"
    echo ""
    echo "🛑 To stop the container: docker stop ${DOCKER_CONTAINER_NAME:-todo-frontend}"
    echo "🗑️  To remove the container: docker rm ${DOCKER_CONTAINER_NAME:-todo-frontend}"
    echo "📊 To view logs: docker logs -f ${DOCKER_CONTAINER_NAME:-todo-frontend}"
    echo "🔍 To inspect: docker inspect ${DOCKER_CONTAINER_NAME:-todo-frontend}"
else
    echo "❌ Failed to start frontend container"
    exit 1
fi 