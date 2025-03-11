const express = require('express');
const router = express.Router();
const Guardia = require('../models/Guardia');
const GuardiaType = require('../models/GuardiaType');
const jwt = require('jsonwebtoken');

// Middleware de autenticación
function authMiddleware(req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).json({ msg: "No se proporcionó token de autenticación" });
    }
    try {
        const decoded = jwt.verify(token, process.env.DYNOHADI);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ msg: "Token no válido" });
    }
}

// Crear una guardia asignada al usuario (se incluyen campos adicionales)
router.post('/', authMiddleware, async(req, res) => {
    try {
        const {
            tipoGuardiaId,
            turnoSeleccionado,
            fechaInicio,
            fechaFin,
            ubicacion,
            nombreHospital,
            fechaInicioVacacional,
            fechaFinVacacional
        } = req.body;

        // Obtener el tipo de guardia para conocer el intervalo
        const tipoGuardia = await GuardiaType.findById(tipoGuardiaId);
        if (!tipoGuardia) {
            return res.status(400).json({ msg: "Tipo de guardia no encontrado" });
        }

        // Generar eventos de guardia según el intervalo definido
        let eventos = [];
        let fechaActual = new Date(fechaInicio);
        while (fechaActual <= new Date(fechaFin)) {
            eventos.push({ fecha: new Date(fechaActual) });
            fechaActual.setDate(fechaActual.getDate() + tipoGuardia.intervalo);
        }

        const nuevaGuardia = new Guardia({
            usuario: req.user.userId,
            tipoGuardia: tipoGuardia._id,
            turnoSeleccionado,
            fechaInicio,
            fechaFin,
            eventos,
            ubicacion,
            nombreHospital,
            fechaInicioVacacional: fechaInicioVacacional || null,
            fechaFinVacacional: fechaFinVacacional || null,
            active: true
        });
        await nuevaGuardia.save();
        res.status(201).json(nuevaGuardia);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener únicamente las guardias activas asignadas al usuario autenticado
router.get('/', authMiddleware, async(req, res) => {
    try {
        const guardias = await Guardia.find({ usuario: req.user.userId, active: true }).populate('tipoGuardia');
        res.json(guardias);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Inactivar una guardia por ID (establece active a false)
router.put('/inactivar/:id', authMiddleware, async(req, res) => {
    try {
        const guardia = await Guardia.findOneAndUpdate({ _id: req.params.id, usuario: req.user.userId }, { active: false }, { new: true });
        if (!guardia) {
            return res.status(404).json({ msg: "Guardia no encontrada o no autorizada" });
        }
        res.json({ msg: "Guardia inactivada exitosamente", guardia });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;