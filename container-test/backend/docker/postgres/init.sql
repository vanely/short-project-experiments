-- Initialize the todo_db database
-- This script runs when the PostgreSQL container starts for the first time

-- Connect to the todo_db database
\c todo_db;

-- Create the todos table
CREATE TABLE IF NOT EXISTS todos (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_todos_created_at ON todos("createdAt");
CREATE INDEX IF NOT EXISTS idx_todos_completed ON todos(completed);

-- Grant permissions to todo_user
GRANT ALL PRIVILEGES ON TABLE todos TO todo_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO todo_user;

-- Insert some sample data (optional)
INSERT INTO todos (id, title, description, completed, "createdAt", "updatedAt") 
VALUES 
    ('clx1a2b3c4d5e6f7g8h9i0j1', 'Learn Docker', 'Set up PostgreSQL with Docker', false, NOW(), NOW()),
    ('clx1a2b3c4d5e6f7g8h9i0j2', 'Build Todo App', 'Create a full-stack todo application', false, NOW(), NOW()),
    ('clx1a2b3c4d5e6f7g8h9i0j3', 'Deploy to Production', 'Deploy the application to production', false, NOW(), NOW())
ON CONFLICT (id) DO NOTHING; 