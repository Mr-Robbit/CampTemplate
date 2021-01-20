const express = require('express');
const router = express.Router();

const Campground = require('../models/campgrounds');
const Review = require('../models/review');
const User = require('../models/user');

const catchAsync = require('../utils/catchAsync');
const expressError = require('../utils/expressError');

router.get('/register', (req, res) => {
    res.render('../views/users/register');
});

router.post('/register', catchAsync(async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.flash('success', 'Welcome to Yelp Camp!');
        res.redirect('/campgrounds');
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}));

router.get('/login', (req, res) => {
    res.render('../views/users/login');
});

router.post('/login', catchAsync(async (req, res) => {

}));



module.exports = router;