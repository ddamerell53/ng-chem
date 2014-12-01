'use strict';

/**
 * @ngdoc function
 * @name ngChemApp.controller:DemoCtrl
 * @description
 * # DemoCtrl
 * Controller of the ngChemApp
 */
var app = angular.module('ngChemApp');

  app.controller('DemoCtrl', function ($scope, $rootScope, $state) {

    $scope.formData = {};

    $scope.myData = [{name: "Moroni", age: 50},
                 {name: "Tiancum", age: 43},
                 {name: "Jacob", age: 27},
                 {name: "Nephi", age: 29},
                 {name: "Enos", age: 34}];

    $scope.gridOptions = { data: 'myData' };

    $rootScope.step = 0;
    $rootScope.totalSteps = 4;
    $rootScope.dynamic = 0;
    $rootScope.max = 100;

    // function to process the form
    $scope.processForm = function () {
      alert('awesome!');
    };


  });

  app.controller('MessageCtrl', function ($scope) {
  	$scope.alerts = [
		{ type: 'danger', msg: 'Oh snap! Change a few things up and try submitting again.' }
	];

  	$scope.addAlert = function(message, alert_type) {
	  $scope.alerts.push({msg: message || 'There has been an error!', type : alert_type || "danger" });
	};

	$scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
	};

  });