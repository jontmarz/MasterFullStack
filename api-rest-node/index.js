'use strict'

const mongoose = require('mongoose');
const app = require('./app');
const port = process.env.PORT || 3999;

mongoose.set ('useFindAndModify', false);
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/api_rest_node', { useNewUrlParser: true })
        .then(() => {
            console.log('la conexión a la db de mongo se ha completado correctamente');

            // Crear el servidor
            app.listen(port, ()=> {
                console.log('El servidor http://localhost:3999 está funcionando.');
            });
        })
        .catch(error => console.log(error));