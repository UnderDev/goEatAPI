'use strict';

angular.module('myApp.find', ['ngRoute'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/find', {
      templateUrl: 'views/find.html',
      controller: 'FindCtrl'
    });
  }])

  .controller('FindCtrl', ['$scope', 'PlacesService', function ($scope, PlacesService) {
    $scope.places = [];

    PlacesService.getData().then(function (data) {
      $scope.places = data;
    }, function () {
      $scope.data = undefined;
    });

    $scope.getURL = function(stuff){
      if(stuff != undefined)
        return "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference="+stuff+"&key=AIzaSyBO90mNejVGPHPYioe2_nnLL5776iXZCX8"
        //else return a stock image we serve that says "no image?"
      
    }

  }])

  //http://stackoverflow.com/questions/14947478/angularjs-ng-repeat-with-data-from-service
  .factory('PlacesService', function ($q, $http, $rootScope) {
    var myData = {};

    return {
      getData: function () {
        var deferred = $q.defer();

        $http.get('/maps/nearby/restaurants')
          .success(function (data) {
            console.log(data);
            myData = data;
            deferred.resolve(myData);
            // update angular's scopes
            $rootScope.$$phase || $rootScope.$apply();
          });
        return deferred.promise;
      }
    }
  });

