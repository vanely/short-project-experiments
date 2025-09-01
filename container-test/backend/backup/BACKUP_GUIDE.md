# PostgreSQL Backup & Recovery Guide

A comprehensive guide for implementing production-ready PostgreSQL backup strategies with automated scheduling, monitoring, and recovery procedures.

## Table of Contents

1. [Backup Strategies](#backup-strategies)
2. [Manual Backup Operations](#manual-backup-operations)
3. [Automated Backup Setup](#automated-backup-setup)
4. [Backup Monitoring](#backup-monitoring)
5. [Recovery Procedures](#recovery-procedures)
6. [Backup Testing](#backup-testing)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)

## Backup Strategies

### 1. Full Database Dumps
- **Purpose**: Complete database backup
- **Frequency**: Daily
- **Retention**: 30 days
- **Format**: Custom PostgreSQL format (compressed)

### 2. Incremental Backups (WAL)
- **Purpose**: Point-in-time recovery
- **Frequency**: Continuous (WAL archiving)
- **Retention**: 4 weeks
- **Format**: WAL files

### 3. Volume Snapshots
- **Purpose**: Disaster recovery
- **Frequency**: Weekly
- **Retention**: 12 months
- **Format**: Tar archives

## Manual Backup Operations

### Quick Backup Commands

```bash
# Navigate to backup directory
cd backend/backup

# Make backup script executable
chmod +x postgres-backup.sh

# Full backup
./postgres-backup.sh full

# Incremental backup
./postgres-backup.sh incremental

# Volume snapshot
./postgres-backup.sh snapshot

# All backup types
./postgres-backup.sh all

# Restore from backup
./postgres-backup.sh restore /backups/postgres/full/postgres_backup_full_20241201_020000.sql.gz
```

### Manual Backup Examples

#### 1. Full Database Dump
```bash
# Connect to PostgreSQL container
podman exec -it todo-postgres psql -U todo_user -d todo_db

# Create full dump
podman exec todo-postgres pg_dump \
  -U todo_user \
  -d todo_db \
  --verbose \
  --clean \
  --if-exists \
  --create \
  --no-owner \
  --no-privileges \
  --format=custom \
  --file="/tmp/backup_$(date +%Y%m%d_%H%M%S).dump"

# Copy from container
podman cp todo-postgres:/tmp/backup_*.dump ./backups/
```

#### 2. Incremental Backup (WAL)
```bash
# Enable WAL archiving
podman exec todo-postgres psql -U todo_user -d todo_db -c "
ALTER SYSTEM SET archive_mode = on;
ALTER SYSTEM SET archive_command = 'cp %p /var/lib/postgresql/archive/%f';
SELECT pg_reload_conf();
"

# Trigger WAL switch
podman exec todo-postgres psql -U todo_user -d todo_db -c "SELECT pg_switch_wal();"

# Copy WAL files
podman cp todo-postgres:/var/lib/postgresql/archive/ ./backups/wal/
```

#### 3. Volume Snapshot
```bash
# Create volume snapshot
podman run --rm \
  -v backend_postgres_data:/source:ro \
  -v ./backups:/backup \
  alpine tar czf "/backup/snapshot_$(date +%Y%m%d_%H%M%S).tar.gz" -C /source .
```

## Automated Backup Setup

### 1. Docker Compose Backup Services

```bash
# Start backup services
cd backend/backup
podman-compose -f docker-compose.backup.yml up -d

# Check backup service status
podman-compose -f docker-compose.backup.yml ps

# View backup logs
podman-compose -f docker-compose.backup.yml logs -f postgres-backup
```

### 2. Kubernetes CronJob Setup

```bash
# Apply backup CronJob
kubectl apply -f k8s-backup-cronjob.yaml

# Check CronJob status
kubectl get cronjobs
kubectl describe cronjob postgres-backup-cronjob

# View job logs
kubectl get jobs
kubectl logs job/postgres-backup-cronjob-<timestamp>
```

### 3. Cron Schedule Configuration

```bash
# Edit cron schedule
podman exec postgres-backup crontab -l

# Add custom schedule
echo "0 2 * * * /scripts/postgres-backup.sh full" | podman exec -i postgres-backup crontab -
echo "0 6 * * 0 /scripts/postgres-backup.sh snapshot" | podman exec -i postgres-backup crontab -
```

## Backup Monitoring

### 1. Web Interface

```bash
# Access backup monitor
open http://localhost:8080

# Check backup status
curl http://localhost:8080/health
curl http://localhost:8080/stats
```

### 2. Command Line Monitoring

```bash
# Check backup files
ls -la /backups/postgres/full/
ls -la /backups/postgres/incremental/
ls -la /backups/postgres/snapshots/

# Check backup logs
tail -f /backups/postgres/logs/cron.log

# Check backup size
du -sh /backups/postgres/
```

### 3. Backup Verification

```bash
# Verify backup integrity
podman exec todo-postgres pg_restore --list /backups/postgres/full/latest_backup.sql.gz

# Test backup restoration
podman exec todo-postgres pg_restore --dry-run /backups/postgres/full/latest_backup.sql.gz
```

## Recovery Procedures

### 1. Full Database Recovery

```bash
# Stop applications
podman stop todo-backend

# Drop and recreate database
podman exec todo-postgres psql -U todo_user -c "DROP DATABASE IF EXISTS todo_db;"
podman exec todo-postgres psql -U todo_user -c "CREATE DATABASE todo_db;"

# Restore from backup
gunzip -c /backups/postgres/full/postgres_backup_full_20241201_020000.sql.gz | \
podman exec -i todo-postgres pg_restore -U todo_user -d todo_db

# Start applications
podman start todo-backend

# Verify recovery
podman exec todo-postgres psql -U todo_user -d todo_db -c "SELECT COUNT(*) FROM todos;"
```

### 2. Point-in-Time Recovery

```bash
# Stop PostgreSQL
podman stop todo-postgres

# Restore from base backup
gunzip -c /backups/postgres/full/base_backup.sql.gz | \
podman exec -i todo-postgres pg_restore -U todo_user -d todo_db

# Apply WAL files for point-in-time recovery
podman exec todo-postgres pg_wal_restore \
  --pgdata=/var/lib/postgresql/data \
  --recovery-target-time="2024-12-01 15:30:00" \
  /backups/postgres/incremental/wal/

# Start PostgreSQL
podman start todo-postgres
```

### 3. Volume Snapshot Recovery

```bash
# Stop PostgreSQL
podman stop todo-postgres

# Remove current volume
podman volume rm backend_postgres_data

# Create new volume from snapshot
podman run --rm \
  -v backend_postgres_data:/target \
  -v ./backups/snapshots:/backup \
  alpine tar xzf /backup/snapshot_20241201_020000.tar.gz -C /target

# Start PostgreSQL
podman start todo-postgres
```

## Backup Testing

### 1. Automated Backup Testing

```bash
# Create test backup
./postgres-backup.sh full

# Test restore in isolated environment
podman run --rm \
  --name test-postgres \
  -e POSTGRES_DB=test_db \
  -e POSTGRES_USER=test_user \
  -e POSTGRES_PASSWORD=test_password \
  -d postgres:15-alpine

# Wait for PostgreSQL to start
sleep 10

# Restore backup to test database
gunzip -c /backups/postgres/full/latest_backup.sql.gz | \
podman exec -i test-postgres pg_restore -U test_user -d test_db

# Verify data integrity
podman exec test-postgres psql -U test_user -d test_db -c "SELECT COUNT(*) FROM todos;"

# Cleanup
podman stop test-postgres
```

### 2. Backup Validation Script

```bash
#!/bin/bash
# backup-validation.sh

BACKUP_FILE="$1"
TEST_CONTAINER="test-postgres-$(date +%s)"

echo "Testing backup: $BACKUP_FILE"

# Start test PostgreSQL
podman run --rm \
  --name "$TEST_CONTAINER" \
  -e POSTGRES_DB=test_db \
  -e POSTGRES_USER=test_user \
  -e POSTGRES_PASSWORD=test_password \
  -d postgres:15-alpine

# Wait for startup
sleep 15

# Restore backup
gunzip -c "$BACKUP_FILE" | \
podman exec -i "$TEST_CONTAINER" pg_restore -U test_user -d test_db

# Run validation queries
podman exec "$TEST_CONTAINER" psql -U test_user -d test_db -c "
SELECT 
  'todos' as table_name,
  COUNT(*) as row_count,
  MAX(created_at) as latest_record
FROM todos
UNION ALL
SELECT 
  'schema_check' as table_name,
  COUNT(*) as row_count,
  NULL as latest_record
FROM information_schema.tables 
WHERE table_schema = 'public';
"

# Cleanup
podman stop "$TEST_CONTAINER"

echo "Backup validation completed"
```

## Best Practices

### 1. Backup Strategy

- **3-2-1 Rule**: 3 copies, 2 different media, 1 off-site
- **Retention Policy**: 30 days daily, 4 weeks weekly, 12 months monthly
- **Compression**: Use gzip for storage efficiency
- **Encryption**: Encrypt sensitive backups

### 2. Monitoring

- **Automated Alerts**: Monitor backup success/failure
- **Size Monitoring**: Track backup growth
- **Performance Impact**: Schedule during low-traffic periods
- **Verification**: Regularly test backup restoration

### 3. Security

```bash
# Secure backup storage
chmod 600 /backups/postgres/full/*
chmod 700 /backups/postgres/

# Encrypt backups
gpg --encrypt --recipient backup-key /backups/postgres/full/backup.sql.gz

# Secure backup transfer
scp -i ~/.ssh/backup-key /backups/postgres/full/backup.sql.gz user@backup-server:/backups/
```

### 4. Performance Optimization

```bash
# Parallel backup
podman exec todo-postgres pg_dump \
  -U todo_user \
  -d todo_db \
  --jobs=4 \
  --format=directory \
  --file=/tmp/parallel_backup

# Incremental backup with rsync
rsync -av --delete /backups/postgres/ user@backup-server:/backups/
```

## Troubleshooting

### Common Issues

#### 1. Backup Fails
```bash
# Check PostgreSQL status
podman exec todo-postgres pg_isready -U todo_user -d todo_db

# Check disk space
df -h /backups/

# Check backup logs
tail -f /backups/postgres/logs/cron.log
```

#### 2. Restore Fails
```bash
# Check backup integrity
podman exec todo-postgres pg_restore --list backup_file.sql.gz

# Check PostgreSQL version compatibility
podman exec todo-postgres psql --version
```

#### 3. Performance Issues
```bash
# Monitor backup impact
podman stats todo-postgres

# Check PostgreSQL logs
podman logs todo-postgres | grep -i backup
```

### Recovery Commands

```bash
# Emergency backup
podman exec todo-postgres pg_dump \
  -U todo_user \
  -d todo_db \
  --format=plain \
  --file=/tmp/emergency_backup.sql

# Quick restore
podman exec -i todo-postgres psql -U todo_user -d todo_db < /tmp/emergency_backup.sql

# Verify data
podman exec todo-postgres psql -U todo_user -d todo_db -c "SELECT COUNT(*) FROM todos;"
```

## Backup Automation Scripts

### 1. Daily Backup Script
```bash
#!/bin/bash
# daily-backup.sh

DATE=$(date +%Y%m%d)
BACKUP_DIR="/backups/postgres"

# Create daily backup
./postgres-backup.sh full

# Sync to remote storage
rsync -av --delete "$BACKUP_DIR/" user@backup-server:/backups/

# Send notification
echo "Daily backup completed: $DATE" | mail -s "Backup Status" admin@example.com
```

### 2. Weekly Backup Script
```bash
#!/bin/bash
# weekly-backup.sh

DATE=$(date +%Y%m%d)
BACKUP_DIR="/backups/postgres"

# Create weekly snapshot
./postgres-backup.sh snapshot

# Archive old backups
find "$BACKUP_DIR/full" -name "*.sql.gz" -mtime +30 -exec mv {} "$BACKUP_DIR/archive/" \;

# Generate weekly report
./postgres-backup.sh report > "$BACKUP_DIR/logs/weekly_report_$DATE.log"
```

### 3. Monthly Backup Script
```bash
#!/bin/bash
# monthly-backup.sh

DATE=$(date +%Y%m%d)
BACKUP_DIR="/backups/postgres"

# Create monthly backup
./postgres-backup.sh all

# Test backup restoration
./backup-validation.sh "$BACKUP_DIR/full/latest_backup.sql.gz"

# Archive to long-term storage
tar czf "/backups/archive/monthly_backup_$DATE.tar.gz" -C "$BACKUP_DIR" .

# Send monthly report
./postgres-backup.sh report | mail -s "Monthly Backup Report" admin@example.com
```

## Conclusion

This comprehensive backup guide provides everything needed to implement production-ready PostgreSQL backup strategies. Key takeaways:

1. **Multiple Backup Types**: Full dumps, incremental WAL, and volume snapshots
2. **Automated Scheduling**: Cron jobs and Kubernetes CronJobs
3. **Monitoring**: Web interface and command-line tools
4. **Recovery Procedures**: Step-by-step recovery instructions
5. **Testing**: Automated backup validation
6. **Best Practices**: Security, performance, and retention policies

By following this guide, you can ensure your PostgreSQL data is protected against corruption, hardware failure, and human error, with reliable recovery procedures for any scenario. 