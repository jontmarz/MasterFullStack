'use strict'

const validator = require('validator');
const Topic = require('../models/topic');

const controller = {
    add: (req, res) => {
        // Recoger el Id del topic
        var topicId = req.params.topicId;

        // Find del id del topic
        Topic.findById(topicId).exec((err, topic) =>{
            
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error en la petición'
                });
            }

            if (!topic) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe el tema'
                });
            }

            // Comprobar objeto usuario y validar datos
            if (req.body.content) {
                // validar datos
                try {
                    var validate_content = !validator.isEmpty(req.body.content);
        
                } catch (err) {
                    return res.status(400).send({
                        message: 'No has realizado comentario'
                    });
                }
                
                if (validate_content) {
                    
                    var comment = {
                        user: req.user.sub,
                        content: req.body.content
                    };
                    
                    // En la propiedad comments del objeto resultante hacer un push
                    topic.comments.push(comment);

                    // guardar el topic completo
                    topic.save((err) => {
                        if (err) {
                            return res.status(500).send({
                                status: 'error',
                                message: 'Error al guardar el comentario'
                            });
                        }
                        
                        Topic.findById(topic._id)
                             .populate('user')
                             .populate('comments.user')
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
                                
                                // Devolver respuesta
                                return res.status(200).send({
                                    status: 'success',
                                    topic
                                });
                            });
                    });
                } else {
                    return res.status(400).send({
                        status: 'error',
                        message: 'No se han validado los datos del comentario'
                    });
                }
            }
        });
    },

    update: (req, res) => {
        // Conseguir el id del comentario que llega por url
        var commentId = req.params.commentId;

        // Recoger datos y validar
        var params = req.body;

        // validar datos
        try {
            var validate_content = !validator.isEmpty(params.content);

        } catch (err) {
            return res.status(400).send({
                message: 'No has realizado comentario'
            });
        }

        if (validate_content) {
            
            // Find and Update de un subdocumento
            Topic.findOneAndUpdate(
                {'comments._id' : commentId},
                {
                  "$set"        : { 'comments.$.content': params.content }
                },
                { new: true },
                (err, topicUpdate) => {

                    if (err) {
                        return res.status(500).send({
                            status: 'error',
                            message: 'Error en la petición'
                        });
                    }
        
                    if (!topicUpdate) {
                        return res.status(404).send({
                            status: 'error',
                            message: 'No existe el tema'
                        });
                    }

                    // devolver datos
                    return res.status(200).send({
                        status: 'success',
                        topic: topicUpdate
                    });
                }
            );
    
        } else {
            
        }
        
    },

    delete: (req, res) => {
        // Sacar el id del topic del comentario y del topic a borrar q viene por la url
        var topicId = req.params.topicId;
        var commentId = req.params.commentId;

        // buscar el topic
        Topic.findById(topicId, (err, topic) => {
            
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error en la petición'
                });
            }

            if (!topic) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe el tema'
                });
            }

            // Seleccuionar el subdocumento(comentario)
            var comment = topic.comments.id(commentId);
    
            // borrar el documento
            if (comment) {
                comment.remove();

                // Guardar el topic
                topic.save((err) => {
                    if (err) {
                        return res.status(500).send({
                            status: 'error',
                            message: 'Error en la petición'
                        });
                    }

                    Topic.findById(topic._id)
                         .populate('user')
                         .populate('comments.user')
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
                            
                            // Devolver respuesta
                            return res.status(200).send({
                                status: 'success',
                                topic
                            });
                        });
                });
            } else {
                return res.status(200).send({
                    status: 'error',
                    message: 'No existe el comentario'
                });
            }
        });
    },
};

module.exports = controller;