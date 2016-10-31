'use strict';
angular.module('myApp', [
    'ngRoute',
    'myApp.find'
    'myApp.settings',
    'myApp.fb',
    'myApp.favorites'
]).
config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');
}]);