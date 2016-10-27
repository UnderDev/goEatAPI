'use strict';    
angular.module('myApp.settings', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/settings', {
    templateUrl: 'views/settings.html',
    controller: 'settingsCntrl'
  });
}])

.controller('settingsCntrl', [function() {

}]);