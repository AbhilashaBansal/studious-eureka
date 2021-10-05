const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');

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

// app.use(express.static(path.join(__dirname, '/public')));
// app.use(express.urlencoded({ extended: true }))


app.get('/', (req, res)=>{
    res.render('home');
})


app.listen(3000, () => {
    console.log("Server running at http://localhost:3000 ");
})