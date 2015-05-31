var lovelies = angular.module('lovelies', ['ngRoute']);
var watchingVideo = false;


lovelies.config(function($routeProvider, $locationProvider) {
    $routeProvider.when('/', {
        templateUrl: '/api/partials/title'
    });
    $routeProvider.when('/band', {
        templateUrl: '/api/partials/band',
        controller: 'BandController'
    });
    $routeProvider.when('/shows', {
        templateUrl: '/api/partials/shows',
        controller: 'ShowsController'
    });
    $routeProvider.when('/contact', {
        templateUrl: '/api/partials/contact',
        controller: 'ContactController'
    });
    $routeProvider.when('/admin', {
      templateUrl: '/api/partials/admin-panel',
      controller: 'AdminController'
    })

    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });
});

lovelies.controller("MainController", function ($scope, $http) {
  $scope.videoPosition = 0;
  $scope.videoVolume = 0.2;
  $scope.selection = 1;

  var video = $("#bg-video");
  var curtain = $("#bg-curtain");
  var playButton = $("#play-pause");
  var muteBtn = $("#listen-mute");
  var seekBar = $("#seek");
  var volumeBar = $("#vol");
  var nextBtn = $("#next");
  var prevBtn = $('#prev');
  var playlist = $('#vid-playlist');
  var isMuted = true;
  var isPlaying = false;

  // While the video is playing, maintain view styles
  video.on("timeupdate", function() {
    if(video[0].currentTime != video[0].duration) {
      var value = (100 / video[0].duration) * video[0].currentTime;
      seekBar[0].value = value;
    } else {
      nextBtn.click();
    }
    video.prop('muted', isMuted);
  });

  nextBtn.on("click", function() {
    playlist.children("#vid" + $scope.selection).toggleClass('now-playing');
    if($scope.selection < 6) {
      $scope.selection++;
    } else {
      $scope.selection = 1;
    }
    playlist.children("#vid" + $scope.selection).toggleClass('now-playing');
    changeVideo();
  });

  prevBtn.on("click", function() {
    playlist.children("#vid" + $scope.selection).toggleClass('now-playing');
    if($scope.selection > 1) {
      $scope.selection--;
    }
    else {
      $scope.selection = 6;
    }
    playlist.children("#vid" + $scope.selection).toggleClass('now-playing');
    changeVideo();
  });

  function changeVideo() {
    //isMuted = $scope.video.prop('muted');
    video.prop('src', '/media/' + $scope.selection + '.mp4');
    $scope.videoPosition = 0;
    if(isPlaying) video[0].play();
  }

  playButton.on('click', function() {
    // If the video is playing then pause it, or vice versa
    if (isPlaying) {
      video[0].pause();
      curtain.css("background-color", "#000");
      $('#view').css('opacity', '.9');
      playButton.toggleClass("fa-play");
      playButton.toggleClass("fa-pause");
      isPlaying = false;
    } else {
      video[0].play();
      video[0].volume = $scope.videoVolume;
      curtain.css("background-color", "#fff");
      $('#view').css('opacity', '0');
      playButton.toggleClass("fa-play");
      playButton.toggleClass("fa-pause");
      if(isMuted) muteBtn.click();
      isPlaying = true;
    }
  });

  muteBtn.on('click', function() {
    if (isMuted) {
      isMuted = false;
      if ($scope.videoVolume > .5 ) {
        muteBtn.addClass('fa-volume-up').removeClass('fa-volume-off').removeClass('fa-volume-down');
      } else {
        muteBtn.addClass('fa-volume-down').removeClass('fa-volume-up').removeClass('fa-volume-off');
      }
    } else {
      isMuted = true;
      muteBtn.addClass('fa-volume-off').removeClass('fa-volume-up').removeClass('fa-volume-down');
    }
  });

  seekBar.on('change', function() {
    // Keep options upon switching videos through watching the play bar
    var time = video[0].duration * ($scope.videoPosition / 100);
    video.prop('currentTime', time);
  });

  // Event listener for the volume bar
  volumeBar.on('change', function() {
    // Update the video volume
    video[0].volume = $scope.videoVolume;
    if (isMuted) {
      muteBtn.addClass('fa-volume-off').removeClass('fa-volume-up').removeClass('fa-volume-down');
    } else if ($scope.videoVolume > .5 ) {
      muteBtn.addClass('fa-volume-up').removeClass('fa-volume-off').removeClass('fa-volume-down');
    } else if ($scope.videoVolume <= .5) {
      muteBtn.addClass('fa-volume-down').removeClass('fa-volume-up').removeClass('fa-volume-off');
    }
  });

  // Pause the video when the slider handle is being dragged
  seekBar.on("mousedown", function() {
    video[0].pause();
  });

  // Play the video when the slider handle is dropped
  seekBar.on("mouseup", function() {
    if(isPlaying) video[0].play();
  });
});


lovelies.controller("BandController", function ($scope, $http) {
  $scope.songs = [];
  $http.get('/api/song')
    .success(function (data) {
      $scope.songs = data;
  });
});


lovelies.controller("ShowsController", function ($scope, $http) {
  $scope.shows = [];
  $http.get('/api/show')
    .success(function (data) {
      $scope.shows = data;
  });
});

lovelies.controller("ContactController", function ($scope, $http) {
  $scope.submit = function(form) {
  $scope.status = " ";
    $("#status").addClass("fa fa-spinner fa-spin fa-2x");

    var q = "?"
      + "name=" + $scope.name
      + "&email=" + $scope.email
      + "&subject=" + $scope.subject
      + "&message=" + $scope.message;
    $http.get('/api/email/' + q)
        .success(function(data) {
            console.log(data);
            $("#status").removeClass("fa fa-spinner fa-spin fa-2x");
            $scope.status = "Thank you, we'll contact you soon.";
            $scope.message = "";
            $scope.name = "";
            $scope.email = "";
            $scope.subject = "";
        })
        .error(function(data) {
          $("#status").removeClass("fa fa-spinner fa-spin fa-2x");
            console.log('Error: ' + data);
            $scope.status = "An error occurred. Please try again.";
        });
  };
});

lovelies.controller("AdminController", function ($scope, $http) {
  $scope.songs = [];
  $http.get('/api/song')
    .success(function (data) {
      $scope.songs = data;
  });

  $scope.shows = [];
  $http.get('/api/show')
    .success(function (data) {
      $scope.shows = data;
    });

  $scope.songData = {};
  $scope.showData = {};

  $scope.postSong = function() {
      $http.post('/api/song', $scope.songData)
          .success(function(data) {
              $scope.songs = data;
              $scope.songData = {};
          })
          .error(function(data) {
              console.log('Error: ' + data);
          });
  };

  $scope.deleteSong = function(song) {
    var id = song._id;
      $http.delete('/api/song/' + id)
          .success(function(data) {
              $scope.songs = data;
          })
          .error(function(data) {
              console.log('Error: ' + data);
          });
  };

  $scope.postShow = function() {
      $http.post('/api/show', $scope.showData)
          .success(function(data) {
              $scope.shows = data;
              $scope.showData = {};
          })
          .error(function(data) {
              console.log('Error: ' + data);
          });
  };

  $scope.deleteShow = function(show) {
    var id = show._id;
      $http.delete('/api/show/' + id)
          .success(function(data) {
              $scope.shows = data;
          })
          .error(function(data) {
              console.log('Error: ' + data);
          });
  };
});
