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
import sequelize from '../config/db';
import FriendRequest from './FriendRequest';
import BookClub from './BookClub';
import SoloReadingList from './SoloReadingList';

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>;
  declare email: string;
  declare password: string | null;
  declare passwordSalt: string;
  declare name: string;
  declare googleId: string | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  // associations
  declare friendRequests?: NonAttribute<FriendRequest[]>;
  declare bookClubs?: NonAttribute<BookClub[]>;
  declare soloReadingLists?: NonAttribute<SoloReadingList[]>;
  declare friends?: NonAttribute<User[]>;

  declare static associations: {
    friendRequests: Association<User, FriendRequest>;
    bookClubs: Association<User, BookClub>;
    soloReadingLists: Association<User, SoloReadingList>;
    friends: Association<User, User>;
  };

  async validatePassword(password: string): Promise<boolean> {
    const pepper: string = process.env.PASSWORD_PEPPER || 'unh-senha-aleatoria-pepper';
    return this.password ? argon2.verify(this.password, `${password}${this.passwordSalt}${pepper}`) : false;
  }

  // get user model without password
  toSafeObject(): Partial<User> {
    const { id, email, name, googleId, bookClubs, soloReadingLists, friends, createdAt, updatedAt } = this;
    return { id, email, name, googleId, bookClubs, soloReadingLists, friends, createdAt, updatedAt };
  }
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
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
  name: {
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
        const pepper: string = process.env.PASSWORD_PEPPER || 'unh-senha-aleatoria-pepper';
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
      name: 'idx_user_firstname',
      fields: ['firstName'],
    },
    {
      name: 'idx_user_lastname',
      fields: ['lastName'],
    },
    {
      name: 'idx_user_created_at',
      fields: ['createdAt'],
    },
    {
      name: 'idx_user_book_clubs',
      fields: ['bookClubs'],
    },
    {
      name: 'idx_user_solo_reading_lists',
      fields: ['soloReadingLists'],
    },
  ],
});

// associations
User.hasMany(FriendRequest, {
  as: 'userHasReceivedFriendRequests',
  foreignKey: 'toId',
});

User.hasMany(FriendRequest, {
  as: 'userHasSentFriendRequests',
  foreignKey: 'fromId',
})

User.belongsToMany(BookClub, {
  as: 'userBelongsToBookClubs',
  through: 'UserBookClubs',
});

// REVIEW: add has many bookClubs
User.hasMany(BookClub, {
  as: 'userHasBookClubs',
  foreignKey: 'userId',
})

User.belongsToMany(SoloReadingList, {
  as: 'userBelongsToReadingLists',
  through: 'UserReadingLists',
})

User.hasMany(SoloReadingList, {
  as: 'userHasSoloReadingLists',
  foreignKey: 'userId',
});

User.belongsToMany(User, {
  as: 'friends',
  through: 'UserFriends',
});

export default User;
