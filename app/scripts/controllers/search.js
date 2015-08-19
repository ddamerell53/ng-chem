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

    $scope.searchFormSchema= angular.copy($scope.cbh.projects.searchform);
    $scope.refresh = function(schema, options, search){
        return $http.get(options.async.url + "?chembl_id__chembl_id__startswith=" + search);
    }
    $scope.refreshCustFields = function(schema, options, search){
        return $http.get(options.async.url + "?custom__field__startswith=" + search);
    }
    var pf = searchUrlParams.setup($stateParams, {molecule: {}});
    $scope.searchForm = angular.copy(pf.searchForm);
    $scope.searchFormSchema.form[0].options.async.call = $scope.refresh;
    //need to repeat this for the custom field lookup
    $scope.searchFormSchema.form[1].$validators = {
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
    
    if($scope.searchForm.related_molregno__chembl__chembl_id__in) {
        $scope.searchFormSchema.schema.properties.related_molregno__chembl__chembl_id__in.items = $scope.searchForm.related_molregno__chembl__chembl_id__in.map(function(i){return {value : i, label : i}});
    }
    
    if($scope.searchForm.search_custom_fields__kv_any) {
        $scope.searchFormSchema.schema.properties.search_custom_fields__kv_any.items = $scope.searchForm.search_custom_fields__kv_any.map(function(i){return {value : i, label : i.replace("|",": ")}});
    }
    $scope.cbh.includedProjectKeys = $scope.searchForm.project__project_key__in;
    $scope.$on("sf-render-finished", function(){
        $timeout(function(){$rootScope.$broadcast("schemaFormValidate");});
    })
    
    $scope.$watch('searchForm.search_custom_fields__kv_any', function(newValue, oldValue){
                  if(newValue !== oldValue){
                    //broadcast the newValue
                    var broadcastObj = $scope.cbh.createCustomFieldTransport(newValue, oldValue, "string");
                    $rootScope.$broadcast('custom-field-to-table', broadcastObj);
                  }
                }, true);

    $scope.cancel = function(){
        //$location.url('/search?limit=&offset=');
        //$scope.cbh.searchPage();
        $scope.searchForm = {};
        $state.transitionTo('cbh.search', {location: true, inherit:false, relative:null, notify:true});
    }

    $scope.cbh.runSearch = function(doScroll){

        var newParams = searchUrlParams.fromForm($scope.searchForm);
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

    $scope.$on('custom-field-from-table', function(event, data) {
        
        if(data.addOrRemove == "add") {
            //is it already there? If so, don't re-add - no dupes allowed
            var match = $filter('filter')($scope.searchForm.search_custom_fields__kv_any, function(value, index) { return value == data.newValue.value })
            if(match.length == 0){
                $scope.searchForm.search_custom_fields__kv_any.push(data.newValue.value);
                $scope.searchFormSchema.schema.properties.search_custom_fields__kv_any.items = $scope.searchForm.search_custom_fields__kv_any.map(function(i){return {value : i, label : i.replace("|", ": ")}});
                $scope.$broadcast("schemaFormRedraw"); 
            }
            
        }
        else if(data.addOrRemove == "remove"){
            var diffs = $filter('filter')($scope.searchForm.search_custom_fields__kv_any, function(value, index) { return value == data.newValue.value })
            if(diffs.length > 0){
                $scope.searchForm.search_custom_fields__kv_any.splice($scope.searchForm.search_custom_fields__kv_any.indexOf(data.newValue.value), 1);
                $scope.searchFormSchema.schema.properties.search_custom_fields__kv_any.items = $scope.searchForm.search_custom_fields__kv_any.map(function(i){return {value : i, label : i.replace("|", ": ")}});
                $scope.$broadcast("schemaFormRedraw");
            }
            
        }
        

    });

    $scope.cbh.repaintUiselect = function(){
        $rootScope.$broadcast('schemaFormRedraw');
      }

  }]);
