import {
  Model,
  DataTypes,
  Association,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute
} from 'sequelize';
import crypto from 'crypto';
import sequelize from '../config/db';

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>;
  declare email: string;
  declare username: string;
  declare password: string | null;
  declare firstName: string;
  declare lastName: string;

  // // associations
  // declare friendRequests?: NonAttribute<FriendRequest[]>;
  // declare bookClubs?: NonAttribute<BookClub[]>;
  // declare soloReadingLists?: NonAttribute<SoloReadingList[]>;
  // declare friends?: NonAttribute<User[]>;

  // get user model without password
  toSafeObject(): Partial<User> {
    const { id, username, email, firstName, lastName } = this;
    return { id, username, email, firstName, lastName };
  }
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
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
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users',
  timestamps: true,
  indexes: [
    {
      name: 'idx_username',
      fields: ['username'],
      unique: true,
    },
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
  ],
});

export default User;
