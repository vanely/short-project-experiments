import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
} from 'sequelize';
import sequelize from '../config/db';
import User from './User';
import {
  BannerImageInterface,
  BookInterface,
  CoverImageInterface,
  SoloReadingListEnum
} from './types';

// NOTE: should keep track of users who subscribe to a public reading list
//       create a tagging system for filtering beyond genre
// REVIEW: using the models themselves as types result in circular imports, is this ok, since they're just being used as types?
class SoloReadingList extends Model<InferAttributes<SoloReadingList>, InferCreationAttributes<SoloReadingList>> {
  declare id: CreationOptional<string>;
  declare ownerId: ForeignKey<User['id']>;
  declare name: string;
  declare description: string;
  declare upVotes: number;
  declare banner: BannerImageInterface;
  declare coverImage: CoverImageInterface;
  // REVIEW: may need to update this when implemented
  declare currentBook: BookInterface;
  declare active: boolean;
  declare access: SoloReadingListEnum;
  declare bookList: BookInterface[];
  declare createdAt: Date;
  declare updatedAt: Date;
}

SoloReadingList.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  ownerId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
  },
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
  currentBook: {
    type: DataTypes.JSONB,
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
  tableName: 'soloReadingLists',
  timestamps: true,
  indexes: [
    {
      name: 'idx_bookclub_name',
      fields: ['name'],
    },
  ],
});

export default SoloReadingList;
