'use strict';

/**
 * @ngdoc function
 * @name ngChemApp.controller:AddsinglecompoundCtrl
 * @description
 * # AddsinglecompoundCtrl
 * Controller of the ngChemApp
 */


angular.module('chembiohubAssayApp')
    .controller('AddSingleCompoundCtrl', ['$scope', '$rootScope', '$timeout', '$filter', '$state', '$stateParams', 'CBHCompoundBatch', 'ProjectFactory', 'MessageFactory', 'projectKey', 'mol', function($scope, $rootScope, $timeout, $filter, $state, $stateParams, CBHCompoundBatch, ProjectFactory, MessageFactory, projectKey, mol) {

            //need a combination of the initial setup of the add compounds page and the edit part of the single mol popup
              $scope.clonedMol = angular.copy(mol);
                    mol.molecule = mol.ctab;
                    mol.id = null;
                    $scope.mol = mol;
                 if($scope.clonedMol.id){
                    $scope.idToClone = $scope.clonedMol.id;
                 }

            $scope.editMode = false;
            var detectIE =function() {
                var ua = window.navigator.userAgent;
                console.log(ua)
                var msie = ua.indexOf('MSIE ');
                if (msie > 0) {
                    // IE 10 or older => return version number
                    return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
                }

                var trident = ua.indexOf('Trident/');
                if (trident > 0) {
                    // IE 11 => return version number
                    var rv = ua.indexOf('rv:');
                    return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
                }

                var edge = ua.indexOf('Edge/');
                if (edge > 0) {
                   // Edge (IE 12+) => return version number
                   return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
                }

                // other browser
                return false;
            }
            $scope.isIE = detectIE();

            if($stateParams.idToClone){
                $scope.idToClone = $stateParams.idToClone;
                CBHCompoundBatch.get( $stateParams.idToClone ).then(function(data){
                    $scope.clonedMol = angular.copy(data);
                    data.molecule = data.ctab;
                    data.id = null;
                    $scope.mol = data;
                    if($scope.mol.blindedBatchId){
                        $scope.previousId = angular.copy($scope.mol.blindedBatchId);
                    }else{
                        $scope.previousId = angular.copy($scope.mol.chemblId);
                    }
                    $scope.$broadcast("fetchMolecule");
                });
            }else{
                $scope.mol = {
                    molecule: "",
                    customFields: {},
                    supplementaryFields: [],
                }
            }
            
            $scope.dataReady = false;
            $scope.compoundBatches = {data:[], 
                sorts:[],
                excluded: [],
                redraw: 0,
                columns: []};
            var orderBy = $filter('orderBy');

            var projid = projectKey;
            $scope.projectWithCustomFieldData;
            console.log(projid);
            angular.forEach($rootScope.projects, function(myproj) {
                if (myproj.project_key === projid) {
                    $scope.projectWithCustomFieldData = myproj;
                    $scope.projectWithCustomFieldData.updateCustomFields();
                    $scope.projectObj = myproj;
                }
            });

            var myform = $scope.projectWithCustomFieldData.schemaform.form;

            var len = Math.ceil(myform.length / 2);
            $scope.firstForm = angular.copy(myform).splice(0, len);
            $scope.secondForm = angular.copy(myform).splice(len);
            $scope.myform2 = angular.copy(myform);

            /*$scope.init = function() {
                $scope.keyValues = $scope.myform2.map(

                    function(item) {
                        var key = item;
                        if (angular.isDefined(item.key)) {
                            key = item.key
                        };
                        var value = "";
                        if (angular.isDefined($scope.mol.customFields[key])) {


                            value = $scope.mol.customFields[key]

                        }
                        if (value.constructor === Array) {
                            value = value.join(", ");
                        }
                        return {
                            'key': key,
                            'value': value
                        };
                    }
                );

                $scope.firstList = $scope.keyValues.splice(0, len);
                $scope.secondList = $scope.keyValues;

            };
            $scope.init();*/

            $scope.createMultiBatch = function(){
                $scope.currentlyLoading = true;
                CBHCompoundBatch.createMultiBatch(
                    $scope.dataset).then(
                        function(data){
                            $scope.currentlyLoading = false;
                            $scope.filesInProcessing = false;
                            $scope.dataset.config = data.data;
                            $scope.dataReady = true;
                            //$scope.compoundBatches.uncuratedHeaders = data.data.headers;
                           

                            //$scope.imageCallback();
                            $scope.compoundBatches.data =data.data.objects;
                            $scope.compoundBatches.savestats = data.data.savestats;
                            //$scope.totalCompoundBatches = data.data.batchstats.total;


                            //Here we change the URL without changing the state
                             /*$state.go ($state.current.name, 
                                    {"mb_id" : $scope.dataset.config.multiplebatch,
                                    "projectKey": $stateParams.projectKey}, 
                                    { location: true, 
                                        inherit: false, 
                                        relative: $state.$current, 
                                        notify: true });*/
                            // $stateParams.mb_id = $scope.datasets[$scope.current_dataset_id].config.multiplebatch;

                            //returns a multiple batch id and a status
                            //Run a second get request to get a list of compounds
                        },
                        function(error){
                            
                            $scope.dataset.config.errors = [MessageFactory.getMessage("data_not_processed")];
                            
                            $scope.dataset.config.status = "add";
                            $scope.dataReady = false;
                            $scope.currentlyLoading = false;

                 }); 
            }



            $scope.removeAlert = function() {
                $scope.update_success = false;
            }

            //validate the drawn compound using the same mechanism as validation from file
            $scope.validateDrawn  = function(){
                var conf = {
                        "multiplebatch": null,
                        "sketch": $scope.mol.molecule,
                        "type": "sketch",
                        "customFields": $scope.mol.customFields,
                        "supplementaryFields": $scope.mol.supplementaryFields,
                        "projectKey" : projectKey,
                        "struccol" : "",
                        "state" : "validate"};
                //also need to get the project and supplementary field data through
                $scope.dataset = {
                    "config": conf,
                    "cancellers" : []
                };
                $scope.createMultiBatch();
            }

            $scope.saveTemporaryCompoundData = function(doArchiveItem){
                $scope.currentlyLoading = true;
                var callback = function(){
                    $state.transitionTo("cbh.search", 
                                        {multiple_batch_id: $scope.dataset.config.multiplebatch, 
                            projectFrom: projectKey, project__project_key__in: projectKey},
                            { location: true, 
                                inherit: false, 
                                relative: null, 
                                notify: true }
                            );
                }
                CBHCompoundBatch.saveMultiBatchMolecules($scope.dataset.config).then(
                        function(data){
                            $scope.cbh.hideSearchForm=true;
                            if($scope.previousId && doArchiveItem){
                               $scope.clonedMol.properties.archived = "true";
                               $scope.clonedMol.projectKey = $scope.projectWithCustomFieldData.project_key;
                               CBHCompoundBatch.patch($scope.clonedMol).then(function(data) {
                                    CBHCompoundBatch.reindexModifiedCompound(data.id).then(function(reindexed) {
                                        callback();
                                    });
                                }, function(error){
                                    $scope.currentlyLoading = false;
                                });
                                
                            }else{
                                callback();
                            }
                            
                            
                            

                        }, function(error){
                            $scope.currentlyLoading = false;
                        }
                    )       
            }

            $scope.addSupplementaryField = function(){
            	//do we have any supplementary fields already?
            	if ($scope.mol.supplementaryFields.length > 0){
            		//order the supplementary fields by id
            		$scope.mol.supplementaryFields = orderBy($scope.mol.supplementaryFields, 'id');
            		//get the last item in the list's ID
            		angular.forEach($scope.mol.supplementaryFields, function(supField, sindex){
            			
            			console.log('supfield', supField)
            			console.log('index', sindex)
            			if (sindex == ($scope.mol.supplementaryFields.length - 1)){
            				//increment that number by 1
            				var newId = (supField.id + 1);
            				console.log(newId);
            				//create a new object with that ID
	            			//push to supplementaryFields
            				$scope.mol.supplementaryFields.push({
								id: newId,
								name: "",
								value: "",
							});
            			}
            		});
	            	
	            	
            	}
            	else {
            		//add the first one
					$scope.mol.supplementaryFields.push({
						id: 0,
						name: "",
						value: "",
					});          		
            	}
            	
            };
            $scope.removeSupplemetaryField = function(removeid){
            	//pop item with this ID from supplementary fields
            	console.log(removeid);

            	var itemToRemove = $filter('filter')($scope.mol.supplementaryFields, {id: removeid}, true);
            	$scope.mol.supplementaryFields.splice( $scope.mol.supplementaryFields.indexOf(itemToRemove[0]), 1 );
            }
            $scope.myschema = $scope.projectWithCustomFieldData.schemaform.schema;


    }]);