import express, { application } from 'express';
import passport from 'passport';
import session from 'express-session';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize, { connectToDB } from './config/db';
import { authenticationMiddleware } from './middleware/auth';
import { sessionMiddleware } from './middleware/session';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import bookClubRoutes from './routes/bookClub';
import soloReadingListRoutes from './routes/soloReadingList';

dotenv.config()
const app = express();

// connect to database
connectToDB();

// sync db models
// NOTE: 'alter', and 'force' options are both destructive, 
// 'force' drops tables and recreates, 'alter' updates tables with new changes, 
// both operations should be performed via migrations scripts.
sequelize.sync({ alter: true }).then(() => {
  console.log('Database Synced');
}).catch((error: Error) => console.error(`Sequelize Sync Error:\n${error}`));

// middleware
app.use(express.json());
app.use(cors());
app.use(session({
  secret: process.env.SESSION_SECRET || 'session-secret',
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());
// REVIEW: if I include the auth middleware here, do I still need to add it to routes? And, do I need the below, and the above session refs
app.use(authenticationMiddleware);
app.use(sessionMiddleware);

// routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/bookclub', bookClubRoutes);
app.use('/solo-reading-list', soloReadingListRoutes);

export default app;
