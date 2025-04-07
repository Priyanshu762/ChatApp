import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generatToken.js";

export const register = async (req, res, next) => {
    try {
        const { fullName, username, password, confirmPassword } = req.body;

        // Validate password match
        if (password !== confirmPassword) {
            return res.status(400).json({
                status: 'error',
                message: "Passwords do not match"
            });
        }

        // Check if user exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({
                status: 'error',
                message: "Username already exists"
            });
        }

        // Generate profile picture
        const profilePicture = `https://ui-avatars.com/api/?name=${username}`;

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            fullName,
            username,
            password: hashedPassword,
            profilePicture
        });

        // Save user
        await newUser.save();

        // Generate token
        const token = generateTokenAndSetCookie(res, newUser._id);

        // Send success response
        res.status(201).json({
            status: 'success',
            message: "User created successfully",
            user: {
                _id: newUser._id,
                fullName: newUser.fullName,
                username: newUser.username,
                profilePicture: newUser.profilePicture,
            },
            token: token
        });

    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        console.log(username, password);
        // Find user
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({
                status: 'error',
                message: "Invalid username or password"
            });
        }
        console.log(user);
        // Validate password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({
                status: 'error',
                message: "Invalid username or password"
            });
        }

        // Generate token
        const token = generateTokenAndSetCookie(res, user._id);

        // Send success response
        res.status(200).json({
            status: 'success',
            message: "Logged in successfully",
            user: {
                _id: user._id,
                username: user.username,
                fullName: user.fullName,
                profilePicture: user.profilePicture,
                bio: user.bio,
                settings: user.settings,
                status: user.status,
                lastSeen: user.lastSeen,
                isOnline: user.isOnline,
                isTyping: user.isTyping,
                isActive: user.isActive,
                isBlocked: user.isBlocked,
                isDeleted: user.isDeleted,
            },
            token: token
        });

    } catch (error) {
        next(error);
    }
};

export const logout = async (req, res, next) => {
    try {
        res.cookie("jwt", "", {
            maxAge: 0,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
            path: "/"
        });

        res.status(200).json({
            status: 'success',
            message: "Logged out successfully"
        });

    } catch (error) {
        next(error);
    }
};

export const getCurrentUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id)
            .select('-password')
            .populate('friends', 'username fullName profilePicture status lastSeen')
            .populate('friendRequests.from', 'username fullName profilePicture');

        if (!user) {
            return res.status(401).json({
                status: 'error',
                message: "User not found"
            });
        }

        res.status(200).json({
            status: 'success',
            user: user
        });

    } catch (error) {
        next(error);
    }
};

export const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.status(200).json({
            status: 'success',
            user: decoded
        });
    } catch (error) {
        next(error);
    }
}

