
const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_300');
});

const CampgroundSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    images: [ ImageSchema ],
    price: Number,
    description: String,
    location: String,
    ratings: [ { type: Number } ],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

CampgroundSchema.methods.average = function () {
    const dividend = this.ratings.length;
    let total = 0;
    for (let rating of this.ratings) {
        total += rating
    }
    const avg = total / dividend;
    const roundedAvg = avg.toFixed(1);
    return roundedAvg;
};

// mongoose middleware

CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema);