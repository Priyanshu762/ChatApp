import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
    updateProfile,
    updateSettings,
    sendFriendRequest,
    respondToFriendRequest,
    blockUser,
    unblockUser,
    searchUsers
} from '../controllers/userController.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Profile routes
router.patch('/profile', updateProfile);
router.patch('/settings', updateSettings);


// Block routes
router.post('/block/:userId', blockUser);
router.delete('/block/:userId', unblockUser);

// Search route
router.get('/search', searchUsers);

export default router; 