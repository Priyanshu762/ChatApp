import mongoose from "mongoose";

const friendRequestSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

friendRequestSchema.index({ sender: 1, recipient: 1 }, { unique: true });

friendRequestSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const FriendRequest = mongoose.model('FriendRequest', friendRequestSchema);

export default FriendRequest; 