const mongoose = require('mongoose');

const guardiaTypeSchema = new mongoose.Schema({
    nombre: { type: String, required: true }, // Ejemplo: "A-B", "A-C", "A-D", etc.
    intervalo: { type: Number, required: true }, // Intervalo en días (2, 3, 4, …, 7)
    opciones: [{ type: String }], // Opciones disponibles (ej. ["A", "B", "C", "D"])
});

module.exports = mongoose.model('GuardiaType', guardiaTypeSchema);