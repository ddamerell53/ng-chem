'use strict';

/**
 * @ngdoc function
 * @name ngChemApp.controller:SearchCtrl
 * @description
 * # SearchCtrl
 * Controller of the ngChemApp
 */
angular.module('ngChemApp')
  .controller('SearchCtrl',['$scope', '$rootScope', '$filter', '$stateParams', '$location', '$state', '$timeout', 'projectFactory', 'gridconfig', 'CBHCompoundBatch', 'urlConfig', 'ProjectCustomFields', function ($scope, $rootScope, $filter, $stateParams, $location, $state, $timeout, projectFactory, gridconfig, CBHCompoundBatch, urlConfig, ProjectCustomFields) {
    
    $scope.myschema = {};
    $scope.myform = {};

    //need to change these to vars and return the same object to avoid the watch digest alert

    

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
        $scope.searchForm.molecule.molfileChanged = function(){};
        $scope.searchForm.fpValue = $stateParams.fpValue;
        $scope.searchForm.dateStart = $stateParams.created__gte;
        $scope.searchForm.dateEnd = $stateParams.created__lte;
        $scope.searchForm.smiles = $stateParams.smiles;

        projectFactory.get().$promise.then(function(res) {
          $scope.searchForm.projects = res.objects;
          angular.forEach($scope.searchForm.projects, function(project) {
            
            if($stateParams.project__project_key && project.project_key == $stateParams.project__project_key) {

                $scope.searchForm.selectedProject = project;
            }
          });
          
        });

        

    };

    $scope.getSearchCustomFields = function() {

        ProjectCustomFields.query($scope.searchForm.selectedProject, {}, $scope.tagFunction).then(function(data){
             $scope.myschema = data.searchform.schema;
             $scope.myform = data.searchform.form;
        });
    }

    $scope.runSearch = function() {
        //get the form
        //send to the appropriate CBHCompoundBatch service

        //build a searchObject from the form
        //use the correct structure search type
        //construct get parameters in the format required by the web service
        var params = {}
        if($scope.searchForm.selectedProject) {
            params["project__project_key"] = $scope.searchForm.selectedProject.project_key;    
        }
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
        var stateUrl = "/search?";

        //we now need to put the parameters we've generated from this search into a string which can be used as filters by the export options.
        //the export will not tolerate present but empty params so we have to only add them if they are present.

        var project_frag = (params.project__project_key) ? ("project__project_key=" + params.project__project_key + "&") : "";
        var flexmatch_frag = (params.flexmatch) ? ("flexmatch=" + encodeURIComponent(params.flexmatch) + "&") : "";
        var with_substructure_frag = (params.with_substructure) ? ("with_substructure=" + encodeURIComponent(params.with_substructure) + "&") : "";
        var similar_to_frag = (params.similar_to) ? ("similar_to=" + encodeURIComponent(params.similar_to) + "&") : "";
        var fpValue_frag = (params.fpValue) ? ("fpValue=" + params.fpValue + "&") : "";
        var created__gte_frag = (params.created__gte) ? ("created__gte=" + params.created__gte + "&") : "";
        var created__lte_frag = (params.created__lte) ? ("created__lte=" + params.created__lte + "&") : "";
        var smiles_frag = (params.smiles) ? ("smiles=" + params.smiles + "&") : "";
        console.log(project_frag);

        var paramsUrl = project_frag + flexmatch_frag + with_substructure_frag + similar_to_frag + fpValue_frag + created__gte_frag + created__lte_frag + smiles_frag;

        $location.url(stateUrl + paramsUrl + '&limit=&offset=');
        gridconfig.configObject.paramsUrl = paramsUrl;
    }

    $scope.searchForm = { molecule: { molfile: "" }, custom_fields: {} };

    $scope.results = {};

    $rootScope.projectKey = "Projects";

    //initialise from URL parameters if present
    $scope.initialiseFromUrl();

    

    //pull in the list of projects to put into the project selector
    

    //initialise structure search type as flexmatch if there are no existing search parameters
    if(!$scope.searchForm.substruc) {
        $scope.searchForm.substruc = "with_substructure";    
    }

    

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

        //initialise the grid to reflect the search
        $timeout(function() {
            $scope.runSearch();
        },200);
        


    

  }]);
