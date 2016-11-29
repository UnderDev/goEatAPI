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
    if (typeof (Storage) !== "undefined"&&localStorage.getItem("usrId")!="loggedOut") {
                
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

  }])//BlacklistCtrl
    
    //factory to get user profile from database
    //http://stackoverflow.com/questions/14947478/angularjs-ng-repeat-with-data-from-service
  .factory('PeopleService', function ($q, $http, $rootScope) {
    var myData = {};
    //sends facebook id to Routes.go func and returns profile if found
    return {
      getData: function (fbpass) {
        var deferred = $q.defer();
        $http.get('/returnFindPerson/' + fbpass) //will need unique id - not name
          .success(function (data) {
            myData = data;
            //jquery deferred promise
            deferred.resolve(myData);
            // update angular's scopes
            $rootScope.$$phase || $rootScope.$apply();
          });
        return deferred.promise;
      }//getData
    }
  })//PeopleService

  //service to remove item from users favourites on database
  .factory('RemoveService', function ($q, $http, $rootScope) {
    //sends location id and user facebook id to Go api, finds user, deletes item and returns
    return {
      remove: function (fbpass) {
        var deferred = $q.defer();
        console.log("remove service - ", fbpass);
        $http.get('/returnRemoveHistory/' + fbpass) //will need unique id - not name
          .success(function () {
            console.log("back to getData");
            // update angular's scopes
            $rootScope.$$phase || $rootScope.$apply();
          });
        return deferred.promise;
      }//remove
    }
  })//RemoveService

    //service to get directions from user location to place location
    //http://stackoverflow.com/questions/14947478/angularjs-ng-repeat-with-data-from-service
    .factory('DirectionService', function ($q, $http, $rootScope) {
        var myData = {};
        //user location is parsed to latitude and longtitude and sent Go api. Directions are returned
        return {
            getData: function (location, destination) {
                var deferred = $q.defer();
                var lat = location.coords.latitude;
                var lon = location.coords.longitude;
                $http.get('/direction/' + lat + ',' + lon + "," + destination)
                    .success(function (data) {
                        myData = data;
                        deferred.resolve(myData);
                        $rootScope.$$phase || $rootScope.$apply();
                    });
                return deferred.promise;
            }//getData
        }
    })//DirectionService

    //service to get user location
    .factory('geolocationSvc', ['$q', '$window', function ($q, $window) {

        //adapted from http://stackoverflow.com/questions/23185619/how-can-i-use-html5-geolocation-in-angularjs
        'use strict';
        //gets and returns location (if supported)
        function getCurrentPosition() {
            var deferred = $q.defer();
            if (!$window.navigator.geolocation) {
                deferred.reject('Geolocation not supported.');
            } else {
                $window.navigator.geolocation.getCurrentPosition(
                    function (position) {
                        deferred.resolve(position);
                    },
                    function (err) {
                        deferred.reject(err);
                    });
            }
            return deferred.promise;
        }//getCurrentPosition
        return {
            getCurrentPosition: getCurrentPosition
        };
  }]);//geolocationSvc

