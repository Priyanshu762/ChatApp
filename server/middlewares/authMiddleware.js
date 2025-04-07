import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import AppError from '../utils/appError.js';

const protect = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        console.log("Token is:",token);
        
        if (!token) {
            return next(new AppError('You are not logged in! Please log in to get access.', 401));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const currentUser = await User.findById(decoded.userId);
        if (!currentUser) {
            // Token belongs to a deleted user
            console.log("Token does'nt belong to any user");
            
            return next(new AppError('The user belonging to this token no longer exists.', 401));
        }
        console.log("Current user is:",currentUser);
        
        req.user = currentUser;
        next();
    } catch (error) {
        console.log("Error in authMiddleware:", error);
        
        next(new AppError('Invalid token. Please log in again!', 401));
    }
};

export default protect; 