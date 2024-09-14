import { Op } from 'sequelize';
import { Request, Response } from 'express';
import User from '../models/User';
import { AppError } from '../utils/appError';

export class FriendRequestController {
	static async sendFriendRequest(req: Request, res: Response) {

	}

	static async acceptFriendRequest(req: Request, res: Response) {

	}

	static async getSentFriendRequests(req: Request, res: Response) {

	}

	static async getReceivedFriendRequests(req: Request, res: Response) {

	}
}