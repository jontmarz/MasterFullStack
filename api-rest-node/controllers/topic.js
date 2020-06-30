'use strict'

const validator = require('validator');
const Topic = require('../models/topic');

const controller = {
    test: (req, res) => {
        return res.status(200).send({
            message: 'Hola'
        });
    },

    save: (req, res) => {

        // Recoger parámetros por post
        var params = req.body;

        // Validar parámetros
        try {
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
            var validate_lang = !validator.isEmpty(params.lang);

        } catch (err) {
            return res.status(400).send({
                message: 'faltan mensajes por enviar'
            });
        }

        if (validate_content && validate_title && validate_lang) {
            // Crear el objeto a guardar
            var topic = new Topic();

            // Asignar valores
            topic.title = params.title;
            topic.content = params.content;
            topic.code = params.code;
            topic.lang = params.lang;
            topic.user = req.user.sub;

            // Guardar topic
            topic.save((err, topicStored) => {
                
                // Devolver la respuesta
                if (err || !topicStored) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'El tema no se ha guardado'
                    });
                }

                return res.status(200).send({
                status: 'success',
                topic: topicStored
                });
            });
        } else {
            return res.status(200).send({
                message: 'Los datos no son validos'
            });
        }
    }, 

    getTopics: (req, res) => {
        // Recoger la página actual
        if (!req.params.page || req.params.page === null || req.params.page === 0 || req.params.page === undefined) {
            var page = parseInt(1); 
        } else {
            var page = parseInt(req.params.page);
        }

        // Indicar las opciones de paginación
        var options = {
            sort:       { date: -1}, // organiza los items en la paginación, en este caso por fecha. cuando es -1 muestra del más nuevo al más antiguo
            populate:   'user', //extrae el objeto de los datos del usuario autor del item.
            limit: 5,
            page: page
        }

        // Find paginado
        Topic.paginate({}, options, (err, topics) => {
            if (err) {
                return res.status(500).send({
                    status:     'error',
                    message:    'Error al hacer la consulta',
                });
            }

            if (!topics) {
                return res.status(500).send({
                    status:     'error',
                    message:    'No hay topics',
                });
            }

            // Devolver respuesta (topics, total de topics, total pages)
            return res.status(200).send({
                status:     'success',
                topics:     topics.docs,
                totalDocs:  topics.totalDocs,
                totalPages: topics.totalPages
            });
        });
    },

    getTopicsByUser: (req, res) => {
        // Conseguir el id del usuario
        var userId = req.params.user;

        // Find con la condición del usuario
        Topic.find({
            user: userId
        })
             .sort([['date', 'descending']])
             .exec((err, topics) => {
                // Devolver resultado
                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error en la petición'
                    });
                }

                if (!topics) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'No hay temas para mostrar'
                    });
                }
                
                return res.status(200).send({
                    status: 'success',
                    topics
                });
            });
    },

    getTopic: (req, res) => {
        // sacar el Id de la url
        var topicId = req.params.id;
        
        // find del topic por el id
        Topic.findById(topicId)
             .populate('user')
             .exec((err, topic) => {
                 // devolver el resultado
                 if (err) {
                     return res.status(500).send({
                         status: 'error',
                         message: 'error en la petición'
                     });
                 }

                 if (!topic) {
                     return res.status(404).send({
                         status: 'error',
                         message: 'No existe el topic'
                     });
                 }

                 return res.status(200).send({
                     status: 'success',
                     topic
                 });
             });


    },

    update: (req, res) => {
        // Recoger el id del topic desde la url
        const topicId = req.params.id;

        // Recoger los datos que llegan desde POST
        const params = req.body;

        // Validar datos
        try {
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
            var validate_lang = !validator.isEmpty(params.lang);

        } catch (err) {
            return res.status(400).send({
                message: 'faltan mensajes por enviar'
            });
        }

        if (validate_title && validate_content && validate_lang) {
            // Montar los datos en JSON
            var update = {
                title:      params.title,
                content:    params.content,
                code:       params.code,
                lang:       params.lang
            };
            
            // Hacer un find y update al topic por id del topic e id del usuario
            Topic.findOneAndUpdate({_id: topicId, user: req.user.sub}, update, {new:true}, (err, topicUpdated) => {
                
                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error en la petición'
                    });
                }

                if (!topicUpdated) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'El topic no se ha actualizado'
                    });
                }

                // Devolver una respuesta
                return res.status(200).send({
                    status: 'success',
                    topicUpdated
                });
            });
    
        } else {
            return res.status(404).send({
                status: 'error',
                message: 'La validación de datos no es correcta'
            });
        }
    },

    delete: (req, res) => {
        // Sacar el id de la url
        const topicId = req.params.id;

        // realizar un find and delete por topicId y userId
        Topic.findOneAndRemove({_id: topicId, user: req.user.sub}, (err, topicRemove) => {
            // Devolver respuesta
            if (err) {
                return res.status(200).send({
                    status: 'error',
                    message: 'Error en la petición'
                });
            }

            if (!topicRemove) {
                return res.status(200).send({
                    status: 'error',
                    message: 'No se ha borrado el tema'
                });
            }

            return res.status(200).send({
                status: 'success',
                topicRemove
            });
        });
    },

    search: (req, res) => {
        // sacar el string a buscar de la url
        var searchString = req.params.search;

        // Find con OR
        Topic.find({ "$or": [
            {'title': {'$regex': searchString, '$options': 'i'} },
            {'content': {'$regex': searchString, '$options': 'i'} },
            {'code': {'$regex': searchString, '$options': 'i'} },
            {'lang': {'$regex': searchString, '$options': 'i'} }
        ]})
        .sort([['date', 'descending']])
        .exec((err, topics) => {
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error en la petición'
                });
            }

            if (!topics) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay temas disponibles'
                });
            }

            // Devolver datos
            return res.status(200).send({
                status: 'success',
                topics
            });
        });
    }
}

module.exports = controller;