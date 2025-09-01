#!/bin/bash

# PostgreSQL Backup Script for Production
# Supports full dumps, incremental backups, and volume snapshots

set -e

# Configuration
BACKUP_DIR="/backups/postgres"
RETENTION_DAYS=30
RETENTION_WEEKS=4
RETENTION_MONTHS=12
POSTGRES_CONTAINER="todo-postgres"
POSTGRES_DB="todo_db"
POSTGRES_USER="todo_user"
POSTGRES_PASSWORD="todo_password"
BACKUP_TYPE="${1:-full}"  # full, incremental, snapshot
COMPRESSION="gzip"
DATE_FORMAT=$(date +"%Y%m%d_%H%M%S")
BACKUP_NAME="postgres_backup_${BACKUP_TYPE}_${DATE_FORMAT}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}" >&2
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

info() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] INFO: $1${NC}"
}

# Create backup directory
create_backup_dir() {
    log "Creating backup directory: $BACKUP_DIR"
    mkdir -p "$BACKUP_DIR"
    mkdir -p "$BACKUP_DIR/full"
    mkdir -p "$BACKUP_DIR/incremental"
    mkdir -p "$BACKUP_DIR/snapshots"
    mkdir -p "$BACKUP_DIR/logs"
}

# Check if PostgreSQL container is running
check_postgres_container() {
    log "Checking PostgreSQL container status..."
    if ! podman ps --format "table {{.Names}}" | grep -q "$POSTGRES_CONTAINER"; then
        error "PostgreSQL container '$POSTGRES_CONTAINER' is not running"
        exit 1
    fi
    
    if ! podman exec "$POSTGRES_CONTAINER" pg_isready -U "$POSTGRES_USER" -d "$POSTGRES_DB"; then
        error "PostgreSQL is not ready"
        exit 1
    fi
    
    log "PostgreSQL container is running and ready"
}

# Full database dump
full_backup() {
    log "Starting full database backup..."
    
    local backup_file="$BACKUP_DIR/full/${BACKUP_NAME}.sql"
    local compressed_file="${backup_file}.${COMPRESSION}"
    
    # Create full dump
    log "Creating full database dump..."
    podman exec "$POSTGRES_CONTAINER" pg_dump \
        -U "$POSTGRES_USER" \
        -d "$POSTGRES_DB" \
        --verbose \
        --clean \
        --if-exists \
        --create \
        --no-owner \
        --no-privileges \
        --format=custom \
        --file="/tmp/${BACKUP_NAME}.dump"
    
    # Copy dump from container
    podman cp "$POSTGRES_CONTAINER:/tmp/${BACKUP_NAME}.dump" "$backup_file"
    
    # Compress if needed
    if [ "$COMPRESSION" = "gzip" ]; then
        log "Compressing backup..."
        gzip "$backup_file"
        backup_file="$compressed_file"
    fi
    
    # Verify backup
    verify_backup "$backup_file"
    
    log "Full backup completed: $backup_file"
    echo "$backup_file" > "$BACKUP_DIR/latest_full_backup.txt"
}

# Incremental backup (WAL files)
incremental_backup() {
    log "Starting incremental backup..."
    
    # Check if WAL archiving is enabled
    local wal_archive_dir="$BACKUP_DIR/incremental/wal"
    mkdir -p "$wal_archive_dir"
    
    # Trigger WAL switch
    log "Triggering WAL switch..."
    podman exec "$POSTGRES_CONTAINER" psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "SELECT pg_switch_wal();"
    
    # Copy WAL files
    log "Copying WAL files..."
    podman exec "$POSTGRES_CONTAINER" find /var/lib/postgresql/data/pg_wal -name "*.wal" -mtime -1 -exec cp {} /tmp/ \;
    podman cp "$POSTGRES_CONTAINER:/tmp/"*.wal "$wal_archive_dir/" 2>/dev/null || true
    
    log "Incremental backup completed"
}

# Volume snapshot backup
snapshot_backup() {
    log "Starting volume snapshot backup..."
    
    local volume_name="backend_postgres_data"
    local snapshot_name="${BACKUP_NAME}_snapshot"
    
    # Check if volume exists
    if ! podman volume exists "$volume_name"; then
        error "Volume '$volume_name' does not exist"
        exit 1
    fi
    
    # Create snapshot
    log "Creating volume snapshot..."
    podman run --rm \
        -v "$volume_name":/source:ro \
        -v "$BACKUP_DIR/snapshots":/backup \
        alpine tar czf "/backup/${snapshot_name}.tar.gz" -C /source .
    
    log "Volume snapshot completed: $BACKUP_DIR/snapshots/${snapshot_name}.tar.gz"
}

# Verify backup integrity
verify_backup() {
    local backup_file="$1"
    
    log "Verifying backup integrity..."
    
    if [[ "$backup_file" == *.gz ]]; then
        # Test gzip integrity
        if ! gzip -t "$backup_file"; then
            error "Backup file is corrupted: $backup_file"
            return 1
        fi
        
        # Test PostgreSQL dump integrity
        local temp_file="/tmp/verify_$(basename "$backup_file")"
        gunzip -c "$backup_file" > "$temp_file"
        if ! podman exec "$POSTGRES_CONTAINER" pg_restore --list "$temp_file" > /dev/null; then
            error "PostgreSQL dump is corrupted: $backup_file"
            rm -f "$temp_file"
            return 1
        fi
        rm -f "$temp_file"
    else
        # Test PostgreSQL dump integrity
        if ! podman exec "$POSTGRES_CONTAINER" pg_restore --list "$backup_file" > /dev/null; then
            error "PostgreSQL dump is corrupted: $backup_file"
            return 1
        fi
    fi
    
    log "Backup verification passed: $backup_file"
}

# Cleanup old backups
cleanup_old_backups() {
    log "Cleaning up old backups..."
    
    # Cleanup old full backups (keep last 30 days)
    find "$BACKUP_DIR/full" -name "*.sql*" -mtime +$RETENTION_DAYS -delete 2>/dev/null || true
    
    # Cleanup old incremental backups (keep last 4 weeks)
    find "$BACKUP_DIR/incremental" -name "*.wal" -mtime +$((RETENTION_WEEKS * 7)) -delete 2>/dev/null || true
    
    # Cleanup old snapshots (keep last 12 months)
    find "$BACKUP_DIR/snapshots" -name "*.tar.gz" -mtime +$((RETENTION_MONTHS * 30)) -delete 2>/dev/null || true
    
    # Cleanup old logs (keep last 7 days)
    find "$BACKUP_DIR/logs" -name "*.log" -mtime +7 -delete 2>/dev/null || true
    
    log "Cleanup completed"
}

# Generate backup report
generate_report() {
    local report_file="$BACKUP_DIR/logs/backup_report_${DATE_FORMAT}.log"
    
    log "Generating backup report..."
    
    {
        echo "=== PostgreSQL Backup Report ==="
        echo "Date: $(date)"
        echo "Backup Type: $BACKUP_TYPE"
        echo "Database: $POSTGRES_DB"
        echo "Container: $POSTGRES_CONTAINER"
        echo ""
        echo "=== Backup Statistics ==="
        echo "Full backups: $(find "$BACKUP_DIR/full" -name "*.sql*" | wc -l)"
        echo "Incremental backups: $(find "$BACKUP_DIR/incremental" -name "*.wal" | wc -l)"
        echo "Volume snapshots: $(find "$BACKUP_DIR/snapshots" -name "*.tar.gz" | wc -l)"
        echo ""
        echo "=== Disk Usage ==="
        du -sh "$BACKUP_DIR"/*
        echo ""
        echo "=== Latest Backups ==="
        ls -la "$BACKUP_DIR/full" | tail -5
        echo ""
        echo "=== Backup Verification ==="
        if [ -f "$BACKUP_DIR/latest_full_backup.txt" ]; then
            local latest_backup=$(cat "$BACKUP_DIR/latest_full_backup.txt")
            if [ -f "$latest_backup" ]; then
                echo "Latest backup: $latest_backup"
                echo "Backup size: $(du -h "$latest_backup" | cut -f1)"
            fi
        fi
    } > "$report_file"
    
    log "Backup report generated: $report_file"
}

# Restore function
restore_backup() {
    local backup_file="$1"
    local target_db="${2:-$POSTGRES_DB}"
    
    if [ ! -f "$backup_file" ]; then
        error "Backup file not found: $backup_file"
        exit 1
    fi
    
    log "Starting restore from: $backup_file"
    
    # Stop applications that might be using the database
    warn "Stopping applications..."
    podman stop todo-backend 2>/dev/null || true
    
    # Drop and recreate database
    log "Dropping and recreating database..."
    podman exec "$POSTGRES_CONTAINER" psql -U "$POSTGRES_USER" -c "DROP DATABASE IF EXISTS $target_db;"
    podman exec "$POSTGRES_CONTAINER" psql -U "$POSTGRES_USER" -c "CREATE DATABASE $target_db;"
    
    # Restore backup
    log "Restoring backup..."
    if [[ "$backup_file" == *.gz ]]; then
        gunzip -c "$backup_file" | podman exec -i "$POSTGRES_CONTAINER" pg_restore -U "$POSTGRES_USER" -d "$target_db"
    else
        podman exec -i "$POSTGRES_CONTAINER" pg_restore -U "$POSTGRES_USER" -d "$target_db" < "$backup_file"
    fi
    
    # Start applications
    log "Starting applications..."
    podman start todo-backend 2>/dev/null || true
    
    log "Restore completed successfully"
}

# Main execution
main() {
    log "Starting PostgreSQL backup process..."
    
    # Create backup directory
    create_backup_dir
    
    # Check PostgreSQL container
    check_postgres_container
    
    # Perform backup based on type
    case "$BACKUP_TYPE" in
        "full")
            full_backup
            ;;
        "incremental")
            incremental_backup
            ;;
        "snapshot")
            snapshot_backup
            ;;
        "all")
            full_backup
            incremental_backup
            snapshot_backup
            ;;
        "restore")
            if [ -z "$2" ]; then
                error "Please specify backup file for restore"
                exit 1
            fi
            restore_backup "$2" "$3"
            exit 0
            ;;
        *)
            error "Invalid backup type: $BACKUP_TYPE"
            echo "Usage: $0 {full|incremental|snapshot|all|restore <backup_file> [target_db]}"
            exit 1
            ;;
    esac
    
    # Cleanup old backups
    cleanup_old_backups
    
    # Generate report
    generate_report
    
    log "Backup process completed successfully"
}

# Run main function
main "$@" 