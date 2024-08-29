import express from 'express';
import { connect } from './config/db';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import bookClubRoutes from './routes/bookClub';
import { authMiddleware } from './middleware/auth';

const app = express();

// Connect to database
connect();

// Middleware
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/user', authMiddleware, userRoutes);
app.use('/bookclub', authMiddleware, bookClubRoutes);

export default app;
