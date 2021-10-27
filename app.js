const express = require('express');
const app = express();

const mongoose = require('mongoose');
const path = require('path');
const flash = require('connect-flash');

const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const Users = require('./models/users');


// middleware functions
const {isLoggedIn} = require('./mw');


// database connection
mongoose.connect('mongodb://localhost:27017/twitter-clone',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
        // useFindAndModify: false,
        // useCreateIndex: true
    }
)
.then( () => {
    console.log("Database has been connected. ");
})
.catch( (err) => {
    console.log("Error while connecting database:", err);
});


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

// essential middlewares
app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true })) // form data 
app.use(express.json());


// express sessions
app.use(session({
    secret: 'yeHaiApanKaSecret',
    resave: false,
    saveUninitialized: true
}))

// configuring passport sessions
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(Users.authenticate()));
passport.serializeUser(Users.serializeUser());
passport.deserializeUser(Users.deserializeUser());


// flash package stuff
// REVIEW
app.use(flash());
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    next();
})


// routes
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');


// APIs
const postsApiRoute = require('./routes/api/posts');


// using routes
app.use(authRoutes);
app.use(profileRoutes);


// using APIs
app.use(postsApiRoute);


// using middleware to check if logged in !
app.get('/', isLoggedIn, (req, res) => {
    res.render('main');  
})


app.listen(3000, () => {
    console.log("Server running at http://localhost:3000 ");
})