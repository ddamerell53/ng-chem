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
    
    var custFieldFormItem = $filter('filter')($scope.searchFormSchema.form, {key:'search_custom_fields__kv_any'}, true);
    custFieldFormItem[0].options.async.call = $scope.refreshCustFields;
    $scope.projectFrom = $stateParams.projectFrom;
    
    if($scope.searchForm.related_molregno__chembl__chembl_id__in) {
        $scope.searchFormSchema.schema.properties.related_molregno__chembl__chembl_id__in.items = $scope.searchForm.related_molregno__chembl__chembl_id__in.map(function(i){return {value : i, label : i}});
    }
    
    if($scope.searchForm.search_custom_fields__kv_any) {
        $scope.searchFormSchema.schema.properties.search_custom_fields__kv_any.items = $scope.searchForm.search_custom_fields__kv_any.map(function(i){return {value : i, label : i}});
    }

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

    $scope.$on('custom-field-filter', function(event, data) {
        console.log("CUSTOM FILTER KLAXON",data.newValue);
        $scope.searchForm.search_custom_fields__kv_any = data.newValue;
        $scope.searchFormSchema.schema.properties.search_custom_fields__kv_any.items = $scope.searchForm.search_custom_fields__kv_any.map(function(i){return {value : i, label : i}});
        $scope.$broadcast("schemaFormRedraw");

    });

  }]);
