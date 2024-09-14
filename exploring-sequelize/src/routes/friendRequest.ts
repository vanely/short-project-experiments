import express from 'express';
import { FriendRequestController } from '../controllers/friendRequest';

const router = express.Router();

router.post('/send-request', FriendRequestController.sendFriendRequest);
router.get('/accept-request', FriendRequestController.acceptFriendRequest);
router.put('/get-sent-requests', FriendRequestController.getSentFriendRequests);
router.get('/get-received-requests', FriendRequestController.getReceivedFriendRequests);

export default router;
