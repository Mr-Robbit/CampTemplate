const Campground = require('../models/campgrounds');


module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
};

module.exports.new = isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
};