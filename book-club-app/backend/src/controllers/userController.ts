import { Request, Response } from 'express';
import User from '../models/User';
import FriendRequest from '../models/FriendRequest';

export class UserController {
  static async sendFriendRequest(req: Request, res: Response) {
    try {
      const { to } = req.body;
      const from = req.user?.id;

      const existingRequest = await FriendRequest.findOne({ where: { fromId: from, toId: to } });
      if (existingRequest) {
        return res.status(400).json({ message: 'Friend request already sent' });
      }

      const newRequest = await FriendRequest.create({ fromId: from, toId: to });
      res.status(201).json(newRequest);
    } catch (error) {
      res.status(500).json({ message: 'Error sending friend request' });
    }
  }

  static async respondToFriendRequest(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const request = await FriendRequest.findByPk(id);
      if (!request) {
        return res.status(404).json({ message: 'Friend request not found' });
      }

      request.status = status;
      await request.save();

      if (status === 'accepted') {
        const user1 = await User.findByPk(request.fromId);
        const user2 = await User.findByPk(request.toId);
        await user1?.$add('friends', user2);
        await user2?.$add('friends', user1);
      }

      res.json(request);
    } catch (error) {
      res.status(500).json({ message: 'Error responding to friend request' });
    }
  }

  static async getFriends(req: Request, res: Response) {
    try {
      const user = await User.findByPk(req.user?.id, { include: ['friends'] });
      res.json(user?.friends);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching friends' });
    }
  }
}
