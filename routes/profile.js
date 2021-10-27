const express = require('express');
const router = express.Router();


const Posts = require('../models/posts');
const Users = require('../models/users');
const {isLoggedIn} = require('../mw');


// view self profile
router.get('/profile', isLoggedIn, (req, res) => {

    let payload = {
        user: req.user,
        displayName: req.user.firstName + " " + req.user.lastName
    };

    res.render('profile', { payload } );
})

// view someone else's profile
router.get('/profile/:username', isLoggedIn, async (req, res) => {

    // we have unique usernames
    let user = await Users.findOne({ username: req.params.username });

    const payload = {
        user: user,
        displayName: user.firstName + " " + user.lastName
    }

    res.render('profile', { payload });
})


module.exports = router;