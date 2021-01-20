const express = require('express');
const router = express.Router();
const { campgrounds } = require('../controllers/campgrounds');
const catchAsync = require('../utils/catchAsync');

const Campground = require('../models/campgrounds');

const { isLoggedIn, checkCampgroundOwnership, validateCampground } = require('../middleware/middleware');



router.get('/', catchAsync(campgrounds.index));



router.get('/new', campgrounds.new);

router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully made a new Campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.get('/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({ path: 'reviews', populate: { path: 'author' } }).populate('author');
    if (!campground) {
        req.flash('error', 'No Campground Found!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}))

router.get('/:id/edit', isLoggedIn, checkCampgroundOwnership, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash('error', 'No Campground Found!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}))

router.put('/:id', isLoggedIn, checkCampgroundOwnership, validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { new: true });
    req.flash('success', 'Successfully updated Campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.delete('/:id', isLoggedIn, checkCampgroundOwnership, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted Campground');
    res.redirect('/campgrounds');
}))

module.exports = router;