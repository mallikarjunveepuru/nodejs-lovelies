var express = require('express');
var router = express.Router();
var url = require('url');
var bcrypt = require('bcryptjs');
var nodemailer = require('nodemailer');

var mongoose = require('mongoose');
var showModel = require('../models/show');
var songModel = require('../models/song');
var userModel = require('../models/user');

router.index = function (req, res) {
  res.render('index');
};

router.partials = function (req, res) {
  var name = req.params.id;
  res.render('partials/' + name);
};

router.error = function (req, res) {
  res.render('error');
};

// Email
router.sendEmail = function(req, res) {
  var query = url.parse(req.url, true).query;
  var name = query.name ? query.name : "No name";
  var email = query.email ? query.email : "No email";
  var subj = query.subject ? query.subject : "No subject";
  var msg = query.message ? query.message : "No message";

  console.log(query);
  // create reusable transporter object using SMTP transport
  var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'the.lovelies.sender@gmail.com',
        pass: 'thelovelies2015'
    }
  });

  // setup e-mail data with unicode symbols
  var mailOptions = {
      from: email,
      to: 'jonathon.orsi@gmail.com',
      subject: subj,
      html: '<strong>From: </strong>' + email
        + '<br><strong>Name: </strong>' + name
        + '<br><strong>Message: </strong>' + msg
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, function(error, info){
      if(error){
        res.sendStatus(404);
        return console.log("error: " + error);
      }
      console.log("email sent");
      res.json(info.response);
  });
};

// Admin
router.admin = function(req, res) {
  if (req.session && req.session.user) {
    userModel.findOne({ email: req.session.user.email }, function(err, user) {
      if(!user) {
        req.session.reset();
        res.render('partials/login');
      } else {
        res.locals.user = user;
        res.render('partials/admin');
      }
    });
  } else {
    res.render('partials/login');
  }
};

router.login = function(req, res) {
  userModel.findOne({ email: req.body.email }, function(err, user) {
    if(!user) {
      res.status(404).json("Invalid email or password.");
    } else {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        req.session.user = user;
        res.redirect('/admin');
      } else {
        res.status(404).json("Invalid email address or password.");
      }
    }
  });
};
router.logout = function(req, res) {
  req.session.reset();
  res.redirect('/');
};
router.register = function(req, res, next) {
  var hash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));

  var User = new userModel({
    email: req.body.email,
    password: hash
  });
  User.save(function(err) {
    if (err) {
      res.status(404).json("An error occurred. Perhaps try a different email.");
    } else {
      res.redirect('/admin');
    }
  });
};

// Show Api
router.getShows = function(req, res, next) {
  showModel.find(function(err, shows) {
    if (err) return next();
    res.json(shows);
  });
};

router.getOneShow = function(req, res, next) {
  showModel.findById(req.params.id, function (err, show) {
    if (err) return next();
    res.json(show);
  });
};

router.postShow = function(req, res, next) {
  showModel.create(req.body, function(err, post) {
    if (err) {
      console.log("Got an error: " + err);
      return next();
    }
    router.getShows(req, res);
  });
};

router.updateShow = function(req, res, next) {
  showModel.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next();
    router.getShows(req, res);
  });
}

router.deleteShow = function(req, res, next) {
  showModel.remove({ _id: req.params.id }, function(err) {
    if (!err) {
            console.log("Deleted: " + req.params.id);
            router.getShows(req, res);
    }
    else {
            console.log("Error deleting " + req.params.id);
    }
  });
}


// Song Api
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
    router.getSongs(req, res);
  });
};

router.updateSong = function(req, res, next) {
  songModel.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next();
    router.getSongs(req, res);
  });
}

router.deleteSong = function(req, res) {
  songModel.remove({ _id: req.params.id }, function(err) {
    if (!err) {
            console.log("Deleted: " + req.params.id);
            router.getSongs(req, res);
    }
    else {
            console.log("Error deleting " + req.params.id);
    }
  });
}

module.exports = router;
