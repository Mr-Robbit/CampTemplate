const Campground = require('../models/campgrounds');
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'you must be signed in');
        return res.redirect('/login')
    }
    next();
}

module.exports.checkCampgroundOwnership = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!(req.user && campground.author.equals(req.user._id))) {
        req.flash('error', "You don't have permisson to do that!");
        res.redirect('/campgrounds');

    }
    return next();
} 