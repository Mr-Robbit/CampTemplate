const Campground = require('../models/campgrounds');
const Review = require('../models/review');
const { campgroundSchema, reviewSchema } = require('../schemas');
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
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', "You don't have permisson to do that!");
        return res.redirect(`/campgrounds/${campground._id}`);
    }
    next();
}

module.exports.reviewOwnership = async (req, res, next) => {
    const { reviewID } = req.params;
    const review = await Review.findById(reviewID);
    if (!(req.user && review.author.equals(req.user._id))) {
        req.flash('error', "You don't have permisson to do that!");
        return res.redirect(`/campgrounds/${review.author._id}`);
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

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new expressError(msg, 400);
    } else {
        next();
    }
}