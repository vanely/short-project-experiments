import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(process.env.DATABASE_URL || 'postgres://user:password@localhost:5432/bookclub', {
  dialect: 'postgres',
  logging: (...msg) => console.log(msg),
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
