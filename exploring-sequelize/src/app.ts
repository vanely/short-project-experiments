import express from 'express';
import cors from 'cors';
import dotenvx from '@dotenvx/dotenvx';
import sequelize, { connectToDB } from './config/db';
import { setupAssociations } from './models/associations';
import models from './models/index';
import userRoutes from './routes/user';
import friendRequestRoutes from './routes/friendRequest';

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
app.use('/user', userRoutes);
app.use('/friendRequest', friendRequestRoutes);

export default app;
