'use strict'

// Cargar requires
const express     = require('express');
const bodyParser  = require('body-parser');

// Ejecutar express
const app = express();

// Cargar archivos de rutas
const user_routes = require('./routes/user')

// agregar Middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// CORS

// reescribir Rutas
app.use('/api', user_routes);


// Exportar el módulo
module.exports = app;