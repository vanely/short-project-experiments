import { Request, Response } from 'express';
import User from '../models/User';
import { AppError } from '../utils/appError';

export class UserController {
  static async register(req: Request, res:Response) {
    try {
      // validation should be done to make sure required fields are present
      const user = await User.create(
        req.body,
        { fields: ['firstName', 'lastName', 'email', 'password'] }
      )
      if (!user) {
        throw new AppError('Unable to create user', 400);
      }

    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
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
    }
  }

  static async searchUsers(req: Request, res: Response) {
    try {
      const { query } = req.query;
      const users = await User.find({
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { email: { $regex: query, $options: 'i' } }
        ]
      }).select('name email');
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
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
    }
  }
}
