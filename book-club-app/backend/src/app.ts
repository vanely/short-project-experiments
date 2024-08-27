import express from 'express';
import passport from 'passport';
import session from 'express-session';
import { createNamespace } from 'cls-hooked';
import sequelize, { connectToDB } from './config/db';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import bookClubRoutes from './routes/bookClub';
import { sessionMiddleware } from './middleware/session';

const app = express();

// connect to DB
connectToDB();

// sync db models
sequelize.sync({ alter: true }).then(() => {
  console.log('Database Synced');
}).catch((error: Error) => console.error(`Sequelize Sync Error:\n${error}`));

// session context namespace
export const sessionNamespace = createNamespace('currentSession');

// middleware
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'session-secret',
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(sessionMiddleware);

// routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/bookclub', bookClubRoutes);

export default app;
