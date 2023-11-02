const mongoose = require('mongoose')

const Etiqueta = mongoose.model('Etiqueta', {
    etiquetaUm: String,
    etiquetaDois: String,
    etiquetaTres: String,
    ong: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ong'
    }
});

module.exports = Etiqueta