'use strict';

angular.module('myApp.fb', ['ngRoute'])

.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/fbButton', {
        templateUrl: 'views/fbLogin.html',
        controller: 'FbController'
    });
}])

.controller('FbController', ['$scope', function ($scope) {
    $scope.usrId = true;
    $scope.checkState = function () {
        
        if((localStorage.getItem("usrId")!=null)&&(localStorage.getItem("usrId")!=undefined))
        {
            //user logged in
            console.log("Setting to false : "+$scope.usrId);
            $scope.usrId = false;
            console.log("Set to false : "+$scope.usrId);
        }
        else{
            //user not logged in
            console.log("Setting to true "+$scope.usrId);
            $scope.usrId = true;
            console.log("Set to true "+$scope.usrId);
        }
        
    }
}]);