const Campground = require('../models/campground');
const Review = require('../models/reviews');


module.exports.createReview = async (Req, res) => {
    const campground = await Campground.findById(Req.params.id);
    const review = new Review(Req.body.review);
    review.author = Req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    Req.flash('success', 'Created New Review');
    res.redirect(`/campgrounds/${campground._id}`);
};


module.exports.deleteReview = async (req, res, next) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully Deleted review');
    res.redirect(`/campgrounds/${id}`);
};
