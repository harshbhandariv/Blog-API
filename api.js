// This middle ware is the one stop point to access other routes
const express = require('express');
const route = express.Router();
const auth = require('./routes/auth');
const { searchUser, getFollowing, getFollowers, addFollower, unfollow, removeFollower } = require('./controller/userController');
const { getPosts, getUserPosts, searchPost, likePost, unlikePost, isLiked, createComment, getLikes, getComments, createPost } = require('./controller/postController');
const { Remarkable } = require('remarkable');
route.get('/', (req, res) => {
    let md = new Remarkable();
    let readme = require('fs').readFileSync('README.MD', 'utf-8');
    res.send(md.render(readme));
})
route.use('/auth', auth);

route.get('/posts', (req, res) => {
    res.send({ message: "Add /:pageNumber" });
});

route.post('/post', async (req, res) => {
    if (!req.user) return res.send({ message: "User not logged in" });
    const result = await createPost(req.user.username, req.body);
    res.send(result);
})

route.get('/post/:postId', async (req, res) => {
    const postId = req.params.postId;
    const searchpost = await searchPost(postId);
    if (searchpost) {
        res.send(searchpost);
    } else {
        res.send({ message: "No post exists for the given postId" });
    }
});

route.get('/post/:postId/likes/:pageNumber', async (req, res) => {
    const postId = req.params.postId;
    const pageNumber = parseInt(req.params.pageNumber);
    if (isNaN(pageNumber)) return res.send({ message: "pageNumber must be an Integer" });
    const searchpost = await searchPost(postId);
    if (searchpost) {
        const result = await getLikes(postId, pageNumber);
        res.send(result);
    } else {
        res.send({ message: "No post exists for the given postId" });
    }
});

route.get('/post/:postId/comments/:pageNumber', async (req, res) => {
    const postId = req.params.postId;
    const pageNumber = parseInt(req.params.pageNumber);
    if (isNaN(pageNumber)) return res.send({ message: "pageNumber must be an Integer" });
    const searchpost = await searchPost(postId);
    if (searchpost) {
        const result = await getComments(postId, pageNumber);
        res.send(result);
    } else {
        res.send({ message: "No post exists for the given postId" });
    }
});

route.get('/post/:postId/like', async (req, res) => {
    if (!req.user) return res.send({ message: "No user logged in" });
    const postId = req.params.postId;
    const searchpost = await searchPost(postId);
    if (searchpost) {
        const result = await likePost(postId, req.user.username);
        res.send(result);
    } else {
        res.send({ message: "No post exists for the given postId" });
    }
});

route.get('/post/:postId/unlike', async (req, res) => {
    if (!req.user) return res.send({ message: "No user logged in" });
    const postId = req.params.postId;
    const searchpost = await searchPost(postId);
    if (searchpost) {
        const result = await unlikePost(postId, req.user.username);
        res.send(result);
    } else {
        res.send({ message: "No post exists for the given postId" });
    }
});

route.get('/post/:postId/isliked', async (req, res) => {
    if (!req.user) return res.send({ message: "No user logged in" });
    const postId = req.params.postId;
    const searchpost = await searchPost(postId);
    if (searchpost) {
        const result = await isLiked(postId, req.user.username);
        res.send(result);
    } else {
        res.send({ message: "No post exists for the given postId" });
    }
});

route.post('/post/:postId/comment', async (req, res) => {
    if (!req.user) return res.send({ message: "No user logged in" });
    const postId = req.params.postId;
    const searchpost = await searchPost(postId);
    if (searchpost) {
        const result = await createComment(postId, req.user.username, req.body);
        res.send(result);
    } else {
        res.send({ message: "No post exists for the given postId" });
    }
});

route.get('/posts/:pageNumber', async (req, res) => {
    const pageNumber = parseInt(req.params.pageNumber);
    if (isNaN(pageNumber)) return res.send({ message: "pageNumber must be an Integer" });
    const posts = await getPosts(pageNumber);
    res.send(posts);
});

route.get('/:user', async (req, res) => {
    const username = req.params.user;
    const result = await searchUser(username);
    if (result)
        return res.send(result);
    res.send({
        message: "No user found"
    })
});

route.get('/:user/posts/:pageNumber', async (req, res) => {
    const username = req.params.user;
    const pageNumber = parseInt(req.params.pageNumber);
    if (isNaN(pageNumber)) return res.send({ message: "pageNumber must be an Integer" });
    const result1 = await searchUser(username);
    if (result1) {
        const result2 = await getUserPosts(username, pageNumber);
        res.send(result2);
    }
    else {
        res.send({
            message: "No user found"
        })
    }
});

route.get('/:user/following/:pageNumber', async (req, res) => {
    const username = req.params.user;
    const pageNumber = req.params.pageNumber;
    if (isNaN(pageNumber)) return res.send({ message: "pageNumber must be an Integer" });
    const result1 = await searchUser(username);
    if (result1) {
        const result2 = await getFollowing(username, pageNumber);
        res.send(result2);
    }
    else {
        res.send({
            message: "No user found"
        })
    }
});

route.get('/:user/followers/:pageNumber', async (req, res) => {
    const username = req.params.user;
    const pageNumber = req.params.pageNumber;
    if (isNaN(pageNumber)) return res.send({ message: "pageNumber must be an Integer" });
    const result1 = await searchUser(username);
    if (result1) {
        const result2 = await getFollowers(username, pageNumber);
        res.send(result2);
    }
    else {
        res.send({
            message: "No user found"
        })
    }
});

route.get('/:user1/following/add/:user2', async (req, res) => {
    if (!req.user) {
        return res.send({ message: "You are not authorized no" });
    }
    const user1 = req.params.user1;
    const user2 = req.params.user2;
    if (user1 != req.user.username) {
        return res.send({ message: "You are not authorized" });
    }
    const result1 = await searchUser(user1);
    const result2 = await searchUser(user2);
    if (result1 && result2) {
        const result3 = await addFollower(user1, user2);
        res.send(result3);
    }
    else {
        res.send({
            message: "No users found"
        })
    }

});

route.get('/:user1/following/remove/:user2', async (req, res) => {
    if (!req.user) {
        return res.send({ message: "You are not authorized no" });
    }
    const user1 = req.params.user1;
    const user2 = req.params.user2;
    if (user1 != req.user.username) {
        return res.send({ message: "You are not authorized" });
    }
    const result1 = await searchUser(user1);
    const result2 = await searchUser(user2);
    if (result1 && result2) {
        const result3 = await unfollow(user1, user2);
        res.send(result3);
    }
    else {
        res.send({
            message: "No users found"
        })
    }
});

route.get('/:user1/follower/remove/:user2', async (req, res) => {
    if (!req.user) {
        return res.send({ message: "You are not authorized no" });
    }
    const user1 = req.params.user1;
    const user2 = req.params.user2;
    if (user1 != req.user.username) {
        return res.send({ message: "You are not authorized" });
    }
    const result1 = await searchUser(user1);
    const result2 = await searchUser(user2);
    if (result1 && result2) {
        const result3 = await removeFollower(user1, user2);
        res.send(result3);
    }
    else {
        res.send({
            message: "No users found"
        })
    }
});

module.exports = route;