'use strict';

angular.module('myApp.fb', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/fbButton', {
    templateUrl: 'views/fbLogin.html',
    controller: 'fbCtrl'
  });
}])

.controller('fbCtrl', ['$scope',function($scope) {
  /*  $scope.usrId = false;
    $scope.checkState = function (placeID) {
        console.log($scope.usrId);
        
        if((localStorage.getItem("usrId")!=null)&&(localStorage.getItem("usrId")!=undefined))
        {
            console.log($scope.usrId);
            $scope.usrId = true;
        }
        else{
            console.log($scope.usrId);
            $scope.usrId = false;
        }
        $scope.usrId = true;
    }*/
}]);