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
});


lovelies.controller("VideoController", function ($scope, $http) {
  $scope.video = $("#video-bg");
  $scope.videoScreen = $("#vid-curtain");
  var watchBtn = $("#show-hide");
  $scope.playButton = $("#play-pause");
  $scope.muteButton = $("#listen-mute");
  $scope.seekBar = $("#seek");
  $scope.volumeBar = $("#vol");

  watchBtn.on('click', function() {
    if (!watchingVideo) {
      $("#vid-curtain").css("background-image", "none").css("background-color", "#fff");
      $("#content").css("opacity", "0");
      watchBtn.toggleClass("fa-eye");
      watchBtn.toggleClass("fa-eye-slash");
      watchingVideo = true;
    } else {
      $('#vid-curtain').css("background-image", "url('/media/bg.jpg')").css("background-color", "#000");
      $('#content').css("opacity", ".9");
      watchBtn.toggleClass("fa-eye");
      watchBtn.toggleClass("fa-eye-slash");
      watchingVideo = false;
    }
  });

  $scope.playButton.on('click', function() {
    if (!$scope.video.get(0).paused) {
      $scope.video.get(0).pause();
      $scope.playButton.toggleClass("fa-play");
      $scope.playButton.toggleClass("fa-pause");
    } else {
      $scope.video.get(0).play();
      $scope.playButton.toggleClass("fa-play");
      $scope.playButton.toggleClass("fa-pause");
    }
  });

  $scope.muteButton.on('click', function() {
    if ($scope.video.get(0).muted) {
      $scope.video.get(0).muted = false;
      if ($scope.videoVolume > .5 ) {
        $scope.muteButton.addClass('fa-volume-up').removeClass('fa-volume-off').removeClass('fa-volume-down');
      } else {
        $scope.muteButton.addClass('fa-volume-down').removeClass('fa-volume-up').removeClass('fa-volume-off');
      }
    } else {
      $scope.video.get(0).muted = true;
      $scope.muteButton.addClass('fa-volume-off').removeClass('fa-volume-up').removeClass('fa-volume-down');
    }
  });

  $scope.seekBar.on('change', function() {
    // Calculate the new time
    var time = $scope.video.get(0).duration * ($scope.videoPosition / 100);

    // Update the video time
    $scope.video.get(0).currentTime = time;
  });

  // Event listener for the volume bar
  $scope.volumeBar.on('change', function() {
    // Update the video volume
    $scope.video.get(0).volume = $scope.videoVolume;
    if ($scope.video.get(0).muted) {
      $scope.muteButton.addClass('fa-volume-off').removeClass('fa-volume-up').removeClass('fa-volume-down');
    } else if ($scope.videoVolume > .5 ) {
      $scope.muteButton.addClass('fa-volume-up').removeClass('fa-volume-off').removeClass('fa-volume-down');
    } else if ($scope.videoVolume <= .5) {
      $scope.muteButton.addClass('fa-volume-down').removeClass('fa-volume-up').removeClass('fa-volume-off');
    }
  });


  $scope.seekToggle = true;
  $scope.video.on("timeupdate", function() {
    // Calculate the slider value
    if($scope.seekToggle) {
      var value = (100 / $scope.video.get(0).duration) * $scope.video.get(0).currentTime;

      // Update the slider value
      $scope.seekBar.get(0).value = value;
    }
  });

  // Pause the video when the slider handle is being dragged
  $scope.seekBar.on("mousedown", function() {
    $scope.seekToggle = false;
  });

  // Play the video when the slider handle is dropped
  $scope.seekBar.on("mouseup", function() {
    $scope.seekToggle = true;
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
