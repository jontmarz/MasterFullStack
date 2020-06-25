'use strict'

var mongoose = require('mongoose');
var Squema = mongoose.Schema;

// Modelo de COMMENT
var CommentSchema = Schema({
    content: String,
    date: { type: Date, default: Date.now },
    user: { type: Schema.ObjectId, ref: 'User'}
})

var Comment = mongoose.model('Comment', CommentSchema);

// Modelo de TOPIC
var TopicSchema = Schema({
    title:      String,
    content:    String,
    code:       String,
    lang:       String,
    date:       {type: Date, default: Date.now },
    User:       { type: Schema.ObjectId, ref: 'User' },
    comment:    [ CommentSchema ]
});

module.exports = mongoose.model('Topic', TopicSchema);

