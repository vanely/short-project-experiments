import { Model, DataTypes, Association } from 'sequelize';
import argon2 from 'argon2';
import crypto from 'crypto';
import sequelize from '../config/db';
import { BookClubInterface, FriendRequestInterface, SoloReadingListInterface } from './types';
import FriendRequest from './FriendRequest';

// REVIEW: it may not be the best idea to keep the password here? Or is it since it's encrypted? 
//         May just have to remove it from user requests, or write queries that don't return it at all.
class User extends Model {
  public id!: number;
  public email!: string;
  public password!: string;
  public passwordSalt!: string;
  public name!: string;
  public googleId!: string | null;
  public bookClubs!: BookClubInterface[];
  public soloReadingLists!: SoloReadingListInterface[];
  public friendRequests!: FriendRequestInterface[];
  public friends!: number[];
  public createdAt!: Date;
  public updatedAt!: Date;

  public static associations: {
    friends: Association<User, User>;
    sentFriendRequests: Association<User, FriendRequest>;
    receivedFriendRequests: Association<User, FriendRequest>;
  }

  public async validatePassword(password: string): Promise<boolean> {
    const pepper: string = process.env.PASSWORD_PEPPER || 'unh-senha-aleatoria-pepper';
    return argon2.verify(this.password, `${password}${this.passwordSalt}${pepper}`);
  }

  // get user model without password
  public toSafeObject(): Partial<User> {
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
  bookClubs: {
    type: DataTypes.ARRAY(DataTypes.INTEGER),
    defaultValue: [],
  },
  soloReadingLists: {
    type: DataTypes.ARRAY(DataTypes.INTEGER),
    defaultValue: [],
  },
  friendRequests: {
    type: DataTypes.ARRAY(DataTypes.INTEGER),
    defaultValue: [],
  },
  friends: {
    type: DataTypes.ARRAY(DataTypes.INTEGER),
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
          memoryCost: 2**16,
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
    }
  ]
})

// confirm these are ok
User.belongsToMany(User, {
  as: 'friends',
  through: 'UserFriends',
  foreignKey: 'userId',
  otherKey: 'friendId'
});

User.hasMany(FriendRequest, {
  as: 'sentFriendRequests',
  foreignKey: 'fromId'
});

User.hasMany(FriendRequest, {
  as: 'receivedFriendRequests',
  foreignKey: 'toId'
});

export default User;
