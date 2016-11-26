'use strict';
angular.module('myApp', [
    'ngRoute',
    'myApp.find',
    'myApp.bookmarks',
    'myApp.fb',
    'myApp.favorites',
    'myApp.blacklist',
    'myApp.history'
]).
config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');
}]);