if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

//console.log(process.env.CLOUDINARY_SECRET);
const express = require('express');
const path = require('path');
const app = express();
const session = require('express-session');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override'); //ovveride
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const mongoSanitize = require('express-mongo-sanitize');

const MongoDBStore = require('connect-mongo')(session);


const campgrounds = require('./routes/campground'); // routes- campground
const reviews = require('./routes/reviews'); // routes - review
const userRoutes = require('./routes/users'); // route- login form


const { serializeUser, deserializeUser } = require('passport');
const { deserialize } = require('v8');

const DbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';
//DataBase mongodb://localhost:27017/yelp-camp//process.env.DB_URL
mongoose.connect(DbUrl,{
   useNewUrlParser: true,
  //  useCreateIndex: true,
    useUnifiedTopology: true,
})
const db = mongoose.connection;
db.on("Error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
    console.log("Data Base connected");
});

//setting up

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

//sessions
const secret = process.env.SECRET || 'thisisnotokay';

const store = new MongoDBStore({
    url: DbUrl,
    secret,
    touchAfter : 24 * 60 * 60 //seconds
});

store.on("error",function(e) {
   console.log("SESSION STORE ERROR",e)
});


const sessionConfig = {
    store,
    name : 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        //secure : true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));
app.use(flash());



// always after sesssions
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
app.use(mongoSanitize());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// fake user account details

app.get('/fakeUser', async (req, res) => {
    const user = new User({ email: 'ali@gmail.com', username: 'ali' });
    const newUser = await User.register(user, 'ali');
    res.send(newUser);
})


// campground Routes

app.use('/', userRoutes); // router [ register ]
app.use('/campgrounds', campgrounds); // router [Campground]
app.use('/campgrounds/:id/reviews', reviews); // router [reviews]



// remaining routes

app.get('/', (req, res) => {
    res.render('home.ejs');
});



app.all('*', (req, res, next) => {
    next(new ExpressError('PAGE NOT FOUND', 404));
})


app.use((err, req, res, next) => {
   console.log(req.query);
    const { statusCode = 500, message = 'Something went wrong, look into it' } = err;
    if (!err.message) err.message = 'Something went wrong';
    res.status(statusCode).render('error', { err });
})

const port = process.env.PORT || 3000 ;

app.listen(port, () => {
    console.log(`Listening to port ${port}`);
})