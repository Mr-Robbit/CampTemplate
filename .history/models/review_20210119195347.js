const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    heading: String,
    body: {
        type: String,
        required: false
    },

    rating: Number,
    dateCreated: {
        type: Date,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Review', reviewSchema);