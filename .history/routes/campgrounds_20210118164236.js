const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, checkCampgroundOwnership, validateCampground } = require('../middleware/middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const Campground = require('../models/campgrounds');

// Campground Routes

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.newCamp))



router.get('/new', isLoggedIn, campgrounds.newForm);

router.route('/:id')
    .get(catchAsync(campgrounds.show))
    .put(isLoggedIn, checkCampgroundOwnership, upload.array('image'), validateCampground, catchAsync(campgrounds.editCamp))
    .delete(isLoggedIn, checkCampgroundOwnership, catchAsync(campgrounds.deleteCamp))

router.get('/:id/edit', isLoggedIn, checkCampgroundOwnership, catchAsync(campgrounds.editForm));

module.exports = router;