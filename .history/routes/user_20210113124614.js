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

router.get('/login', users.loginForm);

router.post('/login', users.loginUser);

router.get('/logout', users.deleteUser);



module.exports = router;