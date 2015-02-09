'use strict';

/**
 * @ngdoc function
 * @name ngChemApp.controller:BatchesCtrl
 * @description
 * # BatchesCtrl
 * Controller of the ngChemApp
 */
angular.module('ngChemApp')
  .controller('BatchesCtrl', function ($scope, $rootScope, CBHCompoundBatch, $stateParams) {
    $scope.projectKey = $stateParams.projectKey;
    $scope.compounds = [];
    $scope.totalServerItems = 0;
    $scope.pagingOptions = {
      pageSizes: [10, 20, 50],
      pageSize: 10,
      currentPage: 1
    };
    $scope.gridOptions = {    data: 'compounds',
                              showColumnMenu:true,
                              enableColumnReordering:true,
                              totalServerItems: 'totalServerItems',
                              enablePaging: true,
                  						pagingOptions: $scope.pagingOptions,
          									  showFooter: true,
                              columnDefs: [//{ field: "smiles", displayName: "Structure", cellTemplate:"img-template.html" },
                                            { field: "chemblId", displayName: "UOx ID", width: '20%' },
                                            { field: "molecularWeight", displayName: "Mol Weight", visible: false },
                                            { field: "knownDrug", displayName: "Known Drug", visible: false },
                                            { field: "stdInChiKey", displayName: "Std InChi Key" },
                                            { field: "medChemFriendly", displayName: "MedChem Friendly", visible: false },
                                            { field: "passesRuleOfThree", displayName: "Ro3 Pass", visible: false },
                                            { field: "preferredCompoundName", displayName: "Name", visible: false },
                                            { field: "molecularFormula", displayName: "Formula", visible: false },
                                            { field: "canonicalSmiles", displayName: "SMILES", width: '50%' },
                                            { field: "numRo5Violations", displayName: "Ro5 Violations", visible: false },
                                            { field: "rotatableBonds", displayName: "Rotatable Bonds", visible: false },
                                            { field: "created", displayName: "Added on" },
                                            { field: "acdLogp", displayName: "acdLogp", visible: false }]
                              };

    $scope.setPagingData = function(data, page, pageSize){  
      //var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
      $scope.compounds = data;
      //$scope.totalServerItems = data.length;
    };

    $scope.getPagedDataAsync = function (pageSize, page) {
      var data;
      var offset = parseInt(page - 1) * parseInt(pageSize);
        
            CBHCompoundBatch.query($scope.project, {'limit': pageSize, 'offset': offset}).then(function(result) {
              //$scope.compounds = result.objects;
              //$scope.pagingOptions.pageSize = result.meta.limit;
              $scope.totalServerItems = result.meta.totalCount;
              $scope.setPagingData(result.objects, (parseInt(result.meta.offset) / parseInt(result.meta.limit) + 1), result.meta.limit);
            });
    };

    //initialis with first page of results
    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);

    $scope.$watch('pagingOptions', function (newVal, oldVal) {
      if (newVal !== oldVal && (newVal.currentPage !== oldVal.currentPage || newVal.pageSize !== oldVal.pageSize)) {
        $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
      }
    }, true);



  });
