// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic']);

var stockageId = [];
var stockageToken = [];
var stockageImg = [];
var Usermail = [];


app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});

app.controller('user', ['$scope', '$http', function($scope, $http) {
  $scope.user = {}

  $scope.register = function () {
    console.log('Inscription !');
    var url = 'http://snapchat.samsung-campus.net/api.php?option=inscription';
    $http.post(url, $scope.user).then(function success (response) {
      console.log(response);
    }, function error (response) {
      console.log(response);
    });
  };

  $scope.connexion = function () {
    console.log('Connexion !');
    var url = 'http://snapchat.samsung-campus.net/api.php?option=connexion';
    $http.post(url, $scope.user).then(function success (response) {
      if(response.data.error == true)
      {
        alert("vous êtes connecté");
        stockageId.push(response.data.data);
        stockageToken.push(response.data.token);
        Usermail.push(response.config.data.email);
        var stockageParseId = JSON.stringify(stockageId);
        var stockageParseToken = JSON.stringify(stockageToken);
        var UseremailParse = JSON.stringify(Usermail);
        sessionStorage.setItem("idUser", stockageParseId);
        sessionStorage.setItem("token", stockageParseToken);
        sessionStorage.setItem("Email", UseremailParse);
        window.location = "profil.html";
      }
      console.log(response);
    }, function error (response) {
      console.log(response);
    });
  };


}]);

app.controller('camera', function($scope) {

    onPhotoDataSuccess = function(imageData) {
      var container = document.getElementById('content');
      stockageImg.push("data:image/jpeg;base64," + imageData);
      var stockageParseImg = JSON.stringify(stockageImg);
      sessionStorage.setItem("photos", stockageParseImg);

      var img = document.createElement('img');
      img.setAttribute('src', "data:image/jpeg;base64," + imageData);
      img.className = "test";
      container.appendChild(img);
    }
    onFail = function(message) {
      alert("L'opération a échouée : " + message);
    }
    $scope.capturePhoto = function() {
      navigator.camera.getPicture(onPhotoDataSuccess, onFail, {
        quality: 49,
        destinationType : Camera.DestinationType.DATA_URL,
        sourceType : Camera.PictureSourceType.CAMERA,
        allewEdit : true,
        targetWidth : 80,
        targetHeight : 150,
        encodingType: Camera.EncodingType.JPEG,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: true});
    }

    $scope.capturePhotoEdit = function() {
      var options =
      navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 20, allowEdit: true,
        destinationType: destinationType.DATA_URL });
    }

});
app.controller('profil', ['$scope', '$http', function($scope, $http) {
  $scope.snaps = function() {
    var json = sessionStorage.getItem("Email");
    var data1 = JSON.parse(json);
    var json2 = sessionStorage.getItem("token");
    var data2 = JSON.parse(json2);
    console.log(data1 +"   "+ data2);
    $http({
      method: "POST",
      url: "http://snapchat.samsung-campus.net/api.php?option=newsnap",
      data: {email: data1[0], token: data2[0]}
    }).then(function successCallback(response){
      if(response.data.error == true)
      {
        console.log(response);
      }
    }, function errorCallback(response){
      console.log(response);
    });
  }
}]);