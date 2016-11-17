'use strict';

angular.module('myApp.favorites', ['ngRoute'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/favorites', {
      templateUrl: 'views/favorites.html',
      controller: 'FavoritesCtrl'
    });
  }])

  .controller('FavoritesCtrl', ['$scope', 'PeopleService', function ($scope, PeopleService) {

    $scope.places = [];

    PeopleService.getData().then(function (data) {
        $scope.places = data.Favourites;
        console.log($scope.places);
      }, function () {
        $scope.data = undefined;
      });


  }])

    //http://stackoverflow.com/questions/14947478/angularjs-ng-repeat-with-data-from-service
  .factory('PeopleService', function ($q, $http, $rootScope) {
    var myData = {};

    return {
      getData: function () {
        var deferred = $q.defer();
        $http.get('/returnFindPerson/' + "tombola") //will need unique id - not name
          .success(function (data) {
            //console.log(data);
            myData = data;
            deferred.resolve(myData);
            // update angular's scopes
            $rootScope.$$phase || $rootScope.$apply();
          });
        return deferred.promise;
      }
    }
  })

