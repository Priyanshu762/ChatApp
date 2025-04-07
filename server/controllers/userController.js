import User from '../models/userModel.js';

export const updateProfile = async (req, res, next) => {
    try {
        const { fullName, bio, profilePicture } = req.body;
        const userId = req.user._id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        // Update fields if provided
        if (fullName) user.fullName = fullName;
        if (bio) user.bio = bio;
        if (profilePicture) user.profilePicture = profilePicture;

        await user.save();

        res.status(200).json({
            status: 'success',
            data: user
        });

    } catch (error) {
        next(error);
    }
};

export const updateSettings = async (req, res, next) => {
    try {
        const { notifications, darkMode, language } = req.body;
        const userId = req.user._id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        // Update settings if provided
        if (notifications !== undefined) user.settings.notifications = notifications;
        if (darkMode !== undefined) user.settings.darkMode = darkMode;
        if (language) user.settings.language = language;

        await user.save();

        res.status(200).json({
            status: 'success',
            data: user.settings
        });

    } catch (error) {
        next(error);
    }
};

export const sendFriendRequest = async (req, res, next) => {
    try {
        const { recipientId } = req.body;
        const senderId = req.user._id;

        // Check if recipient exists
        const recipient = await User.findById(recipientId);
        if (!recipient) {
            return res.status(404).json({
                status: 'error',
                message: 'Recipient not found'
            });
        }

        // Check if already friends
        if (recipient.friends.includes(senderId)) {
            return res.status(400).json({
                status: 'error',
                message: 'Already friends with this user'
            });
        }

        // Check if request already exists
        const existingRequest = recipient.friendRequests.find(
            request => request.from.toString() === senderId.toString() && request.status === 'pending'
        );
        if (existingRequest) {
            return res.status(400).json({
                status: 'error',
                message: 'Friend request already sent'
            });
        }

        // Add friend request
        recipient.friendRequests.push({
            from: senderId,
            status: 'pending'
        });

        await recipient.save();

        res.status(200).json({
            status: 'success',
            message: 'Friend request sent successfully'
        });

    } catch (error) {
        next(error);
    }
};

export const respondToFriendRequest = async (req, res, next) => {
    try {
        const { requestId, accepted } = req.body;
        const userId = req.user._id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        const request = user.friendRequests.id(requestId);
        if (!request) {
            return res.status(404).json({
                status: 'error',
                message: 'Friend request not found'
            });
        }

        if (request.status !== 'pending') {
            return res.status(400).json({
                status: 'error',
                message: 'Friend request already processed'
            });
        }

        request.status = accepted ? 'accepted' : 'rejected';

        if (accepted) {
            // Add to friends list for both users
            user.friends.push(request.from);
            const sender = await User.findById(request.from);
            sender.friends.push(userId);
            await sender.save();
        }

        await user.save();

        res.status(200).json({
            status: 'success',
            message: `Friend request ${accepted ? 'accepted' : 'rejected'} successfully`
        });

    } catch (error) {
        next(error);
    }
};

export const blockUser = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.user._id;

        const user = await User.findById(currentUserId);
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        // Check if user exists
        const userToBlock = await User.findById(userId);
        if (!userToBlock) {
            return res.status(404).json({
                status: 'error',
                message: 'User to block not found'
            });
        }

        // Add to blocked users if not already blocked
        if (!user.blockedUsers.includes(userId)) {
            user.blockedUsers.push(userId);
            await user.save();
        }

        res.status(200).json({
            status: 'success',
            message: 'User blocked successfully'
        });

    } catch (error) {
        next(error);
    }
};

export const unblockUser = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.user._id;

        const user = await User.findById(currentUserId);
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        // Remove from blocked users
        user.blockedUsers = user.blockedUsers.filter(id => id.toString() !== userId);
        await user.save();

        res.status(200).json({
            status: 'success',
            message: 'User unblocked successfully'
        });

    } catch (error) {
        next(error);
    }
};

