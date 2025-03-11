const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const guardiasRoutes = require('./routes/guardias');
const catalogsRoutes = require('./routes/catalogs');
const todosRoutes = require('./routes/todos');
require('dotenv').config();

const app = express();

// Configuración de middleware para parsear JSON
app.use(bodyParser.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Conectado a MongoDB"))
    .catch((err) => console.error("Error al conectar a MongoDB: ", err));

// Registro de rutas
app.use('/api/auth', authRoutes);
app.use('/api/guardias', guardiasRoutes);
app.use('/api/catalogs', catalogsRoutes);
app.use('/api/todos', todosRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});