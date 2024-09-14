import express from 'express';
import { UserController } from '../controllers/user';

const router = express.Router();

router.post('/register', UserController.register);
router.get('/profile', UserController.getProfile);
router.put('/profile', UserController.updateProfile);
router.get('/search', UserController.searchUsers);
router.get('/:id', UserController.getUserById);

export default router;
