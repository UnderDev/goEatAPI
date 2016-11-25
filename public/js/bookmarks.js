'use strict';    
angular.module('myApp.bookmarks', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/bookmarks', {
    templateUrl: 'views/bookmarks.html',
    controller: 'BookmarksCtrl'
  });
}])

.controller('BookmarksCtrl', ['$scope', 'PeopleService', function ($scope, PeopleService) {

    $scope.profile = [];
    $scope.favs = [];
    $scope.blist = [];
    $scope.history = [];

    if (typeof (Storage) !== "undefined") {
                
        //var fbpass = localStorage.getItem("usrId");
        
        //for local testing
        var fbpass = "10207337063737016";
        PeopleService.getData(fbpass).then(function (data) {
            $scope.profile = data;
            $scope.favs = data.Favourites;
            $scope.blist = data.Blacklist;
            $scope.history = data.History;
            console.log(fbpass);
            
            console.log($scope.favs);
          }, function () {
            $scope.data = undefined;
          });
           } else {
                alert("Please update to a browser that supports HTML5")
        }

        $scope.getURL = function (stuff) {
            if (stuff != undefined)
                    return "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=" + stuff + "&key=AIzaSyBO90mNejVGPHPYioe2_nnLL5776iXZCX8"
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
