const express = require('express');
const router = express.Router();
const users = require('../controllers/users');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const { isLoggedIn } = require('../middleware/middleware');

router.route('/register')
    .get(users.registerForm)
    .post(catchAsync(users.registerUser))

router.route('/login')
    .get(users.loginForm)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.loginUser)

router.route('/logout')
    .get(isLoggedIn, users.logoutUser)


router.route('/forgot')
    .get(users.forgotForm)
    .post(catchAsync(users.forgotPw))

router.route('/reset/:token')
    .get(catchAsync(users.resetPwForm))
    .post(catchAsync(users.resetPw))

module.exports = router;