const mongoose = require('mongoose');
const Review = require('./reviews');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});



ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const opts = { toJSON : { virtuals : true}}; 

const campgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
},opts);

//href="" are removed because of stringifying
campgroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `<a href=/campgrounds/${this._id}>${this.title}</a>`;
});





campgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.remove({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Campground', campgroundSchema);