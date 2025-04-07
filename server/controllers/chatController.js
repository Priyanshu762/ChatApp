
import AppError from '../utils/appError.js';
import User from '../models/userModel.js';
import Friendship from '../models/friendshipModel.js';
import ChatMessage from '../models/chatMessageModel.js';

export const sendMessage = async (req, res, next) => {
    const { recipientId, content, messageType, mediaUrl } = req.body;

    const recipient = await User.findById(recipientId);
    if (!recipient) {
        return next(new AppError('Recipient not found', 404));
    }
    const friendship = await Friendship.findOne({
        $or: [
            { user1: req.user._id, user2: recipientId },
            { user1: recipientId, user2: req.user._id }
        ]
    });

    if (!friendship) {
        return next(new AppError('Can only send messages to friends', 403));
    }

    const message = await ChatMessage.create({
        sender: req.user._id,
        recipient: recipientId,
        content,
        messageType,
        mediaUrl
    });

        await message.populate('sender', 'name email');

    res.status(201).json({
        status: 'success',
        data: {
            message
        }
    });
};

export const getChatHistory = async (req, res, next) => {
    try {
        const { friendId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const skip = (page - 1) * limit;

        const friendship = await Friendship.findOne({
            $or: [
                { user1: req.user._id, user2: friendId },
                { user1: friendId, user2: req.user._id }
            ]
        });

        if (!friendship) {
            return next(new AppError('Can only view chat history with friends', 403));
        }

        const messages = await ChatMessage.find({
            $or: [
                { sender: req.user._id, recipient: friendId },
                { sender: friendId, recipient: req.user._id }
            ]
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('sender recipient', 'name email');

        // Mark as read
        await ChatMessage.updateMany(
            {
                recipient: req.user._id,
                sender: friendId,
                isRead: false
            },
            { isRead: true }
        );

        // Always return messages, even if empty
        res.status(200).json({
            status: 'success',
            data: {
                messages: messages.reverse() // newest to oldest -> oldest to newest
            }
        });
    } catch (error) {
        next(error);
    }
};


export const getUnreadCount = async (req, res, next) => {
    const unreadCount = await ChatMessage.countDocuments({
        recipient: req.user._id,
        isRead: false
    });

    res.status(200).json({
        status: 'success',
        data: {
            unreadCount
        }
    });
};

export const getRecentChats = async (req, res, next) => {
    const friendships = await Friendship.find({
        $or: [
            { user1: req.user._id },
            { user2: req.user._id }
        ]
    }).populate('user1 user2', 'name email');

    const recentChats = await Promise.all(
        friendships.map(async (friendship) => {
            const friend = friendship.user1._id.toString() === req.user._id.toString()
                ? friendship.user2
                : friendship.user1;

            const lastMessage = await ChatMessage.findOne({
                $or: [
                    { sender: req.user._id, recipient: friend._id },
                    { sender: friend._id, recipient: req.user._id }
                ]
            })
            .sort({ createdAt: -1 })
            .populate('sender recipient', 'name email');

            return {
                friend,
                lastMessage,
                unreadCount: await ChatMessage.countDocuments({
                    sender: friend._id,
                    recipient: req.user._id,
                    isRead: false
                })
            };
        })
    );

    res.status(200).json({
        status: 'success',
        data: {
            recentChats
        }
    });
}; 

export default {
    sendMessage,
    getChatHistory,
    getUnreadCount,
    getRecentChats
};

