import { Request, Response, NextFunction } from 'express';
import { sessionNamespace } from '../helpers/sessionNamespace';

export const sessionMiddleware = (req: Request, res: Response, next: NextFunction) => {
  sessionNamespace.run(() => {
    try {
      if (req.user) {
        sessionNamespace.set('user', req.user);
      } else {
        console.warn('No user found in request object');
      }
      next();
    } catch (error) {
      console.error(`Error in session middleware:\n${error}`);
      next(error)
    }
  });
}

export const getUser = (): Express.User | undefined => {
  return sessionNamespace.get('user');
}
