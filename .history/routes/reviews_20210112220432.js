const express = require('express');
const router = express.Router({ mergeParams: true });

const Campground = require('../models/campgrounds');
const Review = require('../models/review');


const { validateReview, isLoggedIn, reviewOwnership } = require('../middleware/middleware');

const catchAsync = require('../utils/catchAsync');




router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    review.dateCreated = new Date().toUTCString;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Created new Review');
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.delete('/:reviewID', reviewOwnership, catchAsync(async (req, res) => {
    const { id, reviewID } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewID } })
    await Review.findByIdAndDelete(reviewID);
    req.flash('success', 'Successfully deleted Review!');
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;