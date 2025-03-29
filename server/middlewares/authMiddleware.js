import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import AppError from '../utils/appError.js';

const protect = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return next(new AppError('You are not logged in! Please log in to get access.', 401,res));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const currentUser = await User.findById(decoded.userId);
        if (!currentUser) {
            return next(new AppError('The user belonging to this token no longer exists.', 401,res));
        }

        req.user = currentUser;
        next();
    } catch (error) {
        next(new AppError('Invalid token. Please log in again!', 401,res));
    }
};

export default protect; 