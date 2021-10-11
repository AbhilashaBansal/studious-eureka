const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    content: {
        type: String,
        trim: true,
        required: true
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
    },
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Users'
        }
    ]
}, {timestamps: true})

const Posts = mongoose.model("Posts", postSchema);

module.exports = Posts;