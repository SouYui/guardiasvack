const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    guardia: { type: mongoose.Schema.Types.ObjectId, ref: 'Guardia', required: true },
    fechaGuardia: { type: Date, required: true },
    task: { type: String, required: true },
    completed: { type: Boolean, default: false }
});

module.exports = mongoose.model('Todo', todoSchema);