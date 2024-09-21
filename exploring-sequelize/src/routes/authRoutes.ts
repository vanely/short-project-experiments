import express from 'express';
import { AuthController } from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/google/callback', AuthController.googleAuth); // This would be used with Passport Google strategy
router.get('/current-user', authMiddleware, AuthController.getCurrentUser);
router.patch('/update-password', authMiddleware, AuthController.updatePassword);
router.post('/logout', AuthController.logout);

export default router;