//variables
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');

const campgrounds = require('./routes/campgrounds');
const routes = require('./routes/reviews');

// database connect

mongoose.connect('mongodb://localhost:27017/yelpcamp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false

});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('database connected!');
});

//app set up

const app = express();

app.engine('ejs', ejsMate);

app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//error function





app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews', routes);
//Home route

app.get('/', (req, res) => {
    res.render('home');
})



//Reviews routes



//Error handling middleware

app.all('*', (req, res, next) => {
    next(new expressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'something went wrong' } = err;
    if (!err.message) err.message = 'Oh no something went wrong!';
    res.status(statusCode).render('error', { err });
})

//Server connect
app.listen(3000, () => {
    console.log('Serving on port 3000!');
})