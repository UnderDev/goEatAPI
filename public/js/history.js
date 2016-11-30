'use strict';

angular.module('myApp.history', ['ngRoute'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/history', {
      templateUrl: 'views/history.html',
      controller: 'HistoryCtrl'
    });
  }])

  .controller('HistoryCtrl', ['$scope', '$route', 'PeopleService', 'RemoveService', 'geolocationSvc', 'DirectionService', '$sce', function ($scope, $route, PeopleService, RemoveService, geolocationSvc, DirectionService, $sce) {
    
    $scope.showMap = true; //used to show and hide map details
    var loc; //variable for storing users current location
    $scope.history = []; //history holds all the user places retrieved from database

    //reload page when item is removed
    $scope.reloadRoute = function() {
      $route.reload();
    }

    //checks if browser supports local storage for facebook login details
    if (typeof (Storage) !== "undefined") {
            if(localStorage.getItem("usrId")!="loggedOut"){

                var fbpass = localStorage.getItem("usrId");

                //for local testing
                //var fbpass = "10207337063737016";
                //pass facebook id to service to check whether user is in database and return person if found
                PeopleService.getData(fbpass).then(function (data) {
                    //store history from response
                    $scope.history = data.History;

                  }, function () {
                    $scope.data = undefined;
                  });
                }
           } else {
                //alert user that browser does not support local storage
                alert("Please update to a browser that supports HTML5")
        }//if

        //get place photo from url stored in database
        $scope.getURL = function (stuff) {
            
                if (stuff != undefined){
                    return "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=" + stuff + "&key=AIzaSyBO90mNejVGPHPYioe2_nnLL5776iXZCX8"
            }
        }//getURL

        //function for clearing history
        $scope.remove = function () {

            RemoveService.remove(fbpass).then(function(){
                console.log("removed sucessfully")
            }, function(){

            });//RemoveService
        }//remove

        //get user current position and store response to loc variable
        geolocationSvc.getCurrentPosition().then(function (location) {
                loc = location;
        })//getCurrentPosition

        ////add button click calls func and sends location id to DirectionService with users location for directions
        $scope.getDirections = function (place_id) {
            DirectionService.getData(loc, place_id).then(function (data) {
                //directions are set directly to html
                var result = document.getElementById('result');
                result.innerHTML = "";            
                //each line of directions printed to html and newline added 
                data[0].legs[0].steps.forEach(function (Inst) {
                    result.innerHTML += Inst.html_instructions + "<br>"
                });
            }, function () {
                $scope.data = undefined;
            });//getData

        };//getDirections

        //google map button sends location id to get map from google map api
        $scope.showMap = true;
        $scope.showMe = function (placeID) {
            //showMap toggled to reveal map
            $scope.showMap = false;
            //users location is returned from getCurrentPosition and coordinates are set to local variable
            geolocationSvc.getCurrentPosition().then(function (location) {
                var latLong = location.coords.latitude + "," + location.coords.longitude;
                //http://stackoverflow.com/questions/29444132/angular-interpolation-error-for-src-attribute 
                //google api called to get directions from users location to selected location
                $scope.placeID = $sce.trustAsResourceUrl("https://www.google.com/maps/embed/v1/directions?origin=" + latLong + "&destination=place_id:" + placeID + "&key=AIzaSyB5ZgNt2r2S-v7LI-SQdMpsORxPTpgPoAY");
            })//getCurrentPosition
        }//showMe

        //toggle map
        $scope.hideMe = function () {
            $scope.showMap = true;
        }//hideMe

  }]);//BlacklistCtrl

