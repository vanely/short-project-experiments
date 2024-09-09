import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize, { connectToDB } from './config/db';
import userRoutes from './routes/user';

dotenv.config()
const app = express();

// connect to database
connectToDB();

// sync db models
sequelize.sync({ alter: true }).then(() => {
  console.log('Database Synced');
}).catch((error: Error) => console.error(`Sequelize Sync Error:\n${error}`));

// middleware
app.use(express.json());
app.use(cors());

// routes
app.use('/user', userRoutes);

export default app;
