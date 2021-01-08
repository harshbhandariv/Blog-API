const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    name: String,
    username: String,
    email: String,
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    followingCount: {
        type: Number,
        min: 0,
        default: 0
    },
    followerCount: {
        type: Number,
        min: 0,
        default: 0
    },
    postCount: {
        type: Number,
        min: 0,
        default: 0
    },
    profilePhoto: String,
    githubId: String,
    facebookId: String
});

const User = new mongoose.model('User', userSchema);

module.exports = User;