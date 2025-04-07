import express from "express";
import {
    register,
    login,
    logout,
    getCurrentUser,
    verifyToken
} from "../controllers/authController.js";

import protect from "../middlewares/authMiddleware.js";
const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/verifyToken", verifyToken);

// Protected routes (for testing)
router.use(protect);
router.post("/logout", logout);
router.get("/me", getCurrentUser);

export default router;
