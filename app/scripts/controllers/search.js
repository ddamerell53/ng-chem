'use strict';

/**
 * @ngdoc function
 * @name ngChemApp.controller:SearchCtrl
 * @description
 * # SearchCtrl
 * Controller of the ngChemApp
 */
angular.module('ngChemApp')
  .controller('SearchCtrl',['$scope','$http', '$rootScope', '$filter', '$stateParams', '$location', '$state', '$timeout', 'projectFactory', 'gridconfig', 'CBHCompoundBatch', 'urlConfig', 'paramsAndForm', 'searchUrlParams',
    function ($scope,$http, $rootScope, $filter, $stateParams, $location, $state, $timeout, projectFactory, gridconfig, CBHCompoundBatch, urlConfig, paramsAndForm, searchUrlParams) {

    $scope.searchFormSchema= angular.copy($scope.cbh.projects.searchform);
    $scope.refresh = function(schema, options, search){
        return $http.get(options.async.url + "?chembl_id__chembl_id__startswith=" + search);
    }
    $scope.searchForm = angular.copy(paramsAndForm.searchForm);
    $scope.searchFormSchema.form[0].items[0].options.async.call = $scope.refresh;

    
    if($scope.searchForm.related_molregno__chembl__chembl_id__in) {
        $scope.searchFormSchema.schema.properties.related_molregno__chembl__chembl_id__in.items = $scope.searchForm.related_molregno__chembl__chembl_id__in.map(function(i){return {value : i, label : i}});
    }

    $scope.cancel = function(){
        //$location.url('/search?limit=&offset=');
        $scope.cbh.searchPage();
    }

    $scope.runSearch = function(){
        var newParams = searchUrlParams.fromForm($scope.searchForm);
        console.log(newParams);
        $state.go("cbh.search", newParams.params);
    }

    $rootScope.projectKey = "Projects";

  }]);
