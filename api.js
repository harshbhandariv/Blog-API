// This middle ware is the one stop point to access other routes
const express = require('express');
const route = express.Router();
const auth = require('./routes/auth');
const { searchUser, getFollowing, getFollowers, addFollower, unfollow, removeFollower } = require('./controller/userController');
const { getPosts,
    getUserPosts,
    searchPost,
    likePost,
    unlikePost,
    isLiked,
    createComment,
    getLikes,
    getComments,
    createPost
} = require('./controller/postController');
const { Remarkable } = require('remarkable');
// @ GET /api/
// Response Documentation of API
route.get('/', (req, res) => {
    let md = new Remarkable();
    let readme = require('fs').readFileSync('README.MD', 'utf-8');
    res.send(md.render(readme));
})

// Auth middleware
route.use('/auth', auth);

// GET @ /api/posts/
// Response Status 400 Bad Request
route.get('/posts', (req, res) => {
    res.status(400).send({ message: 'PageNumber required' });
});

// GET @ /api/post/:postId/likes
// Response Status 400 Bad Request
route.get('/post/:postId/likes', async (req, res) => {
    res.status(400).send({ message: 'PageNumber required' });
});

// GET @ /api/post/:postId/commemts
// Response Status 400 Bad Request
route.get('/post/:postId/comments', async (req, res) => {
    res.status(400).send({ message: 'PageNumber required' });
});

// GET @ /api/:user/posts
// Response Status 400 Bad Request
route.get('/:user/posts', async (req, res) => {
    res.status(400).send({ message: 'PageNumber required' });
});

// GET @ /api/whomai
// If authenticated return user else message regarding not logged in
route.get('/whoami', (req, res) => {
    if (req.user) {
        return res.send(req.user);
    } else {
        res.status(200).send({ message: 'User not Logged In' });
    }
});

//Needs checking
route.post('/post', async (req, res) => {
    if (!req.user) return res.send(401).send({ message: 'User not Logged In' });
    if (req.body.content === '') {
        return res.status(400).send({
            error: "No content"
        });
    }
    const result = await createPost(req.user.username, req.body);
    res.send(result);
});

// GET @ /api/post/:postId
// Send post with the requested ID
route.get('/post/:postId', async (req, res) => {
    const postId = req.params.postId;
    const result = await searchPost(postId);
    if (result.message == 'Post Search Successful') {
        res.status(200).send(result);
    } else {
        res.status(400).send(result);
    }
});

// GET @ /api/post/:postId/likes/:pageNumber
// Sends users who likes the post
route.get('/post/:postId/likes/:pageNumber', async (req, res) => {
    const postId = req.params.postId;
    const pageNumber = parseInt(req.params.pageNumber);
    if (isNaN(pageNumber)) return res.status(400).send({ message: "pageNumber must be an Integer" });
    const result = await searchPost(postId);
    console.log(result);
    if (result.message == 'Post Search Successful') {
        const result1 = await getLikes(postId, pageNumber);
        res.status(200).send(result1);
    } else {
        res.status(400).send(result);
    }
});

// GET @ /api/post/:postId/comments/:pageNumber
// Sends users who commented on the post
route.get('/post/:postId/comments/:pageNumber', async (req, res) => {
    const postId = req.params.postId;
    const pageNumber = parseInt(req.params.pageNumber);
    if (isNaN(pageNumber)) return res.send({ message: "pageNumber must be an Integer" });
    const result = await searchPost(postId);
    if (result.message == 'Post Search Successful') {
        const result1 = await getComments(postId, pageNumber);
        res.status(200).send(result1);
    } else {
        res.status(400).send(result);
    }
});

// GET @ /api/post/:postId/like
// Likes the post
route.get('/post/:postId/like', async (req, res) => {
    if (!req.user) return res.status(401).send({ message: 'User not Logged In' });
    const postId = req.params.postId;
    const result = await searchPost(postId);
    if (result.message == 'Post Search Successful') {
        const result1 = await likePost(postId, req.user.username);
        res.status(200).send(result1);
    } else {
        res.status(400).send(result);
    }
});

// GET @ /api/post/:postId/unlike
// unlikes the post
route.get('/post/:postId/unlike', async (req, res) => {
    if (!req.user) return res.status(401).send({ message: 'User not Logged In' });
    const postId = req.params.postId;
    const result = await searchPost(postId);
    if (result.message == 'Post Search Successful') {
        const result1 = await unlikePost(postId, req.user.username);
        res.status(200).send(result1);
    } else {
        res.status(400).send(result);
    }
});

// GET @ /api/post/:postId/isLiked
// checks whether the user liked the post
route.get('/post/:postId/isliked', async (req, res) => {
    if (!req.user) return res.status(200).send({ message: 'User not Logged In' });
    const postId = req.params.postId;
    const result = await searchPost(postId);
    if (result.message == 'Post Search Successful') {
        const result1 = await isLiked(postId, req.user.username);
        res.status(200).send(result1);
    } else {
        res.status(400).send(result);
    }
});

//Needs to be checked
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

// GET @ /api/post/:postId/isLiked
// responds with posts
route.get('/posts/:pageNumber', async (req, res) => {
    const pageNumber = parseInt(req.params.pageNumber);
    if (isNaN(pageNumber)) return res.status(400).send({ message: "pageNumber must be an Integer" });
    const posts = await getPosts(pageNumber);
    if (!posts.error)
        res.status(200).send(posts);
    else
        res.status(500).send(posts);
});

// GET @ /api/post/:postId/isLiked
// responds with user information
route.get('/:user', async (req, res) => {
    const username = req.params.user;
    const result = await searchUser(username);
    if (result)
        return res.status(200).send(result);
    res.status(200).send({ message: 'No user found' })
});

route.get('/:user/posts/:pageNumber', async (req, res) => {
    const username = req.params.user;
    const pageNumber = parseInt(req.params.pageNumber);
    if (isNaN(pageNumber)) return res.status(400).send({ message: "pageNumber must be an Integer" });
    const result = await searchUser(username);
    if (result) {
        const result1 = await getUserPosts(username, pageNumber);
        res.send(result1.posts);
    }
    else {
        res.send({
            message: false
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
    if (!req.user) return res.status(401).send({ message: 'User not Logged In' });
    const user1 = req.params.user1;
    const user2 = req.params.user2;
    if (user1 != req.user.username) {
        return res.status(403).send({ message: "You are not authorized" });
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
    if (!req.user) return res.status(401).send({ message: 'User not Logged In' });
    const user1 = req.params.user1;
    const user2 = req.params.user2;
    if (user1 != req.user.username) {
        return res.status(403).send({ message: "You are not authorized" });
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
    if (!req.user) return res.status(401).send({ message: 'User not Logged In' });
    const user1 = req.params.user1;
    const user2 = req.params.user2;
    if (user1 != req.user.username) {
        return res.status(403).send({ message: "You are not authorized" });
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