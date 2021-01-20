const express = require('express');
const router = express.Router();
const { campgrounds } = require('../controllers/campgrounds');
const catchAsync = require('../utils/catchAsync');

const Campground = require('../models/campgrounds');

const { isLoggedIn, checkCampgroundOwnership, validateCampground } = require('../middleware/middleware');



router.get('/', catchAsync(campgrounds.index));



router.get('/new', campgrounds.newForm);

router.post('/', isLoggedIn, validateCampground, catchAsync(campgrounds.newCamp));

router.get('/:id', catchAsync(campgrounds.show));

router.get('/:id/edit', isLoggedIn, checkCampgroundOwnership, catchAsync(campgrounds.editForm));

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