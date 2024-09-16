import {
  Model,
  DataTypes,
  Association,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute
} from 'sequelize';
import argon2 from 'argon2';
import crypto from 'crypto';
import sequelize from '../../config/db';
import FriendRequest from '../friendRequest/FriendRequest';
import BookClub from '../bookClub/BookClub';
import SoloReadingList from '../soloReadingList/SoloReadingList';

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<string>;
  declare email: string;
  declare password: string | null;
  declare passwordSalt: string;
  declare username: string;
  declare firstName: string;
  declare lastName: string;
  declare googleId: string | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  // associations
  declare receivedFriendRequests?: NonAttribute<FriendRequest[]>;
  declare sentFriendRequests?: NonAttribute<FriendRequest[]>;
  declare belongsToBookClubs?: NonAttribute<BookClub[]>;
  declare ownedBookClubs?: NonAttribute<BookClub[]>;
  declare soloReadingLists?: NonAttribute<SoloReadingList[]>;
  declare friends?: NonAttribute<User[]>;

  declare static associations: {
    receivedFriendRequests: Association<User, FriendRequest>;
    sentFriendRequests: Association<User, FriendRequest>;
    belongsToBookClubs: Association<User, BookClub>;
    ownedBookClubs: Association<User, BookClub>;
    soloReadingLists: Association<User, SoloReadingList>;
    friends: Association<User, User>;
  };

  async validatePassword(password: string): Promise<boolean> {
    const pepper: string = process.env.PASSWORD_PEPPER as string;
    return this.password ? argon2.verify(this.password, `${password}${this.passwordSalt}${pepper}`) : false;
  }

  // get user model without password
  toSafeObject(): Partial<User> {
    const { id, email, username, firstName, lastName, googleId, belongsToBookClubs, ownedBookClubs, soloReadingLists, friends, createdAt, updatedAt } = this;
    return { id, email, username, firstName, lastName, googleId, belongsToBookClubs, ownedBookClubs, soloReadingLists, friends, createdAt, updatedAt };
  }
}

User.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING(128),
    allowNull: true,
  },
  passwordSalt: {
    type: DataTypes.STRING(32),
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  googleId: {
    type: DataTypes.STRING,
    allowNull: true,
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
  },
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users',
  timestamps: true,
  hooks: {
    beforeCreate: async (user: User) => {
      if (user.password) {
        user.passwordSalt = await crypto.randomBytes(16).toString('hex');
        const pepper: string = process.env.PASSWORD_PEPPER as string;
        user.password = await argon2.hash(`${user.password}${user.passwordSalt}${pepper}`, {
          type: argon2.argon2id,
          memoryCost: 2 ** 16,
          timeCost: 3,
          parallelism: 1,
        });
      }
    }
  },
  indexes: [
    {
      name: 'idx_user_email',
      fields: ['email'],
      unique: true,
    },
    {
      name: 'idx_user_username',
      fields: ['username'],
    },
  ],
});

// associations
// User.hasMany(FriendRequest, {
//   as: 'receivedFriendRequests',
//   foreignKey: 'fromId',
// });

// User.hasMany(FriendRequest, {
//   as: 'sentFriendRequests',
//   foreignKey: 'toId',
// })

// User.belongsToMany(BookClub, {
//   as: 'belongsToBookClubs',
//   through: 'UserInBookClubs',
// });

// User.hasMany(BookClub, {
//   as: 'ownedBookClubs',
//   foreignKey: 'ownerId',
// })

// User.hasMany(SoloReadingList, {
//   as: 'soloReadingLists',
// });

// User.hasMany(User, {
//   as: 'friends',
// });

export default User;
