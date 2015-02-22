'use strict';

/**
 * @ngdoc function
 * @name ngChemApp.controller:SearchCtrl
 * @description
 * # SearchCtrl
 * Controller of the ngChemApp
 */
angular.module('ngChemApp')
  .controller('SearchCtrl',['$scope', '$rootScope', 'projectFactory', 'CBHCompoundBatch', function ($scope, $rootScope, projectFactory, CBHCompoundBatch) {
    $scope.searchForm = { molecule: { molfile: "" } };

    $scope.results = {};

    $rootScope.projectKey = "Projects";

    projectFactory.get().$promise.then(function(res) {
      $scope.searchForm.projects = res.objects;
    });

    $scope.datepickers = {
    	dateStart: false,
    	dateEnd: false
    }

    //calendar specific settings
	$scope.today = function() {
		$scope.searchForm.dateStart = new Date();
		$scope.searchForm.dateEnd = new Date();
	};
	$scope.today();

	$scope.clear = function () {
		$scope.dateStart = null;
		$scope.dateEnd = null;
	};
    $scope.openCal = function($event, which) {
	    $event.preventDefault();
	    $event.stopPropagation();

	    $scope.datepickers[which] = true;
	};

	$scope.dateOptions = {
	  formatYear: 'yy',
	  startingDay: 1
	};

	$scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
	$scope.format = $scope.formats[0];

	/*$scope.cust_fields_count = 0
    $scope.custom_fields = [];
    $scope.custom_field_choices = [];

    //Get the backend defined list of custom fields
    CBHCompoundBatch.fetchExistingFields(projectKey).then(
        function(data){
            //add each of the pinned custom fields
            angular.forEach(data.data.fieldNames, function(value) {
                //Add the pinned custom fields
                if (value.id){
                    $scope.cust_fields_count ++;
                    value.id = $scope.cust_fields_count ;
                    value.value = "";
                    $scope.searchForm.custom_fields.push(value);
                } else {
                    $scope.custom_field_choices.push(value.name);
                }
                
            });
            

        }, function(error){
            console.log(error);
        });*/

  }]);
