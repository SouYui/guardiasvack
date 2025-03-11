const mongoose = require('mongoose');

const guardiaSchema = new mongoose.Schema({
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tipoGuardia: { type: mongoose.Schema.Types.ObjectId, ref: 'GuardiaType', required: true },
    turnoSeleccionado: { type: String, required: true },
    fechaInicio: { type: Date, required: true },
    fechaFin: { type: Date, required: true },
    eventos: [{ fecha: { type: Date } }],
    ubicacion: { type: String, required: true }, // Ubicación en el mapa del hospital
    nombreHospital: { type: String, required: true }, // Nombre del hospital
    fechaInicioVacacional: { type: Date, default: null }, // Fecha inicio del periodo vacacional (opcional)
    fechaFinVacacional: { type: Date, default: null }, // Fecha fin del periodo vacacional (opcional)
    active: { type: Boolean, default: true } // Guardia activa o no
});

module.exports = mongoose.model('Guardia', guardiaSchema);