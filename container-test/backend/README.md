# Todo Backend

A simple Express TypeScript server for a todo application with Prisma and PostgreSQL.

## Features

- ✅ CRUD operations for todos
- 🔒 Input validation and error handling
- 🗄️ PostgreSQL database with Prisma ORM
- 🚀 TypeScript for type safety
- 🛡️ Security middleware (Helmet, CORS)
- 📝 Environment variable configuration

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Configuration:**
   Copy `env.example` to `.env` and configure your database:
   ```bash
   cp env.example .env
   ```
   
   Update the `.env` file with your PostgreSQL credentials:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/todo_db?schema=public"
   PORT=3001
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:3000
   ```

3. **Database Setup:**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push schema to database (creates tables)
   npm run db:push
   
   # Or run migrations (recommended for production)
   npm run db:migrate
   ```

4. **Start the server:**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm run build
   npm start
   ```

## API Endpoints

### Todos

- `GET /api/todos` - Get all todos
- `GET /api/todos/:id` - Get todo by ID
- `POST /api/todos` - Create new todo
- `PUT /api/todos/:id` - Update todo
- `DELETE /api/todos/:id` - Delete todo

### Health Check

- `GET /health` - Server health status

## Request/Response Examples

### Create Todo
```bash
POST /api/todos
Content-Type: application/json

{
  "title": "Buy groceries",
  "description": "Milk, bread, eggs"
}
```

### Update Todo
```bash
PUT /api/todos/:id
Content-Type: application/json

{
  "completed": true,
  "title": "Buy groceries (updated)"
}
```

## Database Schema

The `Todo` model includes:
- `id` - Unique identifier (CUID)
- `title` - Todo title (required)
- `description` - Optional description
- `completed` - Completion status (default: false)
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

## Development

- **TypeScript compilation:** `npm run build`
- **Database studio:** `npm run db:studio`
- **Database migrations:** `npm run db:migrate`

## Project Structure

```
src/
├── controllers/     # Business logic
├── routes/         # API route definitions
├── types/          # TypeScript type definitions
├── lib/            # Shared utilities (Prisma client)
└── index.ts        # Main server file

prisma/
└── schema.prisma   # Database schema

dist/               # Compiled JavaScript (generated)
```

## Error Handling

The API returns consistent error responses:
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (development only)"
}
```

## Security Features

- **Helmet:** Security headers
- **CORS:** Cross-origin resource sharing
- **Input validation:** Request body validation
- **SQL injection protection:** Prisma ORM 