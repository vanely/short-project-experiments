import { Op, Transaction } from 'sequelize';
import { Request, Response } from 'express';
import { User } from '../models/index';
import { AppError } from '../utils/appError';
import sequelize from '../config/db';

export class UserController {
  static async register(req: Request, res:Response) {
    
    try {
      // validation should be done to make sure required fields are present
      const user = await User.create(
        req.body,
        { fields: ['firstName', 'lastName', 'username', 'email', 'password'] }
      )
      console.log(`Just registered user:\n${JSON.stringify(user, null, 2)}`);
      if (!user) {
        throw new AppError('Unable to create user', 400);
      }

    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
      console.error(`Error:\n${error}`);
    }
  }

  static async login(req: Request, res: Response) {

  }

  static async removeFriend(req: Request, res: Response) {

  }

  static async getProfile(req: Request, res: Response) {
    try {
      const { userId } = req.body;
      // instead of select, try using custom toSafeObject
      const user = await User.findByPk(userId);
      if (!user) {
        throw new AppError('User not found', 404);
      }
      console.log(`User from 'getProfile':\n${JSON.stringify(user, null, 2)}`);
      res.json(user);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
      console.error(`Error:\n${error}`);
    }
  }

  static async updateProfile(req: Request, res: Response) {
    try {
      const { firstName, lastName, email, userId } = req.body; 
      const user = await User.update(
        { firstName, lastName, email },
        { where: { id: userId } }
      );
      if (!user) {
        throw new AppError('User not found', 404);
      }
      console.log(`User updated in 'updateProfile':\n${JSON.stringify(user, null, 2)}`);
      res.json(user);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
      console.error(`Error:\n${error}`);
    }
  }

  static async searchUsers(req: Request, res: Response) {
    try {
      const { query } = req.query;
      const users = await User.findAndCountAll({
        where: {
          username: {
            [Op.like]: `${query}%`,
          },
          firstName: {
            [Op.like]: `${query}%`,
          },
        },
        offset: 5,
        limit: 5,
      });
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
      console.error(`Error:\n${error}`);
    }
  }

  static async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id);
      if (!user) {
        throw new AppError('User not found', 404);
      }
      console.log(`User from 'getUserById':\n${JSON.stringify(user, null, 2)}`);
      res.json(user);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
      console.error(`Error:\n${error}`);
    }
  }
}
