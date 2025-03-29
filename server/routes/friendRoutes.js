import express from "express";
// import friendController from "../controllers/friendController.js";
import { sendFriendRequest, acceptFriendRequest, rejectFriendRequest, getFriendRequests, getFriends } from "../controllers/friendController.js";
import protect from "../middlewares/authMiddleware.js";

const   router = express.Router();

// Protect all routes after this middleware
router.use(protect);

// Friend request routes
router.post('/request/:userId', sendFriendRequest);
router.post('/request/:requestId/accept', acceptFriendRequest);
router.post('/request/:requestId/reject', rejectFriendRequest);

// Friend list routes
router.get('/requests', getFriendRequests);
router.get('/list', getFriends);

export default router; 