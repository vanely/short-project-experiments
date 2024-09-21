import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import User from '../models/User';
import { AppError } from '../utils/appError';
import { catchAsync } from '../utils/catchAsync';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

const signToken = (id: string): string => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

export const AuthController = {
  register: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, username, firstName, lastName } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return next(new AppError('Email or username already in use', 400));
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
    const token = signToken(newUser.id);

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: newUser.toSafeObject(),
      },
    });
  }),

  login: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    // Check if email and password exist
    if (!email || !password) {
      return next(new AppError('Please provide email and password', 400));
    }

    // Find user by email
    const user = await User.findOne({ where: { email } });

    // Check if user exists and password is correct
    if (!user || !(await user.validatePassword(password))) {
      return next(new AppError('Incorrect email or password', 401));
    }

    // Generate JWT
    const token = signToken(user.id);

    res.status(200).json({
      status: 'success',
      token,
      data: {
        user: user.toSafeObject(),
      },
    });
  }),

  googleAuth: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // Assuming you're using passport for Google OAuth
    // This function would be called after successful Google authentication
    const { id, email, firstName, lastName } = req.user as User;

    // Generate JWT
    const token = signToken(id);

    res.status(200).json({
      status: 'success',
      token,
      data: {
        user: { id, email, firstName, lastName },
      },
    });
  }),

  protect: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // Get token from header
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('You are not logged in. Please log in to get access.', 401));
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; iat: number };

    // Check if user still exists
    const currentUser = await User.findByPk(decoded.id);
    if (!currentUser) {
      return next(new AppError('The user belonging to this token no longer exists.', 401));
    }

    // Grant access to protected route
    req.user = currentUser;
    next();
  }),

  updatePassword: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { currentPassword, newPassword } = req.body;
    const user = req.user as User;

    // Check current password
    if (!(await user.validatePassword(currentPassword))) {
      return next(new AppError('Your current password is incorrect', 401));
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Generate new JWT
    const token = signToken(user.id);

    res.status(200).json({
      status: 'success',
      token,
      message: 'Password updated successfully',
    });
  }),
};
