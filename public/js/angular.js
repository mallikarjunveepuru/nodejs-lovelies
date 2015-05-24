var lovelies = angular.module('lovelies', ['ngRoute']);

lovelies.config(function($routeProvider, $locationProvider) {
    $routeProvider.when('/', {
        templateUrl: '/partials/title'
    });
    $routeProvider.when('/band', {
        templateUrl: '/partials/band',
        controller: 'BandController'
    });
    $routeProvider.when('/shows', {
        templateUrl: '/partials/shows'
    });
    $routeProvider.when('/contact', {
        templateUrl: '/partials/contact'
    });

    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });
});

lovelies.controller("MainController", function ($scope, $http) {
});

lovelies.controller("BandController", function ($scope, $http) {
    $scope.formData = {};

    // when landing on the page, get all songs and show them
    $http.get('/song')
        .success(function(data) {
            $scope.songs = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    // when submitting the add form, send the text to the node API
    $scope.postSong = function() {
        $http.post('/song', $scope.formData)
            .success(function(data) {
                $scope.formData = {}; // clear the form so our user is ready to enter another
                $scope.songs = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    // delete a song after checking it
    $scope.deleteSong = function(id) {
        $http.delete('/song/' + id)
            .success(function(data) {
                $scope.songs = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };
});

lovelies.controller("VideoController", function ($scope, $http) {
  $scope.video = document.getElementById("video-bg");
  $scope.watchButton = document.getElementById("show-hide");
  $scope.videoScreen = document.getElementById("container");
  $scope.playButton = document.getElementById("play-pause");
  $scope.muteButton = document.getElementById("listen-mute");
  $scope.seekBar = document.getElementById("seek");
  $scope.volumeBar = document.getElementById("vol");

  $scope.showHide =  function() {
    if ($scope.videoScreen.style.backgroundColor.toString() == "rgb(255, 255, 255)") {
      console.log("CHANGING THE BACKGROUND");
      console.log($scope.videoScreen.style.backgroundColor);
      $scope.videoScreen.style.backgroundColor = "#000";
      $scope.watchButton.className = "fa fa-eye fa-2x";
    } else {
      $scope.videoScreen.style.backgroundColor = "#fff";
      $scope.watchButton.className = "fa fa-eye-slash fa-2x";
    }
  };

  $scope.playPause = function() {
    if (!$scope.video.paused) {
      $scope.video.pause();
      $scope.playButton.className = "fa fa-play fa-2x";
    } else {
      $scope.video.play();
      $scope.playButton.className = "fa fa-pause fa-2x";
    }
  };

  $scope.listenMute = function() {
    if($scope.video.muted == false) {
      $scope.video.muted = true;
      $scope.muteButton.className = "fa fa-volume-off fa-2x";
    } else {
      $scope.video.muted = false;
      $scope.muteButton.className = "fa fa-volume-up fa-2x";
    }
  };

  $scope.updateSeek = function() {
    // Calculate the new time
    var time = $scope.video.duration * ($scope.seekBar.value / 100);

    // Update the video time
    $scope.video.currentTime = time;
  };

  // Event listener for the volume bar
  $scope.updateVolume = function() {
    // Update the video volume
    $scope.video.volume = $scope.volumeBar.value;
    if ($scope.video.muted) {
      $scope.muteButton.className = "fa fa-volume-off fa-2x";
    } else if ($scope.video.volume > .5 ) {
      $scope.muteButton.className = "fa fa-volume-up fa-2x";
    } else if ($scope.video.volume <= .5) {
      $scope.muteButton.className = "fa fa-volume-down fa-2x";
    }
  };



  $scope.video.addEventListener("timeupdate", function() {
    // Calculate the slider value
    var value = (100 / $scope.video.duration) * $scope.video.currentTime;

    // Update the slider value
    $scope.seekBar.value = value;
  });

  // Pause the video when the slider handle is being dragged
  $scope.seekBar.addEventListener("mousedown", function() {
    $scope.video.pause();
  });

  // Play the video when the slider handle is dropped
  $scope.seekBar.addEventListener("mouseup", function() {
    $scope.video.play();
  });
});
