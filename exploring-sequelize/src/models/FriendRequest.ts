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
import sequelize from '../config/db';
import User from './User';
import { FriendRequestStatusEnum } from './types';

// NOTE: allow these to be deleted in by sender, 
class FriendRequest extends Model<InferAttributes<FriendRequest>, InferCreationAttributes<FriendRequest>> {
  declare id: CreationOptional<string>;
  declare status: FriendRequestStatusEnum;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare fromId: ForeignKey<User['id']>;
  declare toId: ForeignKey<User['id']>;

  // assiciations
  declare from?: NonAttribute<User>;
  declare to?: NonAttribute<User>;

  declare static associations: {
    from: Association<FriendRequest, User>;
    to: Association<FriendRequest, User>;
  }
}

FriendRequest.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
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

FriendRequest.belongsTo(User, { 
  as: 'from', 
  foreignKey: 'fromId',
});

FriendRequest.belongsTo(User, { 
  as: 'to', 
  foreignKey: 'toId',
});

export default FriendRequest;
