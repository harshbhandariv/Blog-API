// require('dotenv').config();
// const mongoose = require('mongoose');
// mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
//     console.log("Connected to mongodb");
// }).catch((err) => {
//     console.log("Error connecting to MongoDB", err);
// });
const { Post, Comment } = require('../model/post');
const User = require('../model/user');
const { searchUser } = require('./userController');
async function getPosts(pageNumber) {
    try {
        const result = await Post
            .find()
            .limit(parseInt(process.env.LIMITS))
            .skip((pageNumber - 1) * process.env.LIMITS)
            .select("-likeBy -comment")
            .populate({
                path: "postedBy",
                select: "name username profilePhoto"
            })
            .exec();
        return result;
    } catch (err) {
        return err;
    }
}

async function getUserPosts(username, pageNumber) {
    try {
        const result = await User
            .findOne({ username })
            .select("posts")
            .populate({
                path: "posts",
                limit: process.env.LIMITS,
                skip: ((pageNumber - 1) * process.env.LIMITS),
                select: "-comment -likedBy"
            })
            .exec();
        return result;
    } catch (error) {
        return error;
    }
}

// async function createPosts(id, i) {
//     const post = await Post({
//         content: i,
//         color: "red",
//         bgcolor: "green",
//         postedBy: id
//     }).save();
//     const user = await User.findById(id).exec();
//     user.posts.push(post._id);
//     await user.save();
// }

// for (let i = 1; i <= 50; i++) {
//     createPosts("5ff311682b762f11b068a99d", i);
//     if (i == 50) {
//         console.log("50 posts created");
//     }
// }
async function searchPost(postId) {
    try {
        const result = await Post.findById(postId).exec();
        return result;
    } catch (error) {
        return error;
    }
}

async function likePost(postId, username) {
    try {
        const result = await searchPost(postId);
        const user = await searchUser(username);
        if (result.likedBy.includes(user._id)) return ({ message: "Already Liked" });
        result.likedBy.push(user._id);
        result.likeCount++;
        await result.save();
        return ({ message: "Post liked" });
    } catch (error) {
        return error;
    }
}

async function unlikePost(postId, username) {
    try {
        const result = await searchPost(postId);
        const user = await searchUser(username);
        var index = result.likedBy.indexOf(user._id);
        if (index > -1) {
            result.likedBy.splice(index, 1);
            result.likeCount--;
        }
        await result.save();
        return ({ message: "Post unliked" });
    } catch (error) {
        return error;
    }
}

async function isLiked(postId, username) {
    try {
        const result = await searchPost(postId);
        const user = await searchUser(username);
        if (result.likedBy.includes(user._id)) return ({ message: "Already Liked" });
        return ({ message: "Post not liked" });
    } catch (error) {
        return error;
    }
}

async function createComment(postId, username, body) {
    try {
        const user = await searchUser(username);
        const comment1 = await new Comment({
            body: body.content,
            by: user._id
        });
        const result1 = await comment1.save();
        const result = await searchPost(postId);
        result.comment.push(result1._id);
        result.commentCount++;
        const result2 = await result.save();
        return result2;
    } catch (error) {
        return error;
    }
}

async function getLikes(postId, pageNumber) {
    try {
        const result = await Post.findById(postId)
            .select("likedBy")
            .populate({
                path: "likedBy",
                limit: process.env.LIMITS,
                skip: ((pageNumber - 1) * process.env.LIMITS),
                select: "-email -posts -followers -following"
            })
            .exec();
        return result;
    } catch (error) {
        return error;
    }
}

async function getComments(postId, pageNumber) {
    try {
        const result = await Post.findById(postId)
            .select("comment")
            .populate({
                path: "comment",
                limit: process.env.LIMITS,
                skip: ((pageNumber - 1) * process.env.LIMITS),
                populate: {
                    path: "by",
                    select: "-email -posts -followers -following"
                }
            })
            .exec();
        return result;
    } catch (error) {
        return error;
    }
}

async function createPost(username, body) {
    try {
        const user = await User.findOne({ username }).exec();
        console.log(user.username);
        const post = await Post({
            content: body.content,
            color: body.color,
            bgcolor: body.bgcolor,
            postedBy: user._id
        }).save();
        console.log(post._id);
        user.posts.push(post._id);
        user.postCount++;
        await user.save();
        return post;
    } catch (error) {
        return error;
    }
}


module.exports = {
    getPosts
    , getUserPosts
    , searchPost
    , likePost
    , unlikePost
    , isLiked
    , createComment
    , getLikes
    , getComments
    , createPost
};