angular.module('myApp.services', [])

    //factory to get user profile from database
    //http://stackoverflow.com/questions/14947478/angularjs-ng-repeat-with-data-from-service
    .factory('PeopleService', function ($q, $http, $rootScope) {
        var myData = {};
        //sends facebook id to Routes.go func and returns profile if found
        return {
            getData: function (fbpass) {
                var deferred = $q.defer();
                $http.get('/returnFindPerson/' + fbpass)
                    .success(function (data) {
                        myData = data;
                        //jquery deferred promise
                        deferred.resolve(myData);
                        // update angular's scopes
                        $rootScope.$$phase || $rootScope.$apply();
                    });
                return deferred.promise;
            } ////getData
        }
    }) ////PeopleService


    //service to remove item from users blacklist on database
    .factory('RemoveServiceBlist', function ($q, $http, $rootScope) {
        //sends location id and user facebook id to Go api, finds user, deletes item and returns
        return {
            remove: function (blist, fbpass) {
                var deferred = $q.defer();
                console.log("remove service - ", fbpass, blist);
                $http.get('/returnRemoveBlist/' + fbpass + '/' + blist)
                    .success(function () {
                        console.log("back to getData");
                        // update angular's scopes
                        $rootScope.$$phase || $rootScope.$apply();
                    });
                return deferred.promise;
            } //remove
        }
    })

    //service to remove item from users favourites on database
    .factory('RemoveServiceFav', function ($q, $http, $rootScope) {
        //sends location id and user facebook id to Go api, finds user, deletes item and returns
        return {
            remove: function (fav, fbpass) {
                var deferred = $q.defer();
                $http.get('/returnRemoveFav/' + fbpass + '/' + fav)
                    .success(function () {
                        // update angular's scopes
                        $rootScope.$$phase || $rootScope.$apply();
                    });
                return deferred.promise;
            }//remove
        }
    })//RemoveServiceFav

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
    }])//geolocationSvc

    //http://stackoverflow.com/questions/14947478/angularjs-ng-repeat-with-data-from-service
    .factory('PlacesService', function ($q, $http, $rootScope) {
        var myData = {};

        return {
            getData: function (location, category) {
                var deferred = $q.defer();
                var lat = location.coords.latitude;
                var lon = location.coords.longitude;
                $http.get('/maps/nearby/' + category + '/' + lat + ',' + lon)
                    .success(function (data) {
                        myData = data;
                        deferred.resolve(myData);
                        // update angular's scopes
                        $rootScope.$$phase || $rootScope.$apply();
                    });
                return deferred.promise;
            }
        }
    })

    //service to update favourites, blacklist and history items in database
    .factory('UpdateService', function ($http, $rootScope) {

        return {
            updateList: function (place, fbpass, type) {

                //place attributes for update
                var id = place.place_id;
                var name = place.name;
                var photo = place.photos[0].photo_reference;
                var lat = place.geometry.location.lat;
                var lon = place.geometry.location.lng;


                //checks whether update item is for favourites, blacklist or history and goes to appropriate api route
                if (type == "fav") {
                    return $http.get('/returnUpdateFavourites/' + fbpass + '/' + id + '/' + name + '/' + photo + '/' + lat + '/' + lon);
                }
                else if (type == "blist") {
                    return $http.get('/returnUpdateBlacklist/' + fbpass + '/' + id + '/' + name + '/' + photo + '/' + lat + '/' + lon);
                }
                else {
                    return $http.get('/returnUpdateHistory/' + fbpass + '/' + id + '/' + name + '/' + photo + '/' + lat + '/' + lon);
                }
            }//updateList
        }
    });//UpdateService