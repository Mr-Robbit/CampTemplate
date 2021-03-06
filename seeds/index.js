
const mongoose = require('mongoose');
const Campground = require('../models/campgrounds');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
mongoose.connect('mongodb://localhost:27017/yelpcamp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('database connected!');
});

const sample = array => array[ Math.floor(Math.random() * array.length) ];

const seedDb = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 25; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '5ffe4714c12f4905644aba02',
            location: `${cities[ random1000 ].city}, ${cities[ random1000 ].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/483251',
            description: 'this place is sooooo awesome. It takes me back to when i was a young boy, and had no cares in the world. Chasing chickmunks is a past time i will never forget along with roasting weenies by the fire',
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude, 
                    cities[random1000].latitude,
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/mrrobbit89/image/upload/v1611020935/yelpcamp/qjecipbn7i7b6hvgkzyi.jpg',
                    filename: 'yelpcamp/qjecipbn7i7b6hvgkzyi'
                }
            ]
        })
        await camp.save();
    }
}

seedDb().then(() => {
    mongoose.connection.close();
});