# 🚀 Quick Setup Guide

## Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database running locally or remotely
- npm or yarn package manager

## 🎯 One-Command Setup

Run the quick start script:
```bash
./quick-start.sh
```

This script will:
1. ✅ Check for environment configuration
2. 📦 Install all dependencies
3. 🔧 Generate Prisma client
4. 🏗️ Build TypeScript code
5. 🚀 Start the development server

## 📝 Manual Setup

### 1. Environment Configuration
```bash
# Copy the example environment file
cp env.example .env

# Edit .env with your database credentials
nano .env
```

Update these values in `.env`:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/todo_db?schema=public"
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Database Setup
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database (creates tables)
npm run db:push
```

### 4. Start Server
```bash
# Development mode (auto-reload)
npm run dev

# Production mode
npm run build
npm start
```

## 🧪 Test the API

Once running, test these endpoints:

- **Health Check:** `GET http://localhost:3001/health`
- **Get Todos:** `GET http://localhost:3001/api/todos`
- **Create Todo:** `POST http://localhost:3001/api/todos`
- **Update Todo:** `PUT http://localhost:3001/api/todos/:id`
- **Delete Todo:** `DELETE http://localhost:3001/api/todos/:id`

## 📊 Database Management

- **View Database:** `npm run db:studio`
- **Run Migrations:** `npm run db:migrate`
- **Reset Database:** `npm run db:push --force-reset`

## 🔧 Troubleshooting

### Common Issues:

1. **Port already in use:**
   - Change `PORT` in `.env` file
   - Kill process using the port: `lsof -ti:3001 | xargs kill -9`

2. **Database connection failed:**
   - Verify PostgreSQL is running
   - Check credentials in `.env`
   - Ensure database exists: `createdb todo_db`

3. **Prisma errors:**
   - Regenerate client: `npm run db:generate`
   - Reset database: `npm run db:push --force-reset`

4. **TypeScript errors:**
   - Clean and rebuild: `rm -rf dist && npm run build`

## 📁 Project Structure

```
backend/
├── src/
│   ├── controllers/     # Business logic
│   ├── routes/         # API endpoints
│   ├── types/          # TypeScript types
│   ├── lib/            # Prisma client
│   └── index.ts        # Main server
├── prisma/
│   └── schema.prisma   # Database schema
├── dist/               # Compiled code
├── .env                # Environment variables
├── package.json        # Dependencies
└── README.md           # Full documentation
```

## 🎉 You're Ready!

Your todo backend is now running with:
- ✅ Express TypeScript server
- ✅ Prisma PostgreSQL integration
- ✅ Full CRUD API for todos
- ✅ Input validation & error handling
- ✅ Security middleware
- ✅ Environment configuration

Happy coding! 🚀 