const Campground = require('../models/campgrounds');
const Review = require('../models/review');

// Review controllers

module.exports.newReview = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = await new Review(req.body.review);
    campground.ratings.push(req.review.rating);
    review.author = req.user._id;
    review.dateCreated = new Date();
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Created new Review');
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteReview = async (req, res) => {
    const { id, reviewID } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewID } })
    await Review.findByIdAndDelete(reviewID);
    req.flash('success', 'Successfully deleted Review!');
    res.redirect(`/campgrounds/${id}`);
};