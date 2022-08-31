const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewurlparser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("Error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
    console.log("Data Base connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await campground.deleteMany({});
    for (let i = 0; i < 2; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new campground({
            // your user id 
            author: '63038f1c01ad947f69602b9c',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem vel fugiat nam necessitatibus tenetur, incidunt, hic, ducimus temporibus quasi vero voluptas alias neque exercitationem inventore officiis. Et fugiat laborum facilis.',
            price,
            geometry:
            {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dtyxjyqpq/image/upload/v1661478304/YelpCamp/hadck6twcr1mj8fchshs.jpg',
                    filename: 'YelpCamp/hadck6twcr1mj8fchshs',
                },
                {
                    url: 'https://res.cloudinary.com/dtyxjyqpq/image/upload/v1661478304/YelpCamp/apycrptsfq978fyvzl9h.jpg',
                    filename: 'YelpCamp/apycrptsfq978fyvzl9h',
                }
            ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})