import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db';
import User from './User';
import { FriendRequestStatusEnum } from './types';

class FriendRequest extends Model {
  public id!: number;
  public fromUserId!: number;
  public toUserId!: number;
  public status!: FriendRequestStatusEnum;
  public createdAt!: Date;
  public updatedAt!: Date;
}

FriendRequest.init({
  fromUserId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  toUserId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'accepted', 'rejected'),
    defaultValue: 'pending',
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
  modelName: 'FriendRequest',
  tableName: 'friendRequests',
  timestamps: true,
});

// associations
User.hasMany(FriendRequest, { as: 'sentRequests', foreignKey: 'fromId' });
User.hasMany(FriendRequest, { as: 'receivedRequests', foreignKey: 'toId' });
FriendRequest.belongsTo(User, { as: 'from', foreignKey: 'fromId' });
FriendRequest.belongsTo(User, { as: 'to', foreignKey: 'toId' });

export default FriendRequest;
