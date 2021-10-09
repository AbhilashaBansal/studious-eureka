const express = require('express');
const router = express.Router();

const Users = require('../models/users');
const passport = require('passport');


// Sign Up
router.get('/signup', (req, res)=>{
    res.render('signup', {message: req.flash('error')});
})

router.post('/signup', async(req, res)=>{
    try {
        let user = {
            firstName: req.body.firstname,
            lastName: req.body.lastname,
            email: req.body.email,
            username: req.body.username
        }
    
        let new_user = await Users.register(user, req.body.password);
    
        res.status(200).send(new_user);
    }
    catch (error) {
        req.flash('error', error.message);
        res.redirect('/signup');
    } 

})


// Login
router.get('/login', (req, res) => {
    res.render('login');
})

router.post('/login', passport.authenticate('local',
    {
        failureRedirect: '/login',
    }), 
    (req, res) => {
        res.redirect('/');
    }
);    


// Logout
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
})


module.exports = router;