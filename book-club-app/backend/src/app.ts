import express from 'express';
import passport from 'passport';
import session from 'express-session';
import cors from 'cors';
import dotenvx from '@dotenvx/dotenvx';
import sequelize, { connectToDB } from './config/db';
import { authenticationMiddleware } from './middleware/auth';
import { sessionMiddleware } from './middleware/session';
// import authRoutes from './routes/auth';
// import userRoutes from './routes/user';
// import bookClubRoutes from './routes/bookClub';
// import soloReadingListRoutes from './routes/soloReadingList';
import { setupAssociations } from './models/associations';
import models from './models/index';
import bookClubRoutes from './routes/bookClub';
import friendRequestRoutes from './routes/friendRequest';
import soloReadingListRoutes from './routes/soloReadingList';
import userRoutes from './routes/user';


dotenvx.config()
const app = express();

// connect to database
connectToDB();

// sync db models
// NOTE: 'alter', and 'force' options are both destructive, 
// 'force' drops tables and recreates, 'alter' updates tables with new changes, 
// both operations should be performed via migrations scripts.
// sequelize.sync({ alter: true }).then(() => {
//   console.log('Database Synced');
// }).catch((error: Error) => console.error(`Sequelize Sync Error:\n${error}`));

// initialize models
function createAndAssociateModels(models: any, associationsConnection: any) {
  Object.values(models).forEach((model: any) => {
    model.init({ ...model.getAttributes() }, {
      ...sequelize,
      ...model.options
    });
  });

  associationsConnection(models);
}

// sync models
async function syncModels(dbConnection: any) {
  await dbConnection.sync().then(() => {
    console.log('Database Synced');
  }).catch((error: Error) => console.error(`Sequelize Sync Error:\n${error}`));
}

createAndAssociateModels(models, setupAssociations);
syncModels(sequelize)
  .then(() => console.log('Finished attempting to sync models'))
  .catch((error) => console.error(error));


// middleware
app.use(express.json());
app.use(cors());
app.use(session({
  secret: process.env.SESSION_SECRET || 'session-secret', // NOTE: create an env var for this
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
// authenticated passport user session object is passed to the passport session middleware
app.use(passport.session());
// REVIEW: if I include the auth middleware here, do I still need to add it to routes? And, do I need the below, and the above session refs
app.use(authenticationMiddleware);
app.use(sessionMiddleware);

// routes
app.use('/auth', authRoutes);
app.use('/bookclub', bookClubRoutes);
app.use('/friend-request', friendRequestRoutes);
app.use('/solo-reading-list', soloReadingListRoutes);
app.use('/user', userRoutes);

export default app;
