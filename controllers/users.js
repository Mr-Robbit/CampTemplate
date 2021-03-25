
const User = require('../models/user');
const generateResetToken = require('../utils/generateResetToken');
const nodemailer = require("nodemailer");
const crypto = require("crypto");


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

module.exports.loginForm = (req, res) => {
    res.render('users/login');
};

module.exports.loginUser = (req, res) => {
    req.flash('success', `Welcome back ${req.user.email}!`);
    const redirectUrl = (req.session.returnTo || '/campgrounds');
    delete req.session.returnTo;
    res.redirect('/campgrounds');
};

module.exports.logoutUser = (req, res) => {
    req.logOut();
    req.flash('success', 'Goodbye!');
    res.redirect('/campgrounds');
};

module.exports.forgotForm = (req, res) => {
    res.render('users/forgot');
};

module.exports.forgotPw = async (req, res) => {
    try {
		// generate reset token to send.
		let reset_token = await generateResetToken();
		console.log(reset_token);
        console.log(req.body.email);

		// find the specified user by email.
		let user = await User.findOne({email: req.body.email});
		if (!user) {
      req.flash('error', 'No account with that email address.');
			throw 'user not found.'
		}
		user.resetPasswordToken = reset_token;
		user.resetPasswordExpires = Date.now() + 3600000; // 1 hour in ms
		// passport local mongoose allows for promises inherently.
		await user.save();

		// create transport
		const smtpTransport = nodemailer.createTransport({
			service: 'Gmail',
			auth: {
				user: 'pantherfanforever@gmail.com',
				pass: process.env.GMAILPW
			}
		});
		// set options
		const mailOptions = {
			to: user.email,
			from: 'pantherfanforever@gmail.com',
			subject: 'YelpCamp Password Reset',
			text: 'You are receiving this because you (or someone else) have requested the reset of the password linked to your Yelpcamp account.' +
				'Please click on the following link, or paste this into your browser to complete the process.' + '\n\n' +
				'http://' + req.headers.host + '/reset/' + reset_token + '\n\n' + 
				'If you did not request this, please ignore this email and your password will remain unchanged.'
		};
		// send mail uses promise if no callback is specified.
		await	smtpTransport.sendMail(mailOptions);
		console.log('mail sent');
		req.flash('success', 'an email has been sent to ' + user.email + ' with further instructions.');
		res.redirect('/campgrounds');
	} catch (error) {
		console.log(error);
		res.redirect('/forgot');
	}
};

module.exports.resetPwForm = async (req, res) => {
	const token = req.params.token;
	const user = await User.findOne({resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() }});
	if(!user){
		req.flash('error', 'Password reset token invalid, or expired.');
		return res.redirect('/forgot');
	}
	res.render('users/reset', { token });
};

module.exports.resetPw = async (req, res) => {
	const password = req.body.password;
	const confirmPassword = req.body.confirmPassword;
	const token = req.params.token;
	const user = await User.findOne({resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now()}});
	
	if(!user){
		req.flash('error', 'Password reset token is invalid, or expired.');
		return res.redirect('/campgrounds');
	}
	if( password === confirmPassword ){
		await user.setPassword(password);
		user.resetPasswordToken = undefined;
		user.resetPasswordExpires = undefined;
		await user.save();
		req.flash('success', 'Password successfully changed');
		res.redirect('/login');
	} else {
		req.flash('error', 'Passwords do not match');
		return res.redirect(`/reset/${token}`);
	}
}