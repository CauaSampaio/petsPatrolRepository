const mongoose = require ('mongoose')

const Ong = mongoose.model('Ong', {
    // "Token" padrão de usuario
    userType: String,

    //Informações do representante da ONG
    userNameOng: String,
    userEmailOng: String,
    userPasswordOng: String,

    //Informações da ONG
    nomeOng: String,
    chavePix: String,
    telefoneOng: String,
    animais: Number,
    filhotes: Number,
    doentes: Number,
    banner: String,
    ongEndereco: String,
    ongBio: String,
})

module.exports = Ong