const mongoose = require ('mongoose')

const User = mongoose.model('User', {

    userType: String,
    userName: String,
    userEmail: String,
    userPassword: String
})

module.exports = User