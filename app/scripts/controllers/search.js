'use strict';

/**
 * @ngdoc function
 * @name chembiohubAssayApp.controller:SearchCtrl
 * @description
 * # SearchCtrl
 * Controller of the chembiohubAssayApp
 */
angular.module('chembiohubAssayApp')
  .controller('SearchCtrl',['$scope','$http', '$rootScope', '$filter', '$stateParams', '$location', '$state', '$timeout', 'projectFactory', 'gridconfig', 'CBHCompoundBatch', 'urlConfig', 'searchUrlParams',
    function ($scope,$http, $rootScope, $filter, $stateParams, $location, $state, $timeout, projectFactory, gridconfig, CBHCompoundBatch, urlConfig, searchUrlParams) {
    $scope.cbh.appName = "ChemReg";
    $scope.searchFormSchema= angular.copy($scope.cbh.projects.searchform);
    $scope.cbh.textsearch = $stateParams.textsearch;



     
    $scope.refresh = function(schema, options, search){
        return $http.get(options.async.url + "?chembl_id__chembl_id__startswith=" + search);
    }
    $scope.refreshCustFields = function(schema, options, search){
        return $http.get(options.async.url + "?custom__field__startswith=" + search);
    }
    var pf = searchUrlParams.setup($stateParams, {molecule: {}});
    $scope.cbh.searchForm = angular.copy(pf.searchForm);
    $scope.searchFormSchema.form[0].options.async.call = $scope.refresh;
    // need to repeat this for the custom field lookup
    $scope.searchFormSchema.form[2].$validators = {
      notEnough: function(value) {
        if(!angular.isDefined(value)){
            return false;
        }
        if (value.length == 0) {
          return false;
        }
        return true
      }
    }
    $scope.custFieldFormItem = $filter('filter')($scope.searchFormSchema.form, {key:'search_custom_fields__kv_any'}, true);
    $scope.custFieldFormItem[0].options.async.call = $scope.refreshCustFields;
    $scope.projectFrom = $stateParams.projectFrom;
    
    function updateFields(){
         if($scope.cbh.searchForm.related_molregno__chembl__chembl_id__in) {
            $scope.searchFormSchema.schema.properties.related_molregno__chembl__chembl_id__in.items = $scope.cbh.searchForm.related_molregno__chembl__chembl_id__in.map(function(i){return {value : i, label : i}});
        }
        
        if($scope.cbh.searchForm.search_custom_fields__kv_any) {
            $scope.searchFormSchema.schema.properties.search_custom_fields__kv_any.items = $scope.cbh.searchForm.search_custom_fields__kv_any.map(function(i){return {value : i, label : i.replace("|",": ")}});
        }
    }
   updateFields();
    $scope.cbh.includedProjectKeys = ($scope.cbh.searchForm.project__project_key__in.length > 0) ? $scope.cbh.searchForm.project__project_key__in : $scope.cbh.projects.objects.map(function(p){return p.project_key});
       $scope.$watch('cbh.searchForm.search_custom_fields__kv_any', function(newValue, oldValue){
                  if(newValue !== oldValue){
                    //broadcast the newValue
                    var broadcastObj = $scope.cbh.createCustomFieldTransport(newValue, oldValue, "string");
                    $rootScope.$broadcast('custom-field-to-table', broadcastObj);
                    $scope.cbh.runSearch();
                  }
        }, true);

    $scope.cbh.setUpdating = function(){
        $scope.cbh.updating = true;
        $timeout(function(){
                            $scope.cbh.updating = false;
        }, 150);
    }
    $scope.cbh.updating = false;
    $scope.$on("sf-render-finished", function(){
        $timeout(function(){$rootScope.$broadcast("schemaFormValidate");
            $scope.cbh.watcher = $scope.$watch(
              function( $scope ) {
                        return $scope.cbh.textsearch;
               },
                function( newValue , oldvalue) {
                    if ((newValue != oldvalue) && !$scope.cbh.updating){
                        $scope.cbh.setUpdating();
                        $scope.cbh.runSearch();
                        }
                    }

                );

         $scope.cbh.watcher2 = $scope.$watch(
              function( $scope ) {
                    var newObj = {};
                        var array = Object.keys($scope.cbh.searchForm).map(function(value, index) {
                            if(value != "molecule"){
                                newObj[value] = $scope.cbh.searchForm[value];
                            }
                        });
                        return newObj;
               },
                function( newValue , oldvalue) {
                    if(!$scope.cbh.updating){
                        $scope.cbh.setUpdating();
                        $scope.cbh.runSearch();
                        
                    }
                        
                    
                    
                    },
                    true
                );

    });
           
             
     

        $scope.cbh.searchForm.molecule.molfileChanged = function() {
            $stateParams[$scope.cbh.searchForm.substruc] = $scope.cbh.searchForm.molecule.molfile;
            $state.params[$scope.cbh.searchForm.substruc] = $scope.cbh.searchForm.molecule.molfile;
            $location.search($stateParams).replace();
         };
         
    })
    


    $scope.cancel = function(){
        //$location.url('/search?limit=&offset=');
        //$scope.cbh.searchPage();
        $state.params = {};
        $stateParams = {};
        var pf = searchUrlParams.setup({}, {molecule: {}});
        $scope.cbh.searchForm = angular.copy(pf.searchForm);
        $state.transitionTo('cbh.search', {location: true, inherit:false, relative:null, notify:true, reload:true});
        $state.go($state.current.name, $state.params, { reload: true });
    }

    $scope.cbh.runSearch = function(doScroll){
        
        var newParams = searchUrlParams.fromForm($scope.cbh.searchForm, $scope.cbh.textsearch);
         
        newParams.params.doScroll = doScroll;
        newParams.params.sorts = $stateParams.sorts;
        newParams.params.showNonBlanks = $stateParams.showNonBlanks;
        newParams.params.showBlanks = $stateParams.showBlanks;

        $scope.cbh.changeSearchParams(newParams.params, true);

        // $state.go('cbh.search', newParams.params, {reload:true});
    }

    $scope.cbh.isCustomFieldFiltered = function(knownBy){
        if(angular.isDefined($stateParams.search_custom_fields__kv_any)){
            if ($stateParams.search_custom_fields__kv_any.indexOf(knownBy) > -1){
            return true;
            }
        }
        
        return false;
    }


    $rootScope.projectKey = "Projects";

    // $scope.$on('custom-field-from-table', function(event, data) {
        
    //     if(data.addOrRemove == "add") {
    //         //is it already there? If so, don't re-add - no dupes allowed
    //         var match = $filter('filter')($scope.cbh.searchForm.search_custom_fields__kv_any, function(value, index) { return value == data.newValue.value })
    //         if(match.length == 0){
    //             $scope.cbh.searchForm.search_custom_fields__kv_any.push(data.newValue.value);
    //             $scope.searchFormSchema.schema.properties.search_custom_fields__kv_any.items = $scope.cbh.searchForm.search_custom_fields__kv_any.map(function(i){return {value : i, label : i.replace("|", ": ")}});
    //             $scope.$broadcast("schemaFormRedraw"); 
    //         }
            
    //     }
    //     else if(data.addOrRemove == "remove"){
    //         var diffs = $filter('filter')($scope.cbh.searchForm.search_custom_fields__kv_any, function(value, index) { return value == data.newValue.value })
    //         if(diffs.length > 0){
    //             $scope.cbh.searchForm.search_custom_fields__kv_any.splice($scope.cbh.searchForm.search_custom_fields__kv_any.indexOf(data.newValue.value), 1);
    //             $scope.searchFormSchema.schema.properties.search_custom_fields__kv_any.items = $scope.cbh.searchForm.search_custom_fields__kv_any.map(function(i){return {value : i, label : i.replace("|", ": ")}});
    //             $scope.$broadcast("schemaFormRedraw");
    //         }
            
    //     }
        

    // });

    $scope.cbh.repaintUiselect = function(){
                updateFields();

        $rootScope.$broadcast('schemaFormRedraw');
      }

  }]);
