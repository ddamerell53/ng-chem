'use strict';

/**
 * @ngdoc function
 * @name ngChemApp.controller:SearchCtrl
 * @description
 * # SearchCtrl
 * Controller of the ngChemApp
 */
angular.module('ngChemApp')
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
    
    $scope.custFieldFormItem = $filter('filter')($scope.searchFormSchema.form, {key:'search_custom_fields__kv_any'}, true);
    $scope.custFieldFormItem[0].options.async.call = $scope.refreshCustFields;
    $scope.projectFrom = $stateParams.projectFrom;
    
    if($scope.searchForm.related_molregno__chembl__chembl_id__in) {
        $scope.searchFormSchema.schema.properties.related_molregno__chembl__chembl_id__in.items = $scope.searchForm.related_molregno__chembl__chembl_id__in.map(function(i){return {value : i, label : i}});
    }
    
    if($scope.searchForm.search_custom_fields__kv_any) {
        $scope.searchFormSchema.schema.properties.search_custom_fields__kv_any.items = $scope.searchForm.search_custom_fields__kv_any.map(function(i){return {value : i, label : i}});
    }

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
        console.log("cancel is being called");
        $scope.searchForm = {};
        $state.transitionTo('cbh.search', {location: true, inherit:false, relative:null, notify:true});
    }

    $scope.runSearch = function(){
        var newParams = searchUrlParams.fromForm($scope.searchForm);
        $state.go('cbh.search', newParams.params, {reload:true});
    }

    $rootScope.projectKey = "Projects";

    $scope.$on('custom-field-from-table', function(event, data) {
        //work out whether this is being added or removed
        console.log("CUSTOM FILTER KLAXON",data);
        
        if(data.addOrRemove == "add") {
            //is it already there? If so, don't re-add - no dupes allowed
            if(!$filter('filter')($scope.searchForm.search_custom_fields__kv_any, function(value, index) { return value == data.newValue.value })){
                $scope.searchForm.search_custom_fields__kv_any.push(data.newValue.value);
                $scope.searchFormSchema.schema.properties.search_custom_fields__kv_any.items = $scope.searchForm.search_custom_fields__kv_any.map(function(i){return {value : i, label : i}});
                $scope.$broadcast("schemaFormRedraw"); 
            }
            
        }
        else if(data.addOrRemove == "remove"){
            var diffs = $filter('filter')($scope.searchForm.search_custom_fields__kv_any, function(value, index) { return value == data.newValue.value })
            if(diffs.length > 0){
                $scope.searchForm.search_custom_fields__kv_any.splice($scope.searchForm.search_custom_fields__kv_any.indexOf(data.newValue.value), 1);
                $scope.searchFormSchema.schema.properties.search_custom_fields__kv_any.items = $scope.searchForm.search_custom_fields__kv_any.map(function(i){return {value : i, label : i}});
                $scope.$broadcast("schemaFormRedraw");
            }
            
        }
        

    });

    $scope.cbh.repaintUiselect = function(){
        $rootScope.$broadcast('schemaFormRedraw');
      }

  }]);
