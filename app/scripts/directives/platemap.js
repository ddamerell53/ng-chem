'use strict';

/**
 * @ngdoc directive
 * @name chembiohubAssayApp.directive:platemap
 * @restrict 'E'
 * @description
 * # platemap
 * Directive to render a 96 or 48 well plate map and allow a form for each well to be populated with data. 
 * When a well contains data, it changes colour (to green). Currently selected well has a red border.
 * @param {object} plateForm Information about the plate being rendered from a separate form (plate dimensions, name etc)
 * @param {object} schemaFormHolder Object containing the angular schema form config for the individual well forms.
 * @param {object} cbh The top level cbh object to help with globals and configuration
 * @param {function} savePlateFunction Pass-through function so that when the user saves the phole plate within the directive, 
 * the save functions etc can be called in the parent scope.
 * @param {boolean} plateSaved Boolean passthrough so the parent scope knows a plate has been saved - can be used for a list update callback if required.
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
                savePlateFunction: "&",
                plateSaved: "="
            },
            controller: ["$scope","$rootScope","$filter","CBHCompoundBatch",'$stateParams',function($scope, $rootScope, $filter, CBHCompoundBatch, $stateParams) {
                
                /**
                 * @ngdoc method
                 * @name chembiohubAssayApp.directive:platemap#$scope.initialisePlate
                 * @methodOf chembiohubAssayApp.directive:platemap
                 * @description
                 * Build the form to the specified dimensions. Currently builds 48 and 96 well plates.
                 * This beccomes the form for adding daata wells to.
                 * Must be possible to find the right algorithm to build if the ratios fit into a 3:2 grid... TODO
                 *
                 */
                $scope.initialisePlate = function(){
                    var plate_size = parseInt($scope.plateForm["Plate Size"]);
                
                    if (plate_size == 96) {
                        $scope.rows = ["A", "B", "C", "D", "E", "F", "G", "H", ];
                        $scope.cols = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", ];
                    } else if (plate_size == 48) {
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
                }
                $scope.initialisePlate();
                //blank well for reference

	            $scope.wellForm = {}
	            $scope.selectedWell = {}
	            $scope.selectedWellLocation = ""
                $scope.plateSaved = false;
	            //we need to use the searchform object in order to list UOX IDs for compounds
            	//cherry pick the form and schema elements
                //$scope.searchFormSchema = angular.copy($scope.cbh.projects.searchform);
	            $scope.searchFormSchema = $scope.schemaFormHolder;

                /**
                 * @ngdoc method
                 * @name chembiohubAssayApp.directive:platemap#$scope.showWellForm
                 * @methodOf chembiohubAssayApp.directive:platemap
                 * @description
                 * Adds data from a specified well and cuase a schema form re-render to show data.
                 * @param {object} well  the well object to populate into the form.
                 *
                 */
	            $scope.showWellForm = function(well){
                    $scope.plateSaved = false;
	            	$scope.selectedWell = well;
					$scope.wellForm = angular.copy(well);
					//updateFields();
					$rootScope.$broadcast('schemaFormRedraw');
					         	
	            }

                /**
                 * @ngdoc method
                 * @name chembiohubAssayApp.directive:platemap#$scope.clearWell
                 * @methodOf chembiohubAssayApp.directive:platemap
                 * @description
                 * Remove all information from the specified well form and reset to pristine state. Also trigger a schema form redraw to re-render form elements.
                 * @param {object} wellFormFE  the form object to be reset to a pristine state
                 *
                 */
	            $scope.clearWell = function(wellFormFE){
                    var row = angular.copy($scope.selectedWell.row);
                    var col = angular.copy($scope.selectedWell.col);
	            	$scope.plateForm.wells[$scope.selectedWellLocation] = {
                                'row': row,
                                'col': col,
                                'hasData': false,
                                'uuid': [],
                                'justCleared': true,
                            };
                    
                    //updateFields();
                    $rootScope.$broadcast('schemaFormRedraw');
                    wellFormFE.$setPristine();

	            }

                /**
                 * @ngdoc method
                 * @name chembiohubAssayApp.directive:platemap#$scope.isWellSelected
                 * @methodOf chembiohubAssayApp.directive:platemap
                 * @description
                 * Remove all information from the specified plate form and reset to pristine state.
                 * @param {object} well  the form object to be reset to a pristine state
                 * @param {object} form  the form object to be reset to a pristine state
                 *
                 */
                $scope.isWellSelected = function(well, form) {
                    if ($scope.selectedWell.row + $scope.selectedWell.col == well) {
                        $scope.selectedWellLocation = well;
                        $scope.wellForm = form.wells[$scope.selectedWellLocation]
                        return true
                    }
                    return false
                }

                /**
                 * @ngdoc method
                 * @name chembiohubAssayApp.directive:platemap#$scope.wellHasData
                 * @methodOf chembiohubAssayApp.directive:platemap
                 * @description
                 * Remove all information from the specified plate form and reset to pristine state.
                 * @param {object} well  the form object to be reset to a pristine state
                 * @param {object} form  the form object to be reset to a pristine state
                 *
                 */
                $scope.wellHasData = function(well, form) {
                    return form.wells[well].hasData;
                }

                /**
                 * @ngdoc method
                 * @name chembiohubAssayApp.directive:platemap#$scope.saveWell
                 * @methodOf chembiohubAssayApp.directive:platemap
                 * @description
                 * Add information from the well form into the plate map form ready to save the whole plate.
                 * @param {object} wellFormFE  the html form object to add to the plate map model object.
                 *
                 */
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

                /**
                 * @ngdoc method
                 * @name chembiohubAssayApp.directive:platemap#$scope.doSavePlate
                 * @methodOf chembiohubAssayApp.directive:platemap
                 * @description
                 * Check that the currently selected well has data added to the plate map model, then call the function to PATCH the plate.
                 * @param {object} wellFormFE  the html form object to add to the plate map model object.
                 *
                 */
                $scope.doSavePlate = function(wellFormFE){
                    //has the current selected well got a dirty form but hasData == false?
                    //if so, mark that well as hasData so when saved and retrieved, well is green
                    if(wellFormFE.$dirty){
                        angular.extend($scope.plateForm.wells[$scope.selectedWellLocation], $scope.wellForm);
                        if(!$scope.plateForm.wells[$scope.selectedWellLocation].justCleared){
                            $scope.plateForm.wells[$scope.selectedWellLocation].hasData = true
                        }
                        $scope.plateForm.wells[$scope.selectedWellLocation].justCleared = false
                    }
                    //then use the save function
                    $scope.savePlateFunction();
                }

                //need to implement this as the click function for the filtered dropdown for the UOX ID lookup
                /**
                 * @ngdoc method
                 * @name chembiohubAssayApp.directive:platemap#$scope.$on
                 * @methodOf chembiohubAssayApp.directive:platemap
                 * @description
                 * This function pulls back the dropdown autocomplete data from the back end and sends it to the appropriate directive via a broadcast
                 * @param {string} openedSearchDropdown  the name of the broadcast to act on
                 * @param {function} callback  the callback function to trigger functionality
                 *
                 */
                $scope.$on("openedSearchDropdown", function(event, args){
                    var filters = angular.copy($stateParams);
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
                
                $scope.showWellForm($scope.plateForm.wells["A1"]);
                
                $scope.$watch('plateForm', function() {
                    //reinitialise plate layout where size changes
                    $scope.initialisePlate();
                    $scope.showWellForm($scope.plateForm.wells["A1"]);
                });

                
            }]
        };
    }]);