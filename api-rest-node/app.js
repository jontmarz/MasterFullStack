'use strict'

// Cargar requires
const express     = require('express');
const bodyParser  = require('body-parser');

// Ejecutar express
const app = express();

// Cargar archivos de rutas
const user_routes = require('./routes/user');
const topic_routes = require('./routes/topic');
const comment_routes = require('./routes/comment');

// agregar Middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


// reescribir Rutas
app.use('/api', user_routes);
app.use('/api', topic_routes);
app.use('/api', comment_routes);


// Exportar el módulo
module.exports = app;