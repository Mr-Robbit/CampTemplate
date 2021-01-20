const Campground = require('../models/campgrounds');
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'you must be signed in');
        return res.redirect('/login')
    }
    next();
}

module.exports.checkCampgroundOwnership = function (req, res, next) {
    const { id } = req.params;
    if (!id.equals(req.user._id) && !req.user) {
        req.flash('error', "You don't have permisson to do that!");
        res.redirect('/campgrounds');
    } else {
        return next();
    }
} 