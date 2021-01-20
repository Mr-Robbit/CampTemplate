const Joi = require('joi');

module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(1),
        image: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        numReviews: Joi.number(),
        totalRatings: Joi.array()
    }).required()
})

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(0).max(5),
        heading: Joi.string().required().max(limit: 100),
        body: Joi.string(),
        dateCreated: Joi.date().required()
    }).required()
})


