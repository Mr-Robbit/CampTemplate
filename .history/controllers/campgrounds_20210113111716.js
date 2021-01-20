const Campground = require('../models/campgrounds');


module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
};

module.exports.newForm = isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
};

module.exports.newCamp = async (req, res) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully made a new Campground!');
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.show = async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({ path: 'reviews', populate: { path: 'author' } }).populate('author');
    if (!campground) {
        req.flash('error', 'No Campground Found!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
};