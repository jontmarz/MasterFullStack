'use strict'

const express = require('express');
const topicController = require('../controllers/topic');

const router = express.Router();
const md_auth = require('../middlewares/auth');

// ruta de prueba
router.get('/test', topicController.test);
router.post('/topic', md_auth.auth, topicController.save);
router.get('/topics/:page?', topicController.getTopics);
router.get('/user-topics/:user', topicController.getTopicsByUser);
router.get('/topic/:id', topicController.getTopic);
router.put('/topic/:id', md_auth.auth, topicController.update);
router.delete('/topic/:id', md_auth.auth, topicController.delete);
router.get('/search/:search', topicController.search);

module.exports = router;