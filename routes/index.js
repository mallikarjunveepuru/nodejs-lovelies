var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var song = require('../models/song');

router.get('/', showIndex);
router.get('/index.html', showIndex);

function showIndex(req, res, next) {
  song.find( function(err, songs) {
    if (err) return next(err);

    res.render('index', {
      title: "the Lovelies",
      setlist: songs
      });
  });
}

module.exports = router;
