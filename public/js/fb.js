'use strict';

angular.module('myApp.fb', ['ngRoute'])

.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/fbButton', {
        templateUrl: 'views/fbLogin.html',
        controller: 'FbController'
    });
}])

.controller('FbController', ['$scope', function ($scope) {
    $scope.usrId = false;
    $scope.checkState = function () {
        
        if((localStorage.getItem("usrId")!=null)&&(localStorage.getItem("usrId")!=undefined))
        {
            console.log("Setting to true :"+$scope.usrId);
            $scope.usrId = true;
            console.log("Set to true :"+$scope.usrId);
        }
        else{
            console.log("Setting to false"+$scope.usrId);
            $scope.usrId = false;
            console.log("Set to false"+$scope.usrId);
        }
    }
}]);