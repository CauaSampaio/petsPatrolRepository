const mongoose = require('mongoose');

const Upload = mongoose.model('Upload', {
  filename: String,
  tituloEvento: String,
  descricao: String,
  dataEvento: String,
  ong: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ong', 
  },
});

module.exports = Upload;
