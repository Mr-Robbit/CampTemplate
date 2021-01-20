const express = require('express');
const router = express.Router();

const users = require('../controllers/users');
const catchAsync = require('../utils/catchAsync');
const expressError = require('../utils/expressError');

router.route('/register')
    .get(users.registerForm)
    .post(catchAsync(users.registerUser))

router.route('/login')
    .get(users.loginForm)
    .post(users.loginUser)
    .get(users.logoutUser)





module.exports = router;