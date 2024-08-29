import { Request, Response, NextFunction } from 'express';
import { getUser } from './session';

export const authenticationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const user = getUser();
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized: No user found in session' });
  }
  // make ref to user available to route handlers
  req.user = user;
  next();
}
