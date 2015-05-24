var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var songModel = require('../models/song');
var db_songs;
songModel.find(function(err, songs) {
  if (err) return;
  else db_songs = songs;
});

router.index = function (req, res, next) {
  songModel.find( function(err, songs) {
    if (err) return next(err);

    res.render('index', {
      setlist: songs
      });
  });
};

router.band = function (req, res, next) {
  song.find( function(err, songs) {
    if (err) return next(err);

    res.render('partials/band', {
      setlist: songs
      });
  });
};

router.shows = function (req, res) {
  res.render('partials/shows', {});
};

router.contact = function (req, res) {
  res.render('partials/contact', {});
};

router.partials = function (req, res) {
  var name = req.params.id;
  res.render('./partials/' + name);
};

router.error = function (req, res) {
  res.render('error');
};

router.getSongs = function(req, res, next) {
  songModel.find(function(err, songs) {
    if (err) return next();
    res.json(songs);
  });
};

router.getOneSong = function(req, res, next) {
  songModel.findById(req.params.id, function (err, song) {
    if (err) return next();
    res.json(song);
  });
};

router.postSong = function(req, res, next) {
  songModel.create(req.body, function(err, post) {
    if (err) return next();
    res.json(post);
  });
};

router.updateSong = function(req, res, next) {
  songModel.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next();
    res.json(post);
  });
}

router.deleteSong = function(req, res, next) {
  songModel.findById(req.params.id, function(err, doc) {
    if (err) return next();
    doc.remove();
    res.redirect('/');
  });
}

module.exports = router;
