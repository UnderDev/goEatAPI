'use strict';

angular.module('myApp.fb', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/fbButton', {
    templateUrl: 'views/fbLogin.html',
    controller: 'fbCtrl'
  });
}])

.controller('fbCtrl', [function($scope) {
    $scope.usrId = false;
}]);