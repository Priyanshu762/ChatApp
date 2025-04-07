import AppError from '../utils/appError.js';
import User from '../models/userModel.js';
import FriendRequest from '../models/friendRequestModel.js';
import Friendship from '../models/friendshipModel.js';

export const sendFriendRequest = async (req, res, next) => {
    try {
        const recipient = await User.findById(req.params.userId);

        if (!recipient) {
            return next(new AppError('User not found. Please check the user ID and try again.', 404, res));

        }
        if (recipient._id.toString() === req.user._id.toString()) {
            return next(new AppError('You cannot send a friend request to yourself.', 400, res));
        }

        const existingFriendship = await Friendship.findOne({
            $or: [
                { user1: req.user._id, user2: recipient._id },
                { user1: recipient._id, user2: req.user._id }
            ]
        });

        if (existingFriendship) {
            return next(new AppError('You are already friends with this user.', 400));
        }

        const existingRequest = await FriendRequest.findOne({
            $or: [
                { sender: req.user._id, recipient: recipient._id },
                { sender: recipient._id, recipient: req.user._id }
            ]
        });

        if (existingRequest) {
            console.log("A friend request already exsit");
            
            return next(new AppError('A friend request already exists between you and this user.', 400));
        }

        const friendRequest = await FriendRequest.create({
            sender: req.user._id,
            recipient: recipient._id
        });

        await friendRequest.populate('sender', 'fullName username profilePicture');
        await friendRequest.populate('recipient', 'fullName username profilePicture');

        res.status(201).json({
            status: 'success',
            data: {
                friendRequest,
                message: 'Friend request sent successfully'
            }
        });
    } catch (error) {
        next(error);
    }
};

// Accept friend request
export const acceptFriendRequest = async (req, res, next) => {
    try {
        const friendRequest = await FriendRequest.findOne({
            _id: req.params.requestId,
            recipient: req.user._id,
            status: 'pending'
        });

        if (!friendRequest) {
            return next(new AppError('Friend request not found. It might have been deleted or already processed.', 404, res));
        }
        const friendship = await Friendship.create({
            user1: friendRequest.sender,
            user2: friendRequest.recipient
        });

        friendRequest.status = 'accepted';
        await friendRequest.save();

        await friendship.populate('user1', 'fullName username profilePicture');
        await friendship.populate('user2', 'fullName username profilePicture');

        res.status(200).json({
            status: 'success',
            data: {
                friendship,
                message: 'Friend request accepted successfully'
            }
        });
    } catch (error) {
        return next(new AppError('Error in acceptFriendRequest', 500, error, res));
    }
};

export const rejectFriendRequest = async (req, res, next) => {
    try {
        const friendRequest = await FriendRequest.findOne({
            _id: req.params.requestId,
            recipient: req.user._id,
            status: 'pending'
        });

        if (!friendRequest) {
            return next(new AppError('Friend request not found. It might have been deleted or already processed.', 404));
        }

        friendRequest.status = 'rejected';
        await friendRequest.save();

        res.status(200).json({
            status: 'success',
            data: {
                message: 'Friend request rejected successfully'
            }
        });
    } catch (error) {
        next(error);
    }
};

export const getFriendRequests = async (req, res, next) => {
    try {
        const friendRequests = await FriendRequest.find({
            recipient: req.user._id,
            status: 'pending'
        }).populate('sender', 'fullName username profilePicture');

        res.status(200).json({
            status: 'success',
            data: {
                friendRequests,
                count: friendRequests.length
            }
        });
    } catch (error) {
        next(error);
    }
};

export const getFriends = async (req, res, next) => {
    try {
        const friendships = await Friendship.find({
            $or: [
                { user1: req.user._id },
                { user2: req.user._id }
            ]
        }).populate('user1 user2', 'fullName username profilePicture');

        const friends = friendships.map(friendship =>
            friendship.user1._id.toString() === req.user._id.toString()
                ? friendship.user2
                : friendship.user1
        );

        res.status(200).json({
            status: 'success',
            data: {
                friends,
                count: friends.length
            }
        });
    } catch (error) {
        next(error);
    }
};
// export const searchFriend = async(req ,res,next)=>{
// console.log("Started finding");
// try {   
//     const user=req.params.user;        
//     const currentUserId = req.user._id;
//     console.log("Searching for user:", user);
//     const users = await User.find({
//         $or: [
//             { username: { $regex: user, $options: 'i' } },
//             { fullName: { $regex: user, $options: 'i' } }
//         ],
//         _id: { $ne: currentUserId }
//     })
//     .select('username fullName profilePicture status lastSeen')
//     .limit(10);
//     console.log("Found users:", users);

//     res.status(200).json({
//         status: 'success',
//         data: users
//     });

// } catch (error) {
//     next(error);
// }

// }
export const searchFriend = async (req, res, next) => {
    try {
        const searchQuery = req.params.user;
        const currentUserId = req.user._id;

        // Step 1: Search users (except self)
        const matchedUsers = await User.find({
            $or: [
                { username: { $regex: searchQuery, $options: 'i' } },
                { fullName: { $regex: searchQuery, $options: 'i' } }
            ],
            _id: { $ne: currentUserId }
        })
        .select('username fullName profilePicture status lastSeen _id')
        .limit(20);

        // Step 2: Fetch friendships where current user is involved
        const friendships = await Friendship.find({
            $or: [
                { user1: currentUserId },
                { user2: currentUserId }
            ]
        });

        const friendIds = friendships.map(f => {
            return f.user1.toString() === currentUserId.toString()
                ? f.user2.toString()
                : f.user1.toString();
        });

        // Step 3: Get all friend requests involving current user (sent or received)
        const friendRequests = await FriendRequest.find({
            $or: [
                { sender: currentUserId },
                { recipient: currentUserId }
            ]
        }).select('sender recipient');

        // Collect all IDs involved in pending requests
        const requestInvolvedIds = friendRequests.map(fr => {
            // exclude only if request is still 'pending'
            return fr.sender.toString() === currentUserId.toString()
                ? fr.recipient.toString()
                : fr.sender.toString();
        });

        // Step 4: Final filtering
        const filteredUsers = matchedUsers.filter(user => {
            const id = user._id.toString();
            return (
                !friendIds.includes(id) &&       // not already friend
                !requestInvolvedIds.includes(id) // no pending requests either way
            );
        });

        res.status(200).json({
            status: 'success',
            data: filteredUsers
        });

    } catch (error) {
        console.error("❌ searchFriend error:", error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to search for friends'
        });
    }
};
export default {
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    getFriendRequests,
    getFriends
};
