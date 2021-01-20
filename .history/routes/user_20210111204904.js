const express = require('express');
const router = express.Router();

const Campground = require('../models/campgrounds');
const Review = require('../models/review');
const User = require('../models/user');

const catchAsync = require('../utils/catchAsync');
const expressError = require('../utils/expressError');

router.get('/', (req, res) => {
    res.render('../views/users/register');
})

module.exports = router;