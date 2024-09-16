import express from 'express';
import cors from 'cors';
import dotenvx from '@dotenvx/dotenvx';
import sequelize, { connectToDB } from './config/db';
import { setupAssociations } from './models/associations';
import models from './models/index';
import bookClubRoutes from './routes/bookClub';
import friendRequestRoutes from './routes/friendRequest';
import soloReadingListRoutes from './routes/soloReadingList';
import userRoutes from './routes/user';

dotenvx.config();
const app = express();

// connect to database
connectToDB();

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

// routes
app.use('/book-club', bookClubRoutes);
app.use('/friend-request', friendRequestRoutes);
app.use('/solo-reading-list', soloReadingListRoutes);
app.use('/user', userRoutes);

export default app;
