var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var song = require('../models/song');
var db_songs;
song.find(function(err, songs) {
  if (err) return;
  else db_songs = songs;
});

router.get('/', function(req, res, next) {
  song.find(function(err, songs) {
    if (err) return next(err);
    res.render('song', { setlist: songs });
  });
});

router.post('/', function(req, res, next) {
  song.create(req.body, function(err, post) {
    if (err) return next(err);
    res.redirect('/song');
  });
});

router.get('/:id', function(req, res, next) {
  song.findById(req.params.id, function (err, song) {
    if (err) return next(err);
    res.json(song);
  });
});

router.put('/:id', function(req, res, next) {
  song.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

module.exports = router;
