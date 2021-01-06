const mongoose = require('mongoose');


const postSchema = new mongoose.Schema({
    content: String,
    color: String,
    bgcolor: String,
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    time: {
        type: Date,
        default: Date.now
    },
    likeCount: {
        type: Number,
        default: 0,
        min: 0
    },
    likedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    commentCount: {
        type: Number,
        default: 0,
        min: 0
    },
    comment: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }]
});


const commentSchema = new mongoose.Schema(
    {
        body: String,
        by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        time: {
            type: Date,
            default: Date.now
        }
    });
const Post = new mongoose.model('Post', postSchema);
const Comment = new mongoose.model('Comment', commentSchema);

module.exports = { Post, Comment };