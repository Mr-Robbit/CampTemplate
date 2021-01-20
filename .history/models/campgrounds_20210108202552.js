const mongoose = require('mongoose');
const { deleteMany } = require('./review');
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

CampgroundSchema.post('findOneAndDelete', async (campground){
    if (campground.reviews.length) {
        const res = deleteMany({ _id: { $in: campground.reviews } })
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema);