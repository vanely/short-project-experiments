import { Request, Response, NextFunction } from 'express';
import { Op } from 'sequelize';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { AppError } from '../utils/appError';
import { catchAsync } from '../utils/catchAsync';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

export class AuthController {
  static generateToken(userId: string): string {
    return jwt.sign({ id: userId }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });
  }

  static register = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, username, firstName, lastName } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }]
      }
    });

    if (existingUser) {
      return next(new AppError('User with this email or username already exists', 400));
    }

    // Create new user
    const newUser = await User.create({
      email,
      password,
      username,
      firstName,
      lastName,
    });

    // Generate JWT
    const token = AuthController.generateToken(newUser.id);

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: newUser.toSafeObject(),
      },
    });
  });

  static login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    // Check if email and password exist
    if (!email || !password) {
      return next(new AppError('Please provide email and password', 400));
    }

    // Check if user exists && password is correct
    const user = await User.findOne({ where: { email } });

    if (!user || !(await user.validatePassword(password))) {
      return next(new AppError('Incorrect email or password', 401));
    }

    // If everything ok, send token to client
    const token = AuthController.generateToken(user.id);

    res.status(200).json({
      status: 'success',
      token,
      data: {
        user: user.toSafeObject(),
      },
    });
  });

  static googleAuth = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // This would be called after successful Google authentication
    // Assuming you're using passport for Google OAuth
    const googleUser = req.user as User;

    if (!googleUser) {
      return next(new AppError('No user from Google', 401));
    }

    // Generate JWT
    const token = AuthController.generateToken(googleUser.id);

    res.status(200).json({
      status: 'success',
      token,
      data: {
        user: googleUser.toSafeObject(),
      },
    });
  });

  static getCurrentUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // Assuming you have middleware that attaches the user to the request
    const user = req.user as User;

    if (!user) {
      return next(new AppError('No user found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        user: user.toSafeObject(),
      },
    });
  });

  static updatePassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { currentPassword, newPassword } = req.body;
    const user = req.user as User;

    if (!user) {
      return next(new AppError('No user found', 404));
    }

    // Check current password
    if (!(await user.validatePassword(currentPassword))) {
      return next(new AppError('Your current password is wrong', 401));
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Generate new token
    const token = AuthController.generateToken(user.id);

    res.status(200).json({
      status: 'success',
      token,
      message: 'Password updated successfully',
    });
  });

  static logout = (req: Request, res: Response) => {
    // For JWT, we don't need to do anything server-side
    // The client should remove the token
    res.status(200).json({
      status: 'success',
      message: 'Logged out successfully',
    });
  };
}
