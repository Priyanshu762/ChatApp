import mongoose from "mongoose";

const friendshipSchema = new mongoose.Schema({
    user1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    user2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

friendshipSchema.index({ user1: 1, user2: 1 }, { unique: true });

friendshipSchema.pre('save', function(next) {
    if (this.user1.toString() > this.user2.toString()) {
        [this.user1, this.user2] = [this.user2, this.user1];
    }
    next();
});

const Friendship = mongoose.model('Friendship', friendshipSchema);

export default Friendship; 