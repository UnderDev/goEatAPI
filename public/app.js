'use strict';

angular.module('myApp', [
  'ngRoute',
  'myApp.find',
  'myApp.view2'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/find'});
}]);