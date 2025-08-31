# 🎯 Todo Frontend

A modern React frontend for the todo application built with TypeScript, TanStack Query v5, Chakra UI, and React Router.

## ✨ Features

- 🚀 **Modern React 18** with TypeScript
- 🔄 **TanStack Query v5** for server state management and caching
- 🎨 **Chakra UI** for beautiful, accessible components
- 🛣️ **React Router v6** for client-side routing
- 📱 **Responsive design** that works on all devices
- 🔒 **Type-safe API calls** with proper error handling
- ⚡ **Optimistic updates** for better UX
- 🎯 **Real-time data synchronization** across components

## 🛠️ Tech Stack

- **Frontend Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **State Management:** TanStack Query v5
- **UI Library:** Chakra UI
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **Styling:** Emotion (CSS-in-JS)

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend server running (see backend README)

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Copy the example environment file and configure it:
```bash
cp env.example .env
```

Update `.env` with your backend API URL:
```env
VITE_API_BASE_URL=http://localhost:3001
VITE_API_TIMEOUT=10000
VITE_APP_TITLE=Todo App
VITE_APP_VERSION=1.0.0
```

### 3. Start Development Server
```bash
npm run dev
```

The app will open at `http://localhost:3000`

## 📁 Project Structure

```
src/
├── api/              # API functions and types
│   └── todos.ts      # Todo API endpoints
├── components/       # Reusable UI components
│   └── Layout.tsx    # Main layout wrapper
├── hooks/            # Custom React hooks
│   └── useTodos.ts   # TanStack Query hooks
├── pages/            # Page components
│   ├── TodoList.tsx  # Main todos page
│   ├── TodoDetail.tsx # Individual todo view
│   └── NotFound.tsx  # 404 page
├── theme/            # Chakra UI theme
│   └── index.ts      # Custom theme configuration
├── lib/              # Utility libraries
│   └── api.ts        # Axios client configuration
├── App.tsx           # Main app component
├── main.tsx          # App entry point
└── vite-env.d.ts     # Vite type definitions
```

## 🎮 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔌 API Integration

The frontend integrates with the backend through:

- **RESTful API calls** using Axios
- **Automatic caching** with TanStack Query
- **Real-time updates** across all components
- **Error handling** with user-friendly messages
- **Loading states** for better UX

### API Endpoints Used

- `GET /api/todos` - Fetch all todos
- `GET /api/todos/:id` - Fetch specific todo
- `POST /api/todos` - Create new todo
- `PUT /api/todos/:id` - Update todo
- `DELETE /api/todos/:id` - Delete todo

## 🎨 UI Components

### Chakra UI Theme
- **Custom color palette** with brand colors
- **Typography system** using Inter font
- **Component variants** for consistent styling
- **Responsive design** utilities

### Key Components
- **Layout** - Consistent page structure
- **TodoList** - Main todos management
- **TodoDetail** - Individual todo view
- **Modals** - Create/edit forms
- **Cards** - Todo display
- **Forms** - Input validation

## 🔄 State Management

### TanStack Query Features
- **Automatic caching** with configurable stale times
- **Background refetching** for fresh data
- **Optimistic updates** for immediate feedback
- **Error handling** with retry logic
- **Loading states** for better UX

### Query Keys
- `['todos', 'list']` - All todos list
- `['todos', 'detail', id]` - Individual todo
- **Automatic invalidation** on mutations

## 🛣️ Routing

### Routes
- `/` - Todo list (main page)
- `/todo/:id` - Individual todo detail
- `*` - 404 Not Found page

### Navigation
- **Programmatic navigation** with `useNavigate`
- **Route parameters** with `useParams`
- **Breadcrumb navigation** between pages

## 📱 Responsive Design

- **Mobile-first approach** with Chakra UI breakpoints
- **Flexible layouts** that adapt to screen sizes
- **Touch-friendly interactions** for mobile devices
- **Optimized spacing** for different screen sizes

## 🔧 Development

### TypeScript
- **Strict mode** enabled
- **Type-safe API calls** with interfaces
- **Component prop types** for better DX
- **Generic types** for reusable components

### Code Quality
- **ESLint** configuration for code standards
- **Prettier** formatting (recommended)
- **Component composition** for reusability
- **Custom hooks** for logic separation

## 🚀 Production Build

### Build Process
```bash
npm run build
```

### Build Output
- **Optimized bundles** with code splitting
- **Minified code** for smaller file sizes
- **Source maps** for debugging
- **Static assets** optimization

### Deployment
- **Static hosting** ready (Netlify, Vercel, etc.)
- **Environment variables** configuration
- **API URL** configuration for production

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Failed**
   - Verify backend is running
   - Check `.env` configuration
   - Ensure CORS is configured on backend

2. **Build Errors**
   - Clear `node_modules` and reinstall
   - Check TypeScript configuration
   - Verify all dependencies are installed

3. **Runtime Errors**
   - Check browser console for details
   - Verify API responses
   - Check network tab for failed requests

### Debug Tools
- **React Query DevTools** - Query state inspection
- **React DevTools** - Component debugging
- **Browser DevTools** - Network and console

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
3. **Make your changes**
4. **Add tests if applicable**
5. **Submit a pull request**

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
- Check the troubleshooting section
- Review the backend documentation
- Open an issue in the repository

---

**Happy coding! 🚀** 