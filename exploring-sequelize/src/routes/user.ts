import express from 'express';
import { UserController } from '../controllers/userController';

const router = express.Router();

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.post('/unfriend', UserController.removeFriend);
router.get('/profile', UserController.getProfile);
router.put('/update-profile', UserController.updateProfile);
router.get('/search', UserController.searchUsers);
router.get('/:id', UserController.getUserById);

export default router;
