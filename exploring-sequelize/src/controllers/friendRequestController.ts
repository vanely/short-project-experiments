import { Request, Response } from 'express';
import { Transaction } from 'sequelize';
import { FriendRequest, User } from '../models'; // Assuming you have these models
import sequelize from '../config/db';
import { FriendRequestStatusEnum } from '../models/types';

class FriendRequestController {
	/**
	 * Send a friend request
	 * Route: POST /send-request
	 */
	static async sendFriendRequest(req: Request, res: Response): Promise<void> {
		const t: Transaction = await sequelize.transaction();

		try {
			const { fromId, toId } = req.body;

			if (!fromId || !toId) {
				res.status(400).json({ error: 'Both fromId and toId are required' });
				return;
			}

			if (fromId === toId) {
				res.status(400).json({ error: 'Cannot send friend request to yourself' });
				return;
			}

			// this logic can be done in the UI, via sent requests. On the current user, check the sent invites against the ids of users being viewed for graying out request button.
			const existingRequest = await FriendRequest.findOne({
				where: {
					fromId,
					toId,
					status: FriendRequestStatusEnum.PENDING,
				},
				transaction: t,
			});

			if (existingRequest) {
				res.status(400).json({ error: 'A pending friend request already exists' });
				return;
			}

			const newRequest = await FriendRequest.create(
				{
					fromId,
					toId,
					status: FriendRequestStatusEnum.PENDING,
				},
				{ transaction: t }
			);

			await t.commit();
			res.status(201).json(newRequest);
		} catch (error) {
			await t.rollback();
			console.error('Error sending friend request:', error);
			res.status(500).json({ error: 'An error occurred while sending the friend request' });
		}
	}

	/**
	 * Accept a friend request
	 * Route: POST /accept-request
	 */
	static async acceptFriendRequest(req: Request, res: Response): Promise<void> {
		const t: Transaction = await sequelize.transaction();

		try {
			const { requestId, toId } = req.body;

			if (!requestId || !toId) {
				res.status(400).json({ error: 'Request ID and toId are required' });
				return;
			}

			const request = await FriendRequest.findOne({
				where: {
					id: requestId,
					toId,
					status: FriendRequestStatusEnum.PENDING,
				},
				transaction: t,
			});

			if (!request) {
				res.status(404).json({ error: 'Valid pending friend request not found' });
				return;
			}

			await request.update({ status: FriendRequestStatusEnum.ACCEPTED }, { transaction: t });

			// Add users as friends (assuming you have a separate friends table or association)
			const fromUser = await User.findByPk(request.fromId, { transaction: t });
			const toUser = await User.findByPk(toId, { transaction: t });

			if (!fromUser || !toUser) {
				throw new Error('User not found');
			}

			// Implement the logic to add users as friends here
			// This might involve updating a separate friends table or adding to a friends array in the User model
			// Example: await fromUser.addFriend(toUser, { transaction: t });
			//          await toUser.addFriend(fromUser, { transaction: t });

			await t.commit();
			res.status(200).json({ message: 'Friend request accepted successfully' });
		} catch (error) {
			await t.rollback();
			console.error('Error accepting friend request:', error);
			res.status(500).json({ error: 'An error occurred while accepting the friend request' });
		}
	}

	/**
	 * Get sent friend requests
	 * Route: GET /sent-requests
	 */
	static async getSentFriendRequests(req: Request, res: Response): Promise<void> {
		try {
			const { userId } = req.query;

			if (!userId) {
				res.status(400).json({ error: 'User ID is required' });
				return;
			}

			const sentRequests = await FriendRequest.findAll({
				where: { fromId: userId as string },
				include: [
					{ model: User, as: 'to', attributes: ['id', 'name'] },
				],
			});

			res.status(200).json(sentRequests);
		} catch (error) {
			console.error('Error fetching sent friend requests:', error);
			res.status(500).json({ error: 'An error occurred while fetching sent friend requests' });
		}
	}

	/**
	 * Get received friend requests
	 * Route: GET /received-requests
	 */
	static async getReceivedFriendRequests(req: Request, res: Response): Promise<void> {
		try {
			const { userId } = req.query;

			if (!userId) {
				res.status(400).json({ error: 'User ID is required' });
				return;
			}

			const receivedRequests = await FriendRequest.findAll({
				where: {
					toId: userId as string,
					status: FriendRequestStatusEnum.PENDING
				},
				include: [
					{ model: User, as: 'from', attributes: ['id', 'name'] },
				],
			});

			res.status(200).json(receivedRequests);
		} catch (error) {
			console.error('Error fetching received friend requests:', error);
			res.status(500).json({ error: 'An error occurred while fetching received friend requests' });
		}
	}

	/**
	 * Delete a friend request
	 * Note: This method is added based on the comment in the model
	 */
	static async deleteFriendRequest(req: Request, res: Response): Promise<void> {
		const t: Transaction = await sequelize.transaction();

		try {
			const { requestId, userId } = req.body;

			if (!requestId || !userId) {
				res.status(400).json({ error: 'Request ID and user ID are required' });
				return;
			}

			const request = await FriendRequest.findOne({
				where: {
					id: requestId,
					fromId: userId,
					status: FriendRequestStatusEnum.PENDING,
				},
				transaction: t,
			});

			if (!request) {
				res.status(404).json({ error: 'Valid pending friend request not found' });
				return;
			}

			await request.destroy({ transaction: t });

			await t.commit();
			res.status(200).json({ message: 'Friend request deleted successfully' });
		} catch (error) {
			await t.rollback();
			console.error('Error deleting friend request:', error);
			res.status(500).json({ error: 'An error occurred while deleting the friend request' });
		}
	}
}

export default FriendRequestController;