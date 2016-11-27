'use strict';

angular.module('myApp.history', ['ngRoute'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/history', {
      templateUrl: 'views/history.html',
      controller: 'HistoryCtrl'
    });
  }])

  .controller('HistoryCtrl', ['$scope', '$route', 'PeopleService', 'RemoveService', function ($scope, $route, PeopleService, RemoveService) {
    
    $scope.reloadRoute = function() {
      $route.reload();
    }

    $scope.history = [];

    if (typeof (Storage) !== "undefined") {
                
        var fbpass = localStorage.getItem("usrId");
        
        //for local testing
        //var fbpass = "10207337063737016";
        PeopleService.getData(fbpass).then(function (data) {

            $scope.history = data.History;
            console.log(fbpass);
            
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

        $scope.remove = function () {

            RemoveService.remove(fbpass).then(function(){
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

  .factory('RemoveService', function ($q, $http, $rootScope) {

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
      }
    }
  });

