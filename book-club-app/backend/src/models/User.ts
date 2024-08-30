import { Model, DataTypes } from 'sequelize';
import argon2 from 'argon2';
import crypto from 'crypto';
import sequelize from '../config/db';
import { BookClubInterface, SoloReadingListInterface } from './types';

class User extends Model {
  public id!: number;
  public email!: string;
  public password!: string;
  public passwordSalt!: string;
  public name!: string;
  public googleId!: string | null;
  public bookClubs!: BookClubInterface[];
  public soloReadingLists!: SoloReadingListInterface[];
  public createdAt!: Date;
  public updatedAt!: Date;

  public async validatePassword(password: string): Promise<boolean> {
    const pepper: string = process.env.PASSWORD_PEPPER || 'unh-senha-aleatoria-pepper';
    return argon2.verify(this.password, `${password}${this.passwordSalt}${pepper}`);
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
    type: DataTypes.JSONB,
    defaultValue: [],
  },
  soloReadingLists: {
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

export default User;
