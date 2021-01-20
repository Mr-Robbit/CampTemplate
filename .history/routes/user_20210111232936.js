const express = require('express');
const router = express.Router();
const passport = require('passport');

const Campground = require('../models/campgrounds');
const Review = require('../models/review');
const User = require('../models/user');

const catchAsync = require('../utils/catchAsync');
const expressError = require('../utils/expressError');

router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register', catchAsync(async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', `Welcome to Yelp Camp ${registeredUser.username}!`);
            res.redirect('/campgrounds');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');

    }
}));

router.get('/login', (req, res) => {
    res.render('users/login');
});

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', `Welcome back ${req.user}`);
    res.redirect('/campgrounds');
});

router.get('/logout', (req, res) => {
    req.logOut();
    req.flash('success', 'Goodbye!');
    res.redirect('/campgrounds');
});



module.exports = router;