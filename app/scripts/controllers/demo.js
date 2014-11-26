'use strict';

/**
 * @ngdoc function
 * @name ngChemApp.controller:DemoCtrl
 * @description
 * # DemoCtrl
 * Controller of the ngChemApp
 */
angular.module('ngChemApp')

  .controller('DemoCtrl', function ($scope) {

    $scope.formData = {};
    
    // function to process the form
    $scope.processForm = function() {
        alert('awesome!');
    };


  });
