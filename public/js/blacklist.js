'use strict';

angular.module('myApp.blacklist', ['ngRoute'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/blacklist', {
      templateUrl: 'views/blacklist.html',
      controller: 'BlacklistCtrl'
    });
  }])

  .controller('BlacklistCtrl', ['$scope', '$route', 'PeopleService', 'RemoveServiceBlist', function ($scope, $route, PeopleService, RemoveServiceBlist) {

    $scope.reloadRoute = function() {
      $route.reload();
    }
    
    $scope.blist = [];

    if (typeof (Storage) !== "undefined") {
                
        var fbpass = localStorage.getItem("usrId");
        
        //for local testing
        //var fbpass = "10207337063737016";
        PeopleService.getData(fbpass).then(function (data) {
            $scope.blists = data.Blacklist;
            console.log(fbpass);
            
            console.log($scope.blists);
          }, function () {
            $scope.data = undefined;
          });
           } else {
                alert("Please update to a browser that supports HTML5")
        }

        $scope.getURL = function (stuff) {
            
                if (stuff != undefined){
                    return "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=" + stuff + "&key=AIzaSyBO90mNejVGPHPYioe2_nnLL5776iXZCX8"
            }
        }

        $scope.remove = function (blist) {

            console.log("this is remove func - ", blist);
            RemoveServiceBlist.remove(fbpass, blist).then(function(){
                console.log("removed sucessfully")
            }, function(){

            });
        }

  }])

    //http://stackoverflow.com/questions/14947478/angularjs-ng-repeat-with-data-from-service
  .factory('PeopleService', function ($q, $http, $rootScope) {
    var myData = {};

    return {
      getData: function (fbpass) {
        var deferred = $q.defer();
        $http.get('/returnFindPerson/' + fbpass) //will need unique id - not name
          .success(function (data) {
            console.log("back to getData");
            myData = data;
            deferred.resolve(myData);
            // update angular's scopes
            $rootScope.$$phase || $rootScope.$apply();
          });
        return deferred.promise;
      }
    }
  })

  .factory('RemoveServiceBlist', function ($q, $http, $rootScope) {

    return {
      remove: function (fbpass, blist) {
        var deferred = $q.defer();
        console.log("remove service - ", fbpass, blist);
        $http.get('/returnRemoveBlist/' + fbpass + '/' + blist) //will need unique id - not name
          .success(function () {
            console.log("back to getData");
            // update angular's scopes
            $rootScope.$$phase || $rootScope.$apply();
          });
        return deferred.promise;
      }
    }
  });

