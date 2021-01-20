const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

const Campground = require('../models/campgrounds');
const Review = require('../models/review');

const users = require('../controllers/users');
const catchAsync = require('../utils/catchAsync');
const expressError = require('../utils/expressError');

router.get('/register', users.registerForm);

router.post('/register', catchAsync(users.registerUser));

router.get('/login', (req, res) => {
    res.render('users/login');
});

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', `Welcome back ${req.user.username}!`);
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
});

router.get('/logout', (req, res) => {
    req.logOut();
    req.flash('success', 'Goodbye!');
    res.redirect('/campgrounds');
});



module.exports = router;