const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, "Provide Your Name"]
    },
    email: {
        type: String,
        require: [true, "Provide email address"]
    },
    password: {
        type: String,
        require: [true, "Provide password"]
    },
    profile_pic: {
        type: String,
        default: ""
    }
}, {
    timestamps: true
})

const UserModel = mongoose.model('user', userSchema)

module.exports = UserModel