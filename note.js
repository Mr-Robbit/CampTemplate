Thanks for the tutorial Ian! If anyone is looking for an updated version of this code using the modern async/await syntax feel free to use the snippit below to update your forgot route. Note that mine exists under users/forgot. I would also recommend creating a dummy gmail account to use as your mailerbot.
.
.
.
.


// forgot functions. crypo.randombytes does not support promises by default
// so we have to "promisify" it.
var generateResetToken = () => {
	return new Promise((resolve, reject) => {
		// crypto random bytes has a callback.
		// randombytes(size[, callback])
		crypto.randomBytes(20, (err, buf) => {
			if (err) reject(err);
			else {
				let reset_token = buf.toString('hex');
				resolve(reset_token);
			}
		})
	})
}

// NEW forgot post
router.post('/forgot', async (req, res) => {
	try {
		// generate reset token to send.
		let reset_token = await generateResetToken();
		console.log(reset_token);

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
		var smtpTransport = nodemailer.createTransport({
			service: 'Gmail',
			auth: {
				user: '<insert your email address>',
				pass: process.env.GMAILPW
			}
		});
		// set options
		var mailOptions = {
			to: user.email,
			from: '<insert your email address>',
			subject: 'YelpCamp Password Reset',
			text: 'You are receiving this because you (or someone else) have requested the reset of the password linked to your Yelpcamp account.' +
				'Please click on the following link, or paste this into your browser to complete the process.' + '\n\n' +
				'http://' + req.headers.host + '/users/reset/' + reset_token + '\n\n' + 
				'If you did not request this, please ignore this email and your password will remain unchanged.'
		};
		// send mail uses promise if no callback is specified.
		await	smtpTransport.sendMail(mailOptions);
		console.log('mail sent');
		req.flash('success', 'an email has been sent to ' + user.email + ' with further instructions.');
		res.redirect('/users/forgot');
	} catch (error) {
		console.log(error);
		res.redirect('/users/forgot');
	}	
});

