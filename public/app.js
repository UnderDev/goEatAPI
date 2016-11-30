'use strict';
angular.module('myApp', [
    'ngRoute',
    'myApp.find',
    'myApp.fb',
    'myApp.favorites',
    'myApp.history',
    'myApp.services'
]).
config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');
    $routeProvider.otherwise({redirectTo:'/find'});
}]);