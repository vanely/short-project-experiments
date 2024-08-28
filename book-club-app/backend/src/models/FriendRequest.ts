import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db';
import User from './User';
import { FriendRequestStatusEnum } from './types';

class FriendRequest extends Model {
  public id!: number;
  public fromUserId!: number;
  public toUserId!: number;
  public status!: FriendRequestStatusEnum;
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
}, {
  sequelize,
  modelName: 'FriendRequest',
});

// associations
User.hasMany(FriendRequest, { as: 'sentRequests', foreignKey: 'fromId' });
User.hasMany(FriendRequest, { as: 'receivedRequests', foreignKey: 'toId' });
FriendRequest.belongsTo(User, { as: 'from', foreignKey: 'fromId' });
FriendRequest.belongsTo(User, { as: 'to', foreignKey: 'toId' });

export default FriendRequest;
