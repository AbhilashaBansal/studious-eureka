const express = require('express');
const app = express();

const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');

const passport = require('passport');
const LocalStrategy = require('passport-local');
const flash = require('connect-flash');
const Users = require('./models/users');

// middleware functions
const { isLoggedIn } = require('./mw');


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

app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true }))


// express sessions
app.use(session({
    secret: 'yeHaiApanKaSecret',
    resave: false,
    saveUninitialized: true
}))


app.use(flash());
// configuring passport sessions
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(Users.authenticate()));
passport.serializeUser(Users.serializeUser());
passport.deserializeUser(Users.deserializeUser());


// routes
const authRoutes = require('./routes/auth');
app.use(authRoutes);


app.get('/', isLoggedIn, (req, res) => {
    res.render('home');  
})


app.listen(3000, () => {
    console.log("Server running at http://localhost:3000 ");
})