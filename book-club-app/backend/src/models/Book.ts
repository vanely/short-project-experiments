import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db';
import { CoverImageInterface } from './types';

class Book extends Model {
  public id!: number;
  public title!: string;
  public author!: string;
  public isbn!: string;
  public publishedDate!: Date;
  public description!: string;
  public coverImage!: CoverImageInterface;
  public pageCount!: number;
  public inProgress!: boolean;
  public completed!: boolean;
  public startDate!: Date;
  public endDate!: Date;
  public bookApiReference!: string;
}

Book.init({
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isbn: {
    type: DataTypes.STRING,
    unique: true,
  },
  publishedDate: {
    type: DataTypes.DATE,
  },
  description: {
    type: DataTypes.TEXT,
  },
  coverImage: {
    type: DataTypes.JSONB,
    allowNull: true,
    validate: {
      isValidCoverImage(value: CoverImageInterface) {
        if (!value.url || typeof value.url !== 'string') {
          throw new Error('Cover image must have a valid URL');
        }
      }
    }
  },
  pageCount: {
    type: DataTypes.INTEGER,
  },
  bookApiReference: {
    type: DataTypes.STRING,
  }
}, {
  sequelize,
  modelName: 'Book',
});

export default Book;
