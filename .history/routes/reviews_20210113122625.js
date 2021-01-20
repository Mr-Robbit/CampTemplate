const express = require('express');
const router = express.Router({ mergeParams: true });

const reviews = require('../controllers/reviews');


const { validateReview, isLoggedIn, reviewOwnership } = require('../middleware/middleware');

const catchAsync = require('../utils/catchAsync');




router.post('/', isLoggedIn, validateReview, catchAsync(reviews.newReview));

router.delete('/:reviewID', isLoggedIn, reviewOwnership, catchAsync(reviews.deleteReview));

module.exports = router;