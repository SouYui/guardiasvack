const express = require('express');
const router = express.Router();
const GuardiaType = require('../models/GuardiaType');

// Crear un catálogo de guardias
router.post('/tipos', async(req, res) => {
    try {
        const { nombre, intervalo, opciones } = req.body;
        // Verificar que el catálogo no exista previamente
        const exists = await GuardiaType.findOne({ nombre });
        if (exists) {
            return res.status(400).json({ msg: "El catálogo ya existe" });
        }
        const nuevoCatalogo = new GuardiaType({ nombre, intervalo, opciones });
        await nuevoCatalogo.save();
        res.status(201).json(nuevoCatalogo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener todos los catálogos de guardias
router.get('/tipos', async(req, res) => {
    try {
        const tipos = await GuardiaType.find();
        res.json(tipos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Eliminar un catálogo de guardias por ID
router.delete('/tipos/:id', async(req, res) => {
    try {
        const catalogo = await GuardiaType.findByIdAndDelete(req.params.id);
        if (!catalogo) {
            return res.status(404).json({ msg: "Catálogo no encontrado" });
        }
        res.json({ msg: "Catálogo eliminado exitosamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;