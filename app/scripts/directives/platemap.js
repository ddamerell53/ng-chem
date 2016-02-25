'use strict';

/**
 * @ngdoc directive
 * @name chembiohubAssayApp.directive:platemap
 * @description
 * # platemap
 */
angular.module('chembiohubAssayApp')
    .directive('platemap',['$filter', function($filter) {
        return {
            templateUrl: 'views/templates/plate-map-template.html',
            restrict: 'E',
            transclude: true,
            scope: {
                plateForm: "=plate",
                schemaFormHolder: "=sfh",
                cbh: "=",
                savePlateFunction: "&"
            },
            controller: ["$scope","$rootScope","$filter",function($scope, $rootScope, $filter) {
                if ($scope.plateForm.plate_size == 96) {
                    $scope.rows = ["A", "B", "C", "D", "E", "F", "G", "H", ];
                    $scope.cols = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", ];
                } else if ($scope.plateForm.plate_size == 48) {
                    $scope.rows = ["A", "B", "C", "D"];
                    $scope.cols = ["1", "2", "3", "4", "5", "6"];
                }
                //create a new onject for each of these combos
                //plateForm.wells = {}
                if (!$scope.plateForm.wells) {
                    $scope.plateForm.wells = {}
                    angular.forEach($scope.rows, function(row) {
                        angular.forEach($scope.cols, function(col) {
                            var wellname = row + col

                            //plateForm.wells = {}
                                //plateForm.wells = {}
                            $scope.plateForm.wells[wellname] = {
                                'row': row,
                                'col': col,
                                'hasData': false,
                                'related_molregno__chembl__chembl_id__in': [],
                            }

                        })
                    })
                }
                //blank well for reference
                

	            $scope.wellForm = {}
	            $scope.selectedWell = {}
	            $scope.selectedWellLocation = ""
	            //we need to use the searchform object in order to list UOX IDs for compounds
            	//cherry pick the form and schema elements
                //$scope.searchFormSchema = angular.copy($scope.cbh.projects.searchform);
	            $scope.searchFormSchema = $scope.schemaFormHolder;

	            $scope.showWellForm = function(well){
	            	$scope.selectedWell = well;
					$scope.wellForm = well;
					updateFields();
					$rootScope.$broadcast('schemaFormRedraw');
					         	
	            }

	            $scope.clearWell = function(wellFormFE){
                    var row = angular.copy($scope.selectedWell.row);
                    console.log($scope.selectedWellLocation.row)
                    var col = angular.copy($scope.selectedWell.col);
                    console.log($scope.selectedWellLocation.col)
	            	$scope.plateForm.wells[$scope.selectedWellLocation] = {
                                'row': row,
                                'col': col,
                                'hasData': false,
                                'related_molregno__chembl__chembl_id__in': [],
                                'justCleared': true,
                            };
                    console.log('wellFormFE',wellFormFE)
                    console.log('well on plate',$scope.plateForm.wells[$scope.selectedWellLocation])
                    
                    updateFields();
                    $rootScope.$broadcast('schemaFormRedraw');
                    wellFormFE.$setPristine();

	            }

                $scope.isWellSelected = function(well, form) {
                    if ($scope.selectedWell.row + $scope.selectedWell.col == well) {
                        $scope.selectedWellLocation = well;
                        $scope.wellForm = form.wells[$scope.selectedWellLocation]
                        return true
                    }
                    return false
                }

                $scope.wellHasData = function(well, form) {
                    return form.wells[well].hasData;
                }

                $scope.saveWell = function(wellFormFE){
	            	//wellForm contains currently added well data
	            	//add this to the selectedWell
                    angular.extend($scope.plateForm.wells[$scope.selectedWellLocation], $scope.wellForm);
                    if(!$scope.plateForm.wells[$scope.selectedWellLocation].justCleared){
                        $scope.plateForm.wells[$scope.selectedWellLocation].hasData = true
                    }
	            	$scope.plateForm.wells[$scope.selectedWellLocation].justCleared = false
	            	
	            	//make well form pristine
                    wellFormFE.$setPristine();


	            }

	            function updateFields() {
	                if ($scope.wellForm.related_molregno__chembl__chembl_id__in) {
	                    $scope.searchFormSchema.well_schema.properties.related_molregno__chembl__chembl_id__in.items = $scope.wellForm.related_molregno__chembl__chembl_id__in.map(function(i) {
	                        return {
	                            value: i,
	                            label: i
	                        }
	                    });
                        $rootScope.$broadcast('schemaFormRedraw');
	                }
                    else {
                        $scope.searchFormSchema.well_schema.properties.related_molregno__chembl__chembl_id__in.items = [];
                    }

	            }
                $scope.showWellForm($scope.plateForm.wells["A1"]);
                /*updateFields();
                $rootScope.$broadcast('schemaFormRedraw');*/
                //need an event to updateFields when the plate model has changed
                /*$rootScope.$on("plateChanged", function(event, args){
                    console.log('plate changed');
                    //updateFields();
                    //$rootScope.$broadcast('schemaFormRedraw');
                    $scope.showWellForm($scope.plateForm.wells["A1"]);
                    //hide the form
                    
                });*/
                $scope.$watch('plateForm', function() {
                    $scope.showWellForm($scope.plateForm.wells["A1"]);
                });
            }]
        };
    }]);