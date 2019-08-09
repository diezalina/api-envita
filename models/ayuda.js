const mongoose = require('mongoose');

const ayudaSchema = mongoose.Schema({
    descripcion: { type: String },
    recomendacion: { type: String },
    centrosDeAcopio: { type: String },
    donaciones: { type: String }
});

module.exports = mongoose.model("Ayuda", ayudaSchema);
