const Campground = require('../models/campgrounds');
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'you must be signed in');
        return res.redirect('/login')
    }
    next();
}

module.exports.checkCampgroundOwnership = (req, res, next) => {
    const { id } = req.params;
    if (!(req.user && id.equal(req.user._id))) {
        req.flash('error', "You don't have permisson to do that!");
        res.redirect('/campgrounds');
    } else {
        return next();
    }
} 