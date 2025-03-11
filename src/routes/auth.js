const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

// Registro de usuario
router.post('/register', async(req, res) => {
    try {
        const { nombre, apellidos, telefono, email, password } = req.body;
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: "El usuario ya existe" });
        }
        user = new User({ nombre, apellidos, telefono, email, password });
        await user.save();
        res.status(201).json({ msg: "Usuario registrado exitosamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Login de usuario
router.post('/login', async(req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: "Credenciales incorrectas" });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Credenciales incorrectas" });
        }
        // Generar token JWT
        const payload = {
            userId: user._id,
            email: user.email
        };
        const token = jwt.sign(payload, process.env.DYNOHADI, { expiresIn: '120 days' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Recuperación de contraseña
router.post('/recover', async(req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: "No se encontró un usuario con ese correo" });
        }
        // Aquí se puede generar un token y enviar un correo de recuperación.
        // Para efectos de este ejemplo, se retorna un mensaje informativo.
        res.json({ msg: "Se ha enviado un enlace para recuperar la contraseña a su correo electrónico" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;