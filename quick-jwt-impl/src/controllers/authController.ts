import { Request, Response } from 'express';
import { User } from '../models/User';
import { generateToken } from '../utils/jwt';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const user = new User(req.body);
      await user.save();
      const token = generateToken(user);
      res.status(201).send({ user, token });
    } catch (error) {
      res.status(400).send(error);
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).send({ error: 'Invalid login credentials' });
      }
      const token = generateToken(user);
      res.send({ user, token });
    } catch (error) {
      res.status(400).send(error);
    }
  }

  static async logout(req: Request, res: Response) {
    // With JWT, logout is typically handled client-side by removing the token
    res.send({ message: 'Logout successful' });
  }
}
