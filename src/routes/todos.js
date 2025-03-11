const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');
const jwt = require('jsonwebtoken');

// Middleware de autenticación (similar a otros endpoints)
function authMiddleware(req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).json({ msg: "No se proporcionó token de autenticación" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ msg: "Token no válido" });
    }
}

// Crear un nuevo TODO
// Endpoint: POST http://localhost:5000/api/todos
// Body JSON esperado:
// {
//   "guardiaId": "ID_DE_GUARDIA",
//   "fechaGuardia": "2025-03-01T00:00:00Z",
//   "task": "Descripción de la tarea"
// }
router.post('/', authMiddleware, async(req, res) => {
    try {
        const userId = req.user.userId;
        // Verificar que el usuario no tenga más de 50 TODOs
        const count = await Todo.countDocuments({ usuario: userId });
        if (count >= 50) {
            return res.status(400).json({ msg: "Límite de 50 tareas alcanzado" });
        }

        const { guardiaId, fechaGuardia, task } = req.body;
        if (!guardiaId || !fechaGuardia || !task) {
            return res.status(400).json({ msg: "Faltan campos requeridos" });
        }

        const newTodo = new Todo({
            usuario: userId,
            guardia: guardiaId,
            fechaGuardia: new Date(fechaGuardia),
            task,
            completed: false
        });

        await newTodo.save();
        res.status(201).json(newTodo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener todos los TODOs del usuario autenticado
// Endpoint: GET http://localhost:5000/api/todos
router.get('/', authMiddleware, async(req, res) => {
    try {
        const todos = await Todo.find({ usuario: req.user.userId });
        res.json(todos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Actualizar un TODO (modificar task y/o estado completed)
// Endpoint: PUT http://localhost:5000/api/todos/:id
// Body JSON (ejemplo):
// {
//   "task": "Nueva descripción",
//   "completed": true
// }
router.put('/:id', authMiddleware, async(req, res) => {
    try {
        const { task, completed } = req.body;
        const updatedTodo = await Todo.findOneAndUpdate({ _id: req.params.id, usuario: req.user.userId }, { $set: { task, completed } }, { new: true });
        if (!updatedTodo) {
            return res.status(404).json({ msg: "Tarea no encontrada o no autorizada" });
        }
        res.json(updatedTodo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Eliminar un TODO
// Endpoint: DELETE http://localhost:5000/api/todos/:id
router.delete('/:id', authMiddleware, async(req, res) => {
    try {
        const deletedTodo = await Todo.findOneAndDelete({ _id: req.params.id, usuario: req.user.userId });
        if (!deletedTodo) {
            return res.status(404).json({ msg: "Tarea no encontrada o no autorizada" });
        }
        res.json({ msg: "Tarea eliminada exitosamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;