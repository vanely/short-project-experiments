import {
  Model,
  DataTypes,
  Association,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
  ForeignKey,
} from 'sequelize';
import sequelize from '../../config/db';
import {
  BannerImageInterface,
  BookClubAccessEnum,
  BookClubMembersInterface,
  BookClubPostInterface,
  BookInterface,
  CoverImageInterface
} from '../types'
import User from '../user/User';
// import Book from './Book';

// NOTE: [x] add active and inactive fields for bookclubs
// NOTE: [x] add bookclub banner field
// NOTE: [x] add posts field, interface should contain emojis(with ref to person who added), comments(allow users to be @ed)
// NOTE: [x] all book clubs to be public or private
// NOTE: [x] add roles to bookclub: [admin, participant]
// NOTE: [] Theming:
//       all users to add images for background, and change colors
//       provide preset themes.
//       upload pictures and generate color palette similar to google forms.
// NOTE: [] scheduling for bookclub conversations, that generates .ics calender events

// ADDITIONS TO THIS SHOULD REFLECT "BookClubInterface"
class BookClub extends Model<InferAttributes<BookClub>, InferCreationAttributes<BookClub>> {
  declare id: CreationOptional<string>;
  declare ownerId: ForeignKey<User['id']>;
  declare name: string;
  declare description: string;
  declare banner: BannerImageInterface;
  declare coverImage: CoverImageInterface;
  // TODO: this will need to be it's own model
  declare posts: BookClubPostInterface[];
  declare currentBookId: number | null;
  declare active: boolean;
  declare access: BookClubAccessEnum;
  // TODO: make this book model
  declare bookList: BookInterface[];
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  
  // associations
  declare members?: NonAttribute<User[]>;

  declare static associations: {
    members: Association<BookClub, User>;
  }
}

BookClub.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  banner: {
    type: DataTypes.JSONB,
    allowNull: true,
    validate: {
      isValidCoverImage(value: BannerImageInterface) {
        if (!value.url || typeof value.url !== 'string') {
          throw new Error('Banner image is invalid URL, or unsafe URL');
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
          throw new Error('Cover image image is invalid URL, or unsafe URL');
        }
      }
    }
  },
  posts: {
    type: DataTypes.JSONB,
    defaultValue: [],
  },
  ownerId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  currentBookId: {
    type: DataTypes.UUID,
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
  modelName: 'BookClub',
  tableName: 'bookClubs',
  timestamps: true,
  indexes: [
    {
      name: 'idx_bookclub_name',
      fields: ['name'],
    },
  ]
});

// associations
// BookClub.hasMany(User, { as: 'members' });
// User.belongsToMany(BookClub, { through: 'UserBookClub' });

// BookClub.belongsToMany(Book, { through: 'BookClubBook' });
// Book.belongsToMany(BookClub, { through: 'BookClubBook' });

// BookClub.belongsTo(User, { as: 'creator', foreignKey: 'createdBy' });
// BookClub.belongsTo(Book, { as: 'currentBook', foreignKey: 'currentBookId' });

export default BookClub;
