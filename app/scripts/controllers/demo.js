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

    $scope.myData = [{name: "Moroni", age: 50},
                 {name: "Tiancum", age: 43},
                 {name: "Jacob", age: 27},
                 {name: "Nephi", age: 29},
                 {name: "Enos", age: 34}];

    $scope.gridOptions = { data: 'myData' };

    $rootScope.step = 0
    $rootScope.totalSteps = 4
    $rootScope.dynamic = 0;
    $rootScope.max = 100;
    //$state.current = "demo.intro";
    
    // function to process the form
    $scope.processForm = function() {
        alert('awesome!');
    };



  });
