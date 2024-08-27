import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db';
import { BookInterface } from './types'
import User from './User';
import Book from './Book';

class BookClub extends Model {
  public id!: number;
  public name!: string;
  public description!: string;
  public createdBy!: number;
  public currentBookId!: number | null;
  public books!: BookInterface[];
}

BookClub.init({
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  currentBookId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  books: {
    type: DataTypes.JSONB,
    defaultValue: [],
  }
}, {
  sequelize,
  modelName: 'BookClub',
});

// associations
BookClub.belongsTo(User, { as: 'creator', foreignKey: 'createdBy' });
BookClub.belongsTo(Book, { as: 'currentBook', foreignKey: 'currentBookId' });

export default BookClub;
