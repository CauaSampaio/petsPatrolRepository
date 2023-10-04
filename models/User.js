const mongoose = require ('mongoose')

const User = mongoose.model('User', {
    nameCad: String,
    emailCad: String,
    passwordCad: String
})



module.exports = User