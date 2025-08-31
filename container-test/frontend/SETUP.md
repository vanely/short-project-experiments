# 🚀 Frontend Setup Guide

## Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager
- Backend server running (see backend README)

## 🎯 One-Command Setup

Run the quick start script:
```bash
./quick-start.sh
```

This script will:
1. ✅ Check for environment configuration
2. 📦 Install all dependencies
3. 🚀 Start the development server

## 📝 Manual Setup

### 1. Environment Configuration
```bash
# Copy the example environment file
cp env.example .env

# Edit .env with your backend API URL
nano .env
```

Update these values in `.env`:
```env
VITE_API_BASE_URL=http://localhost:3001
VITE_API_TIMEOUT=10000
VITE_APP_TITLE=Todo App
VITE_APP_VERSION=1.0.0
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

The app will open at `http://localhost:3000`

## 🧪 Test the Frontend

Once running, you can:

- **View the main page** at `http://localhost:3000`
- **Create new todos** using the "Add Todo" button
- **Edit existing todos** by clicking the edit icon
- **Toggle completion** by clicking the checkbox
- **Delete todos** using the delete icon
- **View todo details** by clicking the view icon

## 🔌 Backend Integration

Make sure your backend is running:
```bash
# In the backend directory
cd ../backend
npm run dev
```

The frontend will automatically connect to:
- **API Base URL:** `http://localhost:3001`
- **Health Check:** `http://localhost:3001/health`
- **Todo API:** `http://localhost:3001/api/todos`

## 📊 Available Scripts

- **`npm run dev`** - Start development server with hot reload
- **`npm run build`** - Build for production
- **`npm run preview`** - Preview production build locally
- **`npm run lint`** - Run ESLint for code quality

## 🎨 UI Features

### Chakra UI Components
- **Responsive design** that works on all devices
- **Custom theme** with brand colors and typography
- **Form components** with validation
- **Modal dialogs** for create/edit operations
- **Toast notifications** for user feedback

### TanStack Query Features
- **Automatic caching** of API responses
- **Real-time updates** across all components
- **Optimistic updates** for better UX
- **Error handling** with retry logic
- **Loading states** for better UX

## 🔧 Development

### TypeScript
- **Strict mode** enabled for type safety
- **Type-safe API calls** with interfaces
- **Component prop types** for better DX

### Code Structure
- **API layer** - Centralized API functions
- **Custom hooks** - TanStack Query integration
- **Page components** - Route-based components
- **Reusable components** - Layout and UI components

## 🚀 Production Build

### Build Process
```bash
npm run build
```

### Build Output
- **Optimized bundles** in `dist/` directory
- **Minified code** for smaller file sizes
- **Source maps** for debugging
- **Static assets** ready for deployment

### Deployment
- **Static hosting** ready (Netlify, Vercel, etc.)
- **Environment variables** configuration
- **API URL** configuration for production

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Failed**
   - Verify backend is running on port 3001
   - Check `.env` configuration
   - Ensure CORS is configured on backend

2. **Build Errors**
   - Clear `node_modules` and reinstall
   - Check TypeScript configuration
   - Verify all dependencies are installed

3. **Runtime Errors**
   - Check browser console for details
   - Verify API responses in Network tab
   - Check React Query DevTools

### Debug Tools
- **React Query DevTools** - Query state inspection
- **React DevTools** - Component debugging
- **Browser DevTools** - Network and console

## 📁 Project Structure

```
frontend/
├── src/
│   ├── api/              # API functions and types
│   ├── components/       # Reusable UI components
│   ├── hooks/            # Custom React hooks
│   ├── pages/            # Page components
│   ├── theme/            # Chakra UI theme
│   ├── lib/              # Utility libraries
│   ├── App.tsx           # Main app component
│   └── main.tsx          # App entry point
├── dist/                 # Build output
├── .env                  # Environment variables
├── package.json          # Dependencies
└── README.md             # Full documentation
```

## 🎉 You're Ready!

Your React frontend is now running with:
- ✅ Modern React 18 + TypeScript
- ✅ TanStack Query v5 for state management
- ✅ Chakra UI for beautiful components
- ✅ React Router for navigation
- ✅ Full CRUD functionality for todos
- ✅ Real-time data synchronization
- ✅ Responsive design

Happy coding! 🚀 