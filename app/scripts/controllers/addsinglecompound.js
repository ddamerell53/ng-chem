'use strict';

/**
 * @ngdoc function
 * @name ngChemApp.controller:AddsinglecompoundCtrl
 * @description
 * # AddsinglecompoundCtrl
 * Controller of the ngChemApp
 */
angular.module('chembiohubAssayApp')
    .controller('AddSingleCompoundCtrl', ['$scope', '$rootScope', '$timeout', '$filter', 'CBHCompoundBatch', 'ProjectFactory', 'projectKey', function($scope, $rootScope, $timeout, $filter, CBHCompoundBatch, ProjectFactory, projectKey) {

            //need a combination of the initial setup of the add compounds page and the edit part of the single mol popup

            $scope.editMode = false;
            $scope.mol = {
            	molecule: "",
            	customFields: [],
            	supplementaryFields: [],
            }
            $scope.readyToSave = false;
            var orderBy = $filter('orderBy');

            var projid = projectKey;
            $scope.projectWithCustomFieldData;
            angular.forEach($rootScope.projects, function(myproj) {
                if (myproj.project_key == projid) {
                    $scope.projectWithCustomFieldData = myproj;
                    $scope.projectWithCustomFieldData.updateCustomFields();
                    $scope.projectObj = myproj;
                }
            });
            /*$scope.singleForm = false;

            angular.forEach($scope.projectWithCustomFieldData.schemaform.form, function(formItem) {
            	
                $scope.singleForm = [angular.copy(formItem)];
            
            });*/


            var myform = $scope.projectWithCustomFieldData.schemaform.form;

            var len = Math.ceil(myform.length / 2);
            $scope.firstForm = angular.copy(myform).splice(0, len);
            $scope.secondForm = angular.copy(myform).splice(len);
            $scope.myform2 = angular.copy(myform);
            $scope.init = function() {
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
            $scope.init();



            $scope.removeAlert = function() {
                $scope.update_success = false;
            }
            $scope.updateBatch = function(instance) {

                CBHCompoundBatch.patch({
                    "customFields": $scope.mol.customFields,
                    "projectKey": $scope.projectWithCustomFieldData.project_key,
                    "id": $scope.mol.id
                }).then(
                    function(data) {

                        $scope.mol.customFields = data.customFields;
                        //mol.customFields = data.customFields;
                        //reindex the compound
                        CBHCompoundBatch.reindexModifiedCompound($scope.mol.id).then(function(d) {
                            //Make sure all the custom fields have been updated

                        });
                        $scope.update_success = true;
                        $scope.editMode = false;
                        $scope.init();
                        $timeout($scope.removeAlert, 5000);
                        cbh.isUpdated = true;
                        if (angular.isDefined(instance)) {
                            instance.dismiss('cancel');
                        }

                    }
                );
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


        /*}).result.finally(function() {
            if (cbh.isUpdated) {
                $rootScope.$broadcast("updateListView");
            }
        });*/

    }]);