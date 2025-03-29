import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: { 
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        default: "",
    },
    status: {
        type: String,
        enum: ['online', 'offline', 'away'],
        default: 'offline'
    },
    lastSeen: {
        type: Date,
        default: Date.now
    },
    bio: {
        type: String,
        maxLength: 500,
        default: ""
    },
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    friendRequests: [{
        from: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        status: {
            type: String,
            enum: ['pending', 'accepted', 'rejected'],
            default: 'pending'
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    blockedUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    settings: {
        notifications: {
            type: Boolean,
            default: true
        },
        darkMode: {
            type: Boolean,
            default: false
        },
        language: {
            type: String,
            default: 'en'
        }
    }
},
{
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for unread messages count
userSchema.virtual('unreadMessagesCount', {
    ref: 'Message',
    localField: '_id',
    foreignField: 'recipient',
    count: true
});

// Index for faster queries
userSchema.index({ username: 1 });
userSchema.index({ status: 1 });

// Method to check if user is friends with another user
userSchema.methods.isFriendsWith = function(userId) {
    return this.friends.includes(userId);
};

// Method to check if user has blocked another user
userSchema.methods.hasBlocked = function(userId) {
    return this.blockedUsers.includes(userId);
};

// Method to check if there's a pending friend request
userSchema.methods.hasPendingFriendRequest = function(userId) {
    return this.friendRequests.some(request => 
        request.from.toString() === userId.toString() && 
        request.status === 'pending'
    );
};

const User = mongoose.model("User", userSchema);

export default User;

