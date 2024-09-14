import express from 'express';
import cors from 'cors';
import dotenvx from '@dotenvx/dotenvx';
import sequelize, { connectToDB } from './config/db';
import userRoutes from './routes/user';

dotenvx.config();
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
// app.use('', )

export default app;
