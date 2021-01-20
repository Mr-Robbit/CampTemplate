const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds');
const catchAsync = require('../utils/catchAsync');


const { isLoggedIn, checkCampgroundOwnership, validateCampground } = require('../middleware/middleware');



router.get('/', catchAsync(campgrounds.index));



router.get('/new', isLoggedIn, campgrounds.newForm);

router.post('/', isLoggedIn, validateCampground, catchAsync(campgrounds.newCamp));

router.get('/:id', catchAsync(campgrounds.show));

router.get('/:id/edit', isLoggedIn, checkCampgroundOwnership, catchAsync(campgrounds.editForm));

router.put('/:id', isLoggedIn, checkCampgroundOwnership, validateCampground, catchAsync(campgrounds.editCamp));

router.delete('/:id', isLoggedIn, checkCampgroundOwnership, catchAsync(campgrounds.deleteCamp));

module.exports = router;