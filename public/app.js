'use strict';

angular.module('myApp', [
  'ngRoute',
  'myApp.find',
  'myApp.view2',
  'myApp.settings'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

}]);