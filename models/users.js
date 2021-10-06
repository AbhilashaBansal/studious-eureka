const mongoose = require('mongoose');
const passwordLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        trim: true,
        required: true
    },
    lastName: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        required: true
    },
    profilePhoto: {
        type: String, 
        default: '/images/profilePhoto.jpeg'
    } 
});

userSchema.plugin(passwordLocalMongoose);

const Users = mongoose.model("Users", userSchema);

module.exports = Users;
