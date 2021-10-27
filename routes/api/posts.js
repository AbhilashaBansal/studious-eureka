const express = require('express');
const router = express.Router();

// acquiring data collections
const Posts = require('../../models/posts');
const Users = require('../../models/users');

const {isLoggedIn} = require('../../mw');


// Get all the posts
router.get('/api/posts', isLoggedIn, async(req, res) => {

    let posts = await Posts.find({}).populate('postedBy').populate('replyingTo');
    res.json(posts);
})


// Get a specific post (or tweet)
router.get('/api/posts/:id', async (req, res) => {
    let post = await Posts.findById(req.params.id).populate('postedBy');
    // let post = await Post.findById(req.params.id).populate('postedBy').populate('replyingTo');

    res.status(200).json(post);
})


// Add new post
router.post('/api/post', isLoggedIn, async (req, res) => {

    let post = {
        content: req.body.content,
        postedBy: req.user     //note
    }

    if (req.body.replyingTo) {
        post = {
            ...post,
            replyingTo: req.body.replyingTo
        }
    }

    let newPost = await Posts.create(post);
    res.json(newPost);
})


// when a user likes/ un-likes a post
router.patch('/api/posts/:id/like', isLoggedIn, async(req,res) => {

    let postId = req.params.id;
    let userId = req.user._id; // automatically by MongoDB
    
    let isLiked = (req.user.likes) && (req.user.likes.includes(postId));
    
    let option = isLiked ? '$pull':'$addToSet';

    // [option] -> replaces value of variable option in the place
    req.user = await Users.findByIdAndUpdate(userId, {[option] : {likes:postId}}, {new:true});

    let post = await Posts.findByIdAndUpdate(postId, {[option] : {likes:userId}}, {new:true});

    res.status(200).json(post);
})


module.exports = router;