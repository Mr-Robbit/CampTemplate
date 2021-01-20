const isLoggedIn = if (!req.isAuthenticated()) {
    req.flash('error', 'you must be signed in');
    return res.redirect('/login')
}