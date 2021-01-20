const passport = require('passport');
const User = require('../models/user');

module.exports.registerForm = (req, res) => {
    res.render('users/register');
};

module.exports.registerUser = async (req, res) => {
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
};