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

	$scope.myData = [];

    $rootScope.step = 0;
    $rootScope.totalSteps = 4;
    $rootScope.dynamic = 0;
    $rootScope.max = 100;

	// function to process the form
	$scope.processForm = function () {
	  alert('awesome!');
	};

	$scope.parsed_input = [];

	this.input_string = "";

	$scope.gridOptions = { data: 'parsed_input',
						   columnDefs: [{field: 'type', displayName: 'Type'},
                                        {field:'input_str', displayName:'Value'}]
	                      };

	$scope.parseInput = function (){
		//take string
		//split on delims
		//try and pattern match
		//work out what sort of input it is.
		//for now push our test json to the Input

		//now try a delimited list of SMILES
		var splitted = splitInput(this.input_string);

		jQuery.each(splitted, function(idx,val) {
			$scope.parsed_input.push(val);	
		});
		$scope.parsed_input.push(splitted);
	}


});

app.controller('MessageCtrl', function ($scope){
	$scope.alerts = [
        /*{ type: 'danger', msg: 'Oh snap! Change a few things up and try submitting again.' }*/
	];

    $scope.addAlert = function(message, alert_type){
      $scope.alerts.push({msg: message || 'There has been an error!', type : alert_type || "danger" });
    };

    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };

});
