import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(process.env.DATABASE_URL as string, {
  dialect: 'postgres',
  logging: false // toggle based on env (...msg) => console.log(msg),
});

export const connectToDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to PostgreSQL database');
  } catch (error) {
    console.error(`Unable to connect to PostgreSQL database:\n${error}`);
  }
}

export default sequelize;
