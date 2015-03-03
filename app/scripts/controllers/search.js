'use strict';

/**
 * @ngdoc function
 * @name ngChemApp.controller:SearchCtrl
 * @description
 * # SearchCtrl
 * Controller of the ngChemApp
 */
angular.module('ngChemApp')
  .controller('SearchCtrl',['$scope', '$rootScope', '$filter', '$stateParams', '$location', 'projectFactory', 'gridconfig', 'CBHCompoundBatch', function ($scope, $rootScope, $filter, $stateParams, $location, projectFactory, gridconfig, CBHCompoundBatch) {
    
    $scope.initialiseFromUrl = function(){
        if ($stateParams.with_substructure) {
            $scope.searchForm.substruc = "with_substructure";
            $scope.searchForm.molecule.molfile = $stateParams.with_substructure;
            $rootScope.sketchMolfile = $stateParams.with_substructure;
        }
        else if ($stateParams.flexmatch) {
            $scope.searchForm.substruc = "flexmatch";
            $scope.searchForm.molecule.molfile = $stateParams.flexmatch;
            $rootScope.sketchMolfile  = $stateParams.flexmatch;
        }
        else if ($stateParams.similar_to) {
            $scope.searchForm.substruc = "similar_to";
            $scope.searchForm.molecule.molfile = $stateParams.similar_to;
            $rootScope.sketchMolfile  = $stateParams.similar_to;
        }
        else {
            $rootScope.sketchMolfile  = "";
        }
        $scope.searchForm.fpValue = $stateParams.fpValue;
        $scope.searchForm.dateStart = $stateParams.created__gte;
        $scope.searchForm.dateEnd = $stateParams.created__lte;
        $scope.searchForm.smiles = $stateParams.smiles;

    };

    $scope.runSearch = function() {
        //get the form
        //send to the appropriate CBHCompoundBatch service

        //build a searchObject from the form
        //use the correct structure search type
        //construct get parameters in the format required by the web service
        var params = {}
        if($scope.searchForm.selectedProject) {
            params.project__project_key = $scope.searchForm.selectedProject.projectKey;    
        }
        /*if($scope.searchForm.smiles) {
            params.smiles = $scope.searchForm.smiles;
        }*/
        //it would be great to automagically populate a pasted smiles string into the sketcher
        //for now though, just send the smiles to the web service
        if ($scope.searchForm.smiles) {
            params[$scope.searchForm.substruc] = $scope.searchForm.smiles
        }
        else if ($scope.searchForm.molecule.molfile != "") {
            params[$scope.searchForm.substruc] = $scope.searchForm.molecule.molfile
        }

        if ($scope.searchForm.dateStart) {
            var formattedStart = $filter('date')($scope.searchForm.dateStart, 'yyyy-MM-dd');
        }
        if($scope.searchForm.dateEnd) {
            var formattedEnd = $filter('date')($scope.searchForm.dateEnd, 'yyyy-MM-dd');
        }
        
        //params.created__range = "(" +  formattedStart + "," + formattedEnd + ")";
        params.created__gte = formattedStart;
        params.created__lte = formattedEnd;

        CBHCompoundBatch.search(params).then(function(result){
            
            gridconfig.configObject.totalServerItems = result.meta.totalCount;
            gridconfig.configObject.compounds = result.objects;
            gridconfig.configObject.filters = params;

            
        });
        var url = '/search?project__project_key=' + (params.project__project_key || "") + '&flexmatch=' +  (params.flexmatch || "")
                    + '&with_substructure=' + (params.with_substructure || "") + '&similar_to=' + (params.similar_to || "") 
                    + '&fpValue=' + (params.fpValue || "") + '&created__gte=' + (params.created__gte || "") + '&created__lte=' + (params.created__lte || "") 
                    + '&smiles=' + (params.smiles || "") + '&limit=&offset=';
        $location.url(url);
    }

    $scope.searchForm = { molecule: { molfile: "" } };

    //initialise from URL parameters if present
    $scope.initialiseFromUrl();

    $scope.results = {};

    $rootScope.projectKey = "Projects";

    //pull in the list of projects to put into the project selector
    projectFactory.get().$promise.then(function(res) {
      $scope.searchForm.projects = res.objects;
    });

    //initialise structure search type as exact if there are no existing search parameters
    if(!$scope.searchForm.substruc) {
        $scope.searchForm.substruc = "flexmatch";    
    }

    //initialise the grid to reflect the search
    $scope.runSearch();

    $scope.datepickers = {
    	dateStart: false,
    	dateEnd: false
    }

    //calendar specific settings
	$scope.today = function() {
		$scope.searchForm.dateStart = new Date();
		$scope.searchForm.dateEnd = new Date();
	};
	//$scope.today();

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
	  startingDay: 1,
      showWeeks: false
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