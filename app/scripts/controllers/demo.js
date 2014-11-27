'use strict';

/**
 * @ngdoc function
 * @name ngChemApp.controller:DemoCtrl
 * @description
 * # DemoCtrl
 * Controller of the ngChemApp
 */
angular.module('ngChemApp')

  .controller('DemoCtrl', function ($scope, $rootScope, $state) {

    $scope.formData = {};

    $rootScope.dynamic = 0.5;
    $rootScope.max = 4;
    
    // function to process the form
    $scope.processForm = function() {
        alert('awesome!');
    };



  });
