'use strict';

/**
 * @ngdoc directive
 * @name chembiohubAssayApp.directive:platemap
 * @description
 * # platemap
 */
angular.module('chembiohubAssayApp')
    .directive('platemap',['$filter', 'CBHCompoundBatch', '$stateParams', function($filter, CBHCompoundBatch, $stateParams) {
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
            controller: ["$scope","$rootScope","$filter","CBHCompoundBatch",'$stateParams',function($scope, $rootScope, $filter, CBHCompoundBatch, $stateParams) {
                console.log("plateForm is ", $scope.plateForm);
                if (parseInt($scope.plateForm["Plate Size"]) == 96) {
                    console.log('parsing')
                    $scope.rows = ["A", "B", "C", "D", "E", "F", "G", "H", ];
                    $scope.cols = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", ];
                } else if (parseInt($scope.plateForm["Plate Size"] == 48)) {
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
                                'uuid': [],
                            }

                        })
                    })
                }
                //blank well for reference
                console.log("plateForm wells is now ", $scope.plateForm.wells);

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
					//updateFields();
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
                                'uuid': [],
                                'justCleared': true,
                            };
                    console.log('wellFormFE',wellFormFE)
                    console.log('well on plate',$scope.plateForm.wells[$scope.selectedWellLocation])
                    
                    //updateFields();
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

                //need to implement this as the click function for the filtered dropdown for the UOX ID lookup
                $scope.$on("openedSearchDropdown", function(event, args){
                    var filters = angular.copy($stateParams);
                    /*var activeCol = null;
                    angular.forEach($scope.cbh.tabular_data_schema, function(c){
                        if(c.showFilters){
                            activeCol = c;
                        }
                    });*/
                //call to fetch uuid autocomplete results looks like this:
                //http://localhost:9000/dev/cbh_compound_batches_v2?autocomplete=&autocomplete_field_path=uuid&compoundBatchesPerPage=50&encoded_query=W10%3D&limit=50&offset=0&page=1&pids=3
                    filters.autocomplete_field_path = 'uuid';
                    filters.autocomplete = args.autocomplete;
                    CBHCompoundBatch.queryv2(filters).then(function(result) {
                        //this is broadcasting to a dynamic $on method within the pickfromlist widget (within cbh_angular_schema_form_extension.js)
                        //which is why if you look for the braodcast name elsewhere you won't find it.
                        //it looks for the name defined in dataArrivesEventName within the schema form element
                        $rootScope.$broadcast("autoCompleteData", result);
                    });
                    
                })
                
                //this function should now be the onChange of the filtereddropdown field
	            /*function updateFields() {
	                if ($scope.wellForm.uuid) {
	                    $scope.searchFormSchema.well_schema.properties.uuid.items = $scope.wellForm.uuid.map(function(i) {
	                        return {
	                            value: i,
	                            label: i
	                        }
	                    });
                        $rootScope.$broadcast('schemaFormRedraw');
	                }
                    else {
                        $scope.searchFormSchema.well_schema.properties.uuid.items = [];
                    }

	            }*/
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