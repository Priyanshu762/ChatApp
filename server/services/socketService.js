import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const setupSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: process.env.CLIENT_URL || 'http://localhost:5173',
            credentials: true
        }
    });

    // Middleware for authentication
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            if (!token) {
                return next(new Error('Authentication error'));
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.userId);
            if (!user) {
                return next(new Error('User not found'));
            }

            socket.user = user;
            next();
        } catch (error) {
            next(new Error('Authentication error'));
        }
    });

    // Store online users
    const onlineUsers = new Map();

    io.on('connection', async (socket) => {
        console.log('User connected:', socket.user._id);

        // Update user status to online
        const user = await User.findById(socket.user._id);
        user.status = 'online';
        user.lastSeen = new Date();
        await user.save();

        // Store user's socket id
        onlineUsers.set(socket.user._id.toString(), socket.id);

        // Join user's personal room
        socket.join(socket.user._id.toString());

        // Notify friends about online status
        const friends = await User.find({ _id: { $in: user.friends } });
        friends.forEach(friend => {
            const friendSocketId = onlineUsers.get(friend._id.toString());
            if (friendSocketId) {
                io.to(friendSocketId).emit('friend_status_change', {
                    userId: user._id,
                    status: 'online',
                    lastSeen: user.lastSeen
                });
            }
        });

        // Handle new message
        socket.on('send_message', async (data) => {
            try {
                const { recipientId, content, messageType, mediaUrl } = data;
                
                // Check if recipient is online
                const recipientSocketId = onlineUsers.get(recipientId);
                if (recipientSocketId) {
                    // Emit to recipient's socket
                    io.to(recipientSocketId).emit('receive_message', {
                        senderId: socket.user._id,
                        senderName: socket.user.fullName,
                        senderPicture: socket.user.profilePicture,
                        content,
                        messageType,
                        mediaUrl,
                        timestamp: new Date()
                    });
                }
            } catch (error) {
                console.error('Error sending message:', error);
            }
        });

        // Handle friend request
        socket.on('send_friend_request', async (data) => {
            try {
                const { recipientId } = data;
                const recipientSocketId = onlineUsers.get(recipientId);
                
                if (recipientSocketId) {
                    io.to(recipientSocketId).emit('receive_friend_request', {
                        senderId: socket.user._id,
                        senderName: socket.user.fullName,
                        senderPicture: socket.user.profilePicture,
                        timestamp: new Date()
                    });
                }
            } catch (error) {
                console.error('Error sending friend request:', error);
            }
        });

        // Handle friend request response
        socket.on('friend_request_response', async (data) => {
            try {
                const { recipientId, accepted } = data;
                const recipientSocketId = onlineUsers.get(recipientId);
                
                if (recipientSocketId) {
                    io.to(recipientSocketId).emit('friend_request_result', {
                        senderId: socket.user._id,
                        senderName: socket.user.fullName,
                        accepted,
                        timestamp: new Date()
                    });
                }
            } catch (error) {
                console.error('Error handling friend request response:', error);
            }
        });

        // Handle typing status
        socket.on('typing', (data) => {
            const { recipientId, isTyping } = data;
            const recipientSocketId = onlineUsers.get(recipientId);
            
            if (recipientSocketId) {
                io.to(recipientSocketId).emit('user_typing', {
                    userId: socket.user._id,
                    isTyping
                });
            }
        });

        // Handle user away status
        socket.on('set_away', async () => {
            try {
                const user = await User.findById(socket.user._id);
                user.status = 'away';
                user.lastSeen = new Date();
                await user.save();

                // Notify friends about away status
                const friends = await User.find({ _id: { $in: user.friends } });
                friends.forEach(friend => {
                    const friendSocketId = onlineUsers.get(friend._id.toString());
                    if (friendSocketId) {
                        io.to(friendSocketId).emit('friend_status_change', {
                            userId: user._id,
                            status: 'away',
                            lastSeen: user.lastSeen
                        });
                    }
                });
            } catch (error) {
                console.error('Error setting away status:', error);
            }
        });

        // Handle disconnect
        socket.on('disconnect', async () => {
            try {
                console.log('User disconnected:', socket.user._id);
                
                // Update user status to offline
                const user = await User.findById(socket.user._id);
                user.status = 'offline';
                user.lastSeen = new Date();
                await user.save();

                // Remove from online users
                onlineUsers.delete(socket.user._id.toString());

                // Notify friends about offline status
                const friends = await User.find({ _id: { $in: user.friends } });
                friends.forEach(friend => {
                    const friendSocketId = onlineUsers.get(friend._id.toString());
                    if (friendSocketId) {
                        io.to(friendSocketId).emit('friend_status_change', {
                            userId: user._id,
                            status: 'offline',
                            lastSeen: user.lastSeen
                        });
                    }
                });
            } catch (error) {
                console.error('Error handling disconnect:', error);
            }
        });
    });

    return io;
};

export default setupSocket; 