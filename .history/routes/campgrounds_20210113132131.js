const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, checkCampgroundOwnership, validateCampground } = require('../middleware/middleware');

// Campground Routes

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, validateCampground, catchAsync(campgrounds.newCamp))

router.route('/:id')
    .get('/:id', catchAsync(campgrounds.show))
    .put('/:id', isLoggedIn, checkCampgroundOwnership, validateCampground, catchAsync(campgrounds.editCamp))
    .delete('/:id', isLoggedIn, checkCampgroundOwnership, catchAsync(campgrounds.deleteCamp))




router.route('/new')
    .get(isLoggedIn, campgrounds.newForm);



router.get('/:id/edit', isLoggedIn, checkCampgroundOwnership, catchAsync(campgrounds.editForm));



module.exports = router;