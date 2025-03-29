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
            data: {
                _id: newUser._id,
                fullName: newUser.fullName,
                username: newUser.username,
                profilePicture: newUser.profilePicture,
                token
            }
        });

    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        // Find user
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({
                status: 'error',
                message: "Invalid username or password"
            });
        }

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
            data: {
                _id: user._id,
                username: user.username,
                fullName: user.fullName,
                profilePicture: user.profilePicture,
                bio: user.bio,
                settings: user.settings,
                token
            }
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
            data: user
        });

    } catch (error) {
        next(error);
    }
};







