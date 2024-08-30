import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(process.env.DATABASE_URL || 'postgres://user:password@localhost:5432/bookclub', {
  host: 'localhost',
  dialect: 'postgres',
  logging: true,
  pool: {
    max: 5,
    min: 0,
    acquire: 30_000,
    idle: 5_000,
  }
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
