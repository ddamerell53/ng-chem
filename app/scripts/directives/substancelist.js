'use strict';

/**
 * @ngdoc directive
 * @name ngChemApp.directive:SubstanceList
 * @description
 * # SubstanceList
 */
angular.module('ngChemApp')
  .directive('substanceList', function () {
    return {
      templateUrl: 'views/templates/compound-list.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        
      },
      controller: ['$scope', 'CBHCompoundBatch', function($scope, CBHCompoundBatch) {
      	$scope.compounds = [];
      	$scope.totalServerItems = 0;
	    $scope.pagingOptions = {
	        pageSizes: [20, 50],
	        pageSize: 20,
	        currentPage: 1
	    };
      	$scope.gridOptions = {     data: 'compounds',
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
      	CBHCompoundBatch.query($scope.project, {}).then(function(result) {
      		$scope.compounds = result.objects;
      		$scope.pagingOptions.pageSize = result.meta.limit;
      		$scope.totalServerItems = result.meta.totalCount;
      	});

      	$scope.setPagingData = function(data, page, pageSize){	
	        var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
	        $scope.compounds = pagedData;
	        $scope.totalServerItems = data.length;
	    };

      	$scope.getPagedDataAsync = function (pageSize, page) {
      		var data;
            
                $http.get('jsonFiles/largeLoad.json').success(function (largeLoad) {
                    $scope.setPagingData(largeLoad,page,pageSize);
                });
			var offset = parseInt(page) * parseInt(pageSize);

			CBHCompoundBatch.query($scope.project, {'limit': pageSize, 'offset': offset}).then(function(result) {
			      		//$scope.compounds = result.objects;
			      		//$scope.pagingData = result.meta;
			      		$scope.setPagingData(result.objects, (parseInt(result.meta.offset) / parseInt(result.meta.limit)), result.meta.limit);
			      	});
      	};

      	$scope.$watch('pagingOptions', function (newVal, oldVal) {
	        if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
	          $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
	        }
	    }, true);

	    //$scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);

      }],
      scope: {
      	//add more paramaters here that you wish to use as filters
        
        project: '@'

      }
    };
  });

