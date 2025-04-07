

import AppError from './utils/appError.js';
import globalErrorHandler from './controllers/errorController.js';

import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize'; 
import xss from 'xss-clean';
import hpp from 'hpp';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes.js';
import friendRoutes from './routes/friendRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import testRoutes from './routes/testRoutes.js';

const app = express();

// Cookie parser middleware (should be before routes)
app.use(cookieParser());

// CORS configuration
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Security Middleware
app.use(helmet());
app.use(express.json({ limit: '10kb' }));
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

// Rate limiting
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!'
});
// app.use('/api', limiter);

// Development logging
// if (process.env.NODE_ENV === 'development') {
//     app.use(morgan('dev'));
// }

// Compression middleware
app.use(compression());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/friends', friendRoutes);
app.use('/api/chat', chatRoutes);
app.use('/test', testRoutes); // Test route for Socket.IO

// Handle undefined routes
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handling middleware
app.use(globalErrorHandler);

export default app;