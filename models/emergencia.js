const mongoose = require('mongoose');

const emergenciaSchema = mongoose.Schema({
    nombre: { type: String },
    fecha: { type: Date },
    /*imagePath: { type: String },*/
    lugar: {type: String},
    descripcion: {type: String}
});

module.exports = mongoose.model('Emergencia', emergenciaSchema);
