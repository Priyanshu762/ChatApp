import express from "express";
import chatController from "../controllers/chatController.js";
// import authController from "../controllers/authController.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

// Protect all routes after this middleware
router.use(protect);

// Chat routes
router.post('/message', chatController.sendMessage);
router.get('/history/:friendId', chatController.getChatHistory);
router.get('/unread', chatController.getUnreadCount);
router.get('/recent', chatController.getRecentChats);

export default router; 