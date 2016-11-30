'use strict';

angular.module('myApp.blacklist', ['ngRoute'])

.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/blacklist', {
        templateUrl: 'views/blacklist.html',
        controller: 'BlacklistCtrl'
    });
  }])

.controller('BlacklistCtrl', ['$scope', '$route', 'PeopleService', 'RemoveServiceBlist', function ($scope, $route, PeopleService, RemoveServiceBlist) {

        $scope.blist = []; //blist holds all the user places retrieved from database

        //reload page when item is removed
        $scope.reloadRoute = function () {
            $route.reload();
        }

        //checks if browser supports local storage for facebook login details
        if (typeof (Storage) !== "undefined") {
            if (localStorage.getItem("usrId") != "loggedOut") {

                //var fbpass = localStorage.getItem("usrId");

                //for local testing
                var fbpass = "10207337063737016";
                //pass facebook id to service to check whether user is in database and return person if found
                PeopleService.getData(fbpass).then(function (data) {
                    //store blacklist from response
                    $scope.blists = data.Blacklist;
                }, function () {
                    $scope.data = undefined;
                });
            }
        } else {
            //alert user that browser does not support local storage
            alert("Please update to a browser that supports HTML5")
        } //if

        //get place photo from url stored in database
        $scope.getURL = function (stuff) {

                if (stuff != undefined) {
                    return "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=" + stuff + "&key=AIzaSyBO90mNejVGPHPYioe2_nnLL5776iXZCX8"
                }
            } //getURL

        //function for removing item from blacklist
        $scope.remove = function (blist) {

                console.log("this is remove func - ", blist);
                RemoveServiceBlist.remove(blist, fbpass).then(function () {
                    console.log("removed sucessfully")
                }, function () {

                });
            } //remove

  }]); //BlacklistCtrl
