import angular from 'angular';
import angularMeteor from 'angular-meteor';

export const app = angular.module('iconviewapp', [
  angularMeteor
]);

app.controller("MainCtrl", function ($scope) {
    $scope.settings = {
      containerWidth: 450,
      containerHeight: 450
    }
  });
