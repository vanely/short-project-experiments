import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/db';

class Book extends Model {
  public id!: number;
  
}