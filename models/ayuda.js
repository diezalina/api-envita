const mongoose = require('mongoose');

const ayudaSchema = mongoose.Schema({
    nombre: {type: String},
    descripcion: { type: String },
    recomendacion: { type: String },
    centrosDeAcopio: { type: String },
    donaciones: { type: String },
    icono: {type: String}
});

module.exports = mongoose.model("Ayuda", ayudaSchema);
