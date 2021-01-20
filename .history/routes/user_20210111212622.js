const express = require('express');
const router = express.Router();

const Campground = require('../models/campgrounds');
const Review = require('../models/review');
const User = require('../models/user');

const catchAsync = require('../utils/catchAsync');
const expressError = require('../utils/expressError');

router.get('/register', (req, res) => {
    res.render('../views/users/register');
})

router.post('/register', catchAsync(async (req, res) => {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    await User.register(user, password);
}))

module.exports = router;