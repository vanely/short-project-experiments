import express from 'express';
import { FriendRequestController } from '../controllers/friendRequestController';

const router = express.Router();

router.post('/send-request', FriendRequestController.sendFriendRequest);
router.post('/accept-request', FriendRequestController.acceptFriendRequest);
router.get('/sent-requests', FriendRequestController.getSentFriendRequests);
router.get('/received-requests', FriendRequestController.getReceivedFriendRequests);

export default router;
