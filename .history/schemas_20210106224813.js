const Joi = require('joi');
const validateCampground = (req, res, next) => {
    module.exports.campgroundSchema = Joi.object({
        campground: Joi.object({
            title: Joi.string().required(),
            price: Joi.number().required().min(1),
            price: Joi.number().required().min(1),
            image: Joi.string().required(),
            description: Joi.string().required(),
            location: Joi.string().required()
        }).required()
    })

}
