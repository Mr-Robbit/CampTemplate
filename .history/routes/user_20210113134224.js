const express = require('express');
const router = express.Router();

const users = require('../controllers/users');
const catchAsync = require('../utils/catchAsync');
const expressError = require('../utils/expressError');


router.get('/register', users.registerForm);

router.post('/register', catchAsync(users.registerUser));

router.get('/login', users.loginForm);

router.post('/login', users.loginUser);

router.get('/logout', users.deleteUser);



module.exports = router;