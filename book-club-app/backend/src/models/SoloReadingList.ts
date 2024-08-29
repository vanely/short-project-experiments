import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db';
import User from './User';
import { BannerImageInterface, BookInterface, CoverImageInterface, SoloReadingListEnum } from './types';

// NOTE: should keep track of users who subscribe to a public reading list
//       create a tagging system for filtering beyond genre
class SoloReadingList extends Model {
  public id!: number;
  public createdBy!: number;
  public name!: string;
  public description!: string;
  public upVotes!: number;
  public banner!: BannerImageInterface;
  public coverImage!: CoverImageInterface;
  public currentBookId!: number | null;
  public active!: boolean;
  public access!: SoloReadingListEnum;
  public bookList!: BookInterface[];
  public createdAt!: Date;
  public updatedAt!: Date;
}

SoloReadingList.init({
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  upVotes: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  banner: {
    type: DataTypes.JSONB,
    allowNull: true,
    validate: {
      isValidCoverImage(value: BannerImageInterface) {
        if (!value.url || typeof value.url !== 'string') {
          throw new Error('Banner image must have a valid URL');
        }
      }
    }
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
  currentBookId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  access: {
    type: DataTypes.ENUM('public', 'private'),
    defaultValue: 'private',
  },
  bookList: {
    type: DataTypes.JSONB,
    defaultValue: [],
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  }
}, {
  sequelize,
  modelName: 'SoloReadingList',
});

// associations
SoloReadingList.belongsTo(User);
User.hasMany(SoloReadingList);

export default SoloReadingList;
