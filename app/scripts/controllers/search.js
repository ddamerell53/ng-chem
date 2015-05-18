'use strict';

/**
 * @ngdoc function
 * @name ngChemApp.controller:SearchCtrl
 * @description
 * # SearchCtrl
 * Controller of the ngChemApp
 */
angular.module('ngChemApp')
  .controller('SearchCtrl',['$scope','$http', '$rootScope', '$filter', '$stateParams', '$location', '$state', '$timeout', 'projectFactory', 'gridconfig', 'CBHCompoundBatch', 'urlConfig', 
    function ($scope,$http, $rootScope, $filter, $stateParams, $location, $state, $timeout, projectFactory, gridconfig, CBHCompoundBatch, urlConfig) {
    var searchform = $scope.cbh.projects.searchform;
    $scope.searchForm = {molecule: {}};
    $scope.refresh = function(schema, options, search){
        return $http.get(options.async.url + "?chembl_id__chembl_id__startswith=" + search);
    }
    searchform.form[0].items[0].options.async.call = $scope.refresh;

    if($stateParams.search_custom_fields__kv_any) {
            $scope.searchForm.search_custom_fields__kv_any = $stateParams.search_custom_fields__kv_any.split(",");;
    }else{
        $scope.searchForm.search_custom_fields__kv_any = [];
    }
    if($stateParams.related_molregno__chembl__chembl_id__in) {
        var items = $stateParams.related_molregno__chembl__chembl_id__in.split(",");
        searchform.schema.properties.related_molregno__chembl__chembl_id__in.items = items.map(function(i){return {value : i, label : i}});

        $scope.searchForm.related_molregno__chembl__chembl_id__in = $stateParams.related_molregno__chembl__chembl_id__in.split(",");    
    }
    $scope.searchFormSchema = searchform; 
            
    $scope.myschema = {};
    $scope.myform = {};
     if ($stateParams.with_substructure) {
            $scope.searchForm.substruc = "with_substructure";
            $scope.setStructure("with_substructure");
            
        }
        else if ($stateParams.flexmatch) {
            $scope.searchForm.substruc = "flexmatch";
            $scope.setStructure("flexmatch");

        }
        else if ($stateParams.similar_to) {
            $scope.searchForm.substruc = "similar_to";
            $scope.setStructure("flexmatch");

        }
        else {
            // $rootScope.searchMolfile  = "";
        }

        $scope.searchForm.molecule.molfileChanged = function(){};
        $scope.searchForm.fpValue = $stateParams.fpValue;
        $scope.searchForm.dateStart = $stateParams.created__gte;
        $scope.searchForm.dateEnd = $stateParams.created__lte;
        if (angular.isDefined($stateParams.project)){
            $scope.searchForm.project = $stateParams.project.split(",");
        }
        

    $scope.setStructure = function(key){
        $scope.searchForm.molecule.molfile = $stateParams[key];
        // $rootScope.searchMolfile = $stateParams[key];
        if ($stateParams[key].indexOf("ChemDoodle") < 0 ){
            $scope.searchForm.smiles = $stateParams[key];
        }
    };
    
    $scope.initialiseFromUrl = function(){

            



     
    };

    $scope.getSearchCustomFields = function() {

       
    }

    $scope.cancel = function(){
        $location.url('/search?limit=&offset=');
    }

    $scope.runSearch = function() {
        //get the form
        //send to the appropriate CBHCompoundBatch service

        //build a searchObject from the form
        //use the correct structure search type
        //construct get parameters in the format required by the web service
        var params = {}
        if($scope.searchForm.project) {
            params["project__project_key__in"] = $scope.searchForm.project;    
        }
        if($scope.searchForm.related_molregno__chembl__chembl_id__in) {
            console.log("test");
            params["related_molregno__chembl__chembl_id__in"] = $scope.searchForm.related_molregno__chembl__chembl_id__in.join(",");    
        }

        //it would be great to automagically populate a pasted smiles string into the sketcher
        //for now though, just send the smiles to the web service
        if ($scope.searchForm.smiles) {
            params[$scope.searchForm.substruc] = $scope.searchForm.smiles
        }
        else if ($scope.searchForm.molecule.molfile != "") {
            params[$scope.searchForm.substruc] = $scope.searchForm.molecule.molfile
        }

        if(!angular.equals([], $scope.searchForm.search_custom_fields__kv_any) && angular.isDefined($scope.searchForm.search_custom_fields__kv_any)) {
            //var encodedCustFields = btoa(JSON.stringify($scope.searchForm.custom_fields));
            var encodedCustFields = $scope.searchForm.search_custom_fields__kv_any.join(",");
            params.search_custom_fields__kv_any = encodedCustFields;
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

        

       
        var stateUrl = "/search?";

        //we now need to put the parameters we've generated from this search into a string which can be used as filters by the export options.
        //the export will not tolerate present but empty params so we have to only add them if they are present.

        var project_frag = ($scope.searchForm.project) ? ("project=" + $scope.searchForm.project.join(",") + "&") : "";
        var flexmatch_frag = (params.flexmatch) ? ("flexmatch=" + encodeURIComponent(params.flexmatch) + "&") : "";
        var with_substructure_frag = (params.with_substructure) ? ("with_substructure=" + encodeURIComponent(params.with_substructure) + "&") : "";
        var similar_to_frag = (params.similar_to) ? ("similar_to=" + encodeURIComponent(params.similar_to) + "&") : "";
        var fpValue_frag = (params.fpValue) ? ("fpValue=" + params.fpValue + "&") : "";
        var created__gte_frag = (params.created__gte) ? ("created__gte=" + params.created__gte + "&") : "";
        var created__lte_frag = (params.created__lte) ? ("created__lte=" + params.created__lte + "&") : "";
        // var smiles_frag = (params.smiles) ? ("smiles=" + params.smiles + "&") : "";
        var cust_field_frag = (encodedCustFields) ? ("search_custom_fields__kv_any=" + encodedCustFields + "&") : "";
        var related_molregno__chembl__chembl_id__in_frag = (params.related_molregno__chembl__chembl_id__in) ? ("related_molregno__chembl__chembl_id__in=" + params.related_molregno__chembl__chembl_id__in + "&") : "";
        var paramsUrl = project_frag + flexmatch_frag + related_molregno__chembl__chembl_id__in_frag + with_substructure_frag + similar_to_frag + fpValue_frag + created__gte_frag + created__lte_frag  + cust_field_frag;



        $location.url(stateUrl + paramsUrl + '&limit=&offset=');
        gridconfig.configObject.paramsUrl = paramsUrl;

        CBHCompoundBatch.search(params).then(function(result){   
            gridconfig.configObject.totalServerItems = result.meta.totalCount;
            gridconfig.configObject.compounds = result.objects;
            gridconfig.configObject.filters = params;
        });

    }




    $scope.searchForm = { molecule: { molfile: "" } };

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

	

        //initialise the grid to reflect the search
        $timeout(function() {
            $scope.runSearch();
        },200);
        


    

  }]);
