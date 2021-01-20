module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'you must be signed in');
        return res.redirect('/login')
    }
    next();
},

    module.exports.checkCampgroundOwnership = (req, res, next) => {
        if (currentUser && req.params.id.equals(req.user._id)) {
            return next();
        } else {
            req.flash('error', "You don't have permisson to do that!");
            res.redirect('/campgrounds');
        }
    } 