import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db';
import { 
  BannerImageInterface, 
  BookClubAccessEnum, 
  BookClubMembersInterface, 
  BookClubPostInterface, 
  BookInterface, 
  CoverImageInterface 
} from './types'
import User from './User';
import Book from './Book';

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
class BookClub extends Model {
  public id!: number;
  public name!: string;
  public description!: string;
  public banner!: BannerImageInterface;
  public coverImage!: CoverImageInterface;
  public members!: BookClubMembersInterface[];
  public posts!: BookClubPostInterface[];
  public createdBy!: number;
  public currentBookId!: number | null;
  public active!: boolean;
  public access!: BookClubAccessEnum;
  public bookList!: BookInterface[];
  public createdAt!: Date;
  public updatedAt!: Date;
}

BookClub.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
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
  members: {
    type: DataTypes.JSONB,
    defaultValue: [],
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
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
  modelName: 'BookClub',
  tableName: 'bookClubs',
  timestamps: true,
  indexes: [
    {
      name: 'idx_bookclub_name',
      fields: ['name'],
    },
    {
      name: 'idx_bookclub_members',
      fields: ['members'],
    },
    {
      name: 'idx_bookclub_posts',
      fields: ['posts'],
    },
    {
      name: 'idx_bookclub_current_book',
      fields: ['currentBookId'],
    },
    {
      name: 'idx_bookclub_active',
      fields: ['active'],
    },
    {
      name: 'idx_bookclub_access',
      fields: ['access'],
    },
    {
      name: 'idx_bookclub_book_list',
      fields: ['bookList'],
    },
  ]
});

// associations
BookClub.belongsToMany(User, { through: 'UserBookClub' });
User.belongsToMany(BookClub, { through: 'UserBookClub' });

BookClub.belongsToMany(Book, { through: 'BookClubBook' });
Book.belongsToMany(BookClub, { through: 'BookClubBook' });

BookClub.belongsTo(User, { as: 'creator', foreignKey: 'createdBy' });
BookClub.belongsTo(Book, { as: 'currentBook', foreignKey: 'currentBookId' });

export default BookClub;
