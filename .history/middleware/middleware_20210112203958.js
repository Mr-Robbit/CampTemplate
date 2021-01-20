const Campground = require('../models/campgrounds');
const { campgroundSchema } = require('../schemas');
const expressError = require('../utils/expressError');
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
        return res.redirect(`/campgrounds/${campground._id}`);
    }
    next();
}

module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new expressError(msg, 400);
    } else {
        next();
    }
}