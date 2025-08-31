# Docker Setup for Todo Backend

This directory contains Docker configuration files to run the PostgreSQL database and backend application in containers.

## Files Overview

- `Dockerfile.postgres` - PostgreSQL database container
- `Dockerfile` - Backend application container
- `docker-compose.yml` - Orchestrates both services
- `docker/postgres/init.sql` - Database initialization script
- `env.example` - Environment variables template

## Quick Start

### Option 1: Using Docker Compose (Recommended)

1. **Copy environment variables:**
   ```bash
   cp env.example .env
   ```

2. **Start all services:**
   ```bash
   docker-compose up -d
   ```

3. **Check services:**
   ```bash
   docker-compose ps
   ```

4. **View logs:**
   ```bash
   docker-compose logs -f
   ```

### Option 2: Running PostgreSQL Only

1. **Build and run PostgreSQL:**
   ```bash
   docker build -f Dockerfile.postgres -t todo-postgres .
   docker run -d \
     --name todo-postgres \
     -e POSTGRES_DB=todo_db \
     -e POSTGRES_USER=todo_user \
     -e POSTGRES_PASSWORD=todo_password \
     -p 5432:5432 \
     todo-postgres
   ```

2. **Connect to database:**
   ```bash
   docker exec -it todo-postgres psql -U todo_user -d todo_db
   ```

## Database Configuration

### Environment Variables

- `POSTGRES_DB=todo_db` - Database name
- `POSTGRES_USER=todo_user` - Database user
- `POSTGRES_PASSWORD=todo_password` - Database password
- `DATABASE_URL=postgresql://todo_user:todo_password@postgres:5432/todo_db` - Connection string

### Database Schema

The PostgreSQL container automatically creates:
- `todos` table with columns: `id`, `title`, `description`, `completed`, `createdAt`, `updatedAt`
- Indexes for better performance
- Sample data for testing

## Connecting from Backend

### Local Development
```bash
DATABASE_URL="postgresql://todo_user:todo_password@localhost:5432/todo_db"
```

### Docker Compose
```bash
DATABASE_URL="postgresql://todo_user:todo_password@postgres:5432/todo_db"
```

## Useful Commands

### Database Operations
```bash
# Connect to database
docker exec -it todo-postgres psql -U todo_user -d todo_db

# View database logs
docker logs todo-postgres

# Reset database
docker-compose down -v
docker-compose up -d
```

### Backend Operations
```bash
# Run Prisma migrations
docker exec -it todo-backend npx prisma migrate dev

# Generate Prisma client
docker exec -it todo-backend npx prisma generate

# Open Prisma Studio
docker exec -it todo-backend npx prisma studio
```

### Container Management
```bash
# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Rebuild containers
docker-compose build --no-cache

# View resource usage
docker stats
```

## Troubleshooting

### Common Issues

1. **Port already in use:**
   ```bash
   # Check what's using port 5432
   lsof -i :5432
   # Kill the process or change port in docker-compose.yml
   ```

2. **Database connection failed:**
   - Ensure PostgreSQL container is running: `docker ps`
   - Check logs: `docker logs todo-postgres`
   - Verify DATABASE_URL in .env file

3. **Prisma client not generated:**
   ```bash
   docker exec -it todo-backend npx prisma generate
   ```

### Health Checks

- PostgreSQL: `docker exec -it todo-postgres pg_isready -U todo_user`
- Backend: `curl http://localhost:3001/health`

## Production Considerations

For production deployment:

1. **Use strong passwords:**
   ```bash
   POSTGRES_PASSWORD=your_secure_password_here
   ```

2. **Enable SSL:**
   ```bash
   DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"
   ```

3. **Use external volume mounts:**
   ```yaml
   volumes:
     - /path/to/data:/var/lib/postgresql/data
   ```

4. **Set up backups:**
   ```bash
   docker exec -t todo-postgres pg_dumpall -c -U todo_user > backup.sql
   ```

## Network Configuration

The Docker Compose setup creates a custom network `todo-network` that allows:
- Backend to connect to PostgreSQL using hostname `postgres`
- Isolated communication between services
- Easy scaling and service discovery 