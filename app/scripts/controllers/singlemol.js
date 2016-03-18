'use strict';

/**
 * @ngdoc function
 * @name chembiohubAssayApp.controller:SinglemolCtrl
 * @description
 * # SinglemolCtrl
 * Controller of the chembiohubAssayApp
 */
angular.module('chembiohubAssayApp')
    .controller('SinglemolCtrl', ['$scope', '$rootScope', '$modalInstance', '$timeout', 'CBHCompoundBatch', 'ProjectFactory', '$cookies', 'FlowFileFactory', '$filter', '$stateParams', 'urlConfig', '$state', '$window', 'projectList',
        function($scope, $rootScope, $modalInstance, $timeout, CBHCompoundBatch, ProjectFactory, $cookies, FlowFileFactory, $filter, $stateParams, urlConfig, $state, $window, projectList) {
            console.log('stateParams In Controller', $stateParams);
            var mol = {}
            $scope.mol = {}
            var myform, len;
            $scope.editMode = false;

            $http.get(urlConfig.cbh_compound_batches.list_endpoint + "/" + $stateParams.uniqId + "/").then(function(data) {


                mol = angular.copy(data.data);
                console.log('cbh in controller', $scope.cbh)
                $scope.isNewCompoundsInterface = false;
                
                $scope.mol = angular.copy(mol);
                
                var projid = mol.projectfull.id;
                console.log(projid);
                $scope.projectWithCustomFieldData;
                angular.forEach(projectList.objects, function(myproj) {
                    console.log(myproj)
                    if (myproj.id == projid) {
                        $scope.projectWithCustomFieldData = myproj;
                         $scope.projectWithCustomFieldData.updateCustomFields();
                        $scope.projectObj = myproj;

                    }
                });
                $scope.singleForm = false;

                var editingOnlyProperty = false;
                /*if($stateParams.edit == true){
                  //editingOnlyProperty = true;
                  $scope.editMode = true;
                }*/
                if (editingOnlyProperty) {
                    angular.forEach($scope.projectWithCustomFieldData.schemaform.form, function(formItem) {
                        if (formItem.key === editingOnlyProperty.split(".")[1]) {
                            $scope.singleForm = [angular.copy(formItem)];
                        }
                    });
                }

                myform = $scope.projectWithCustomFieldData.schemaform.form;

                len = Math.ceil(myform.length / 2);
                $scope.firstForm = angular.copy(myform).splice(0, len);
                $scope.secondForm = angular.copy(myform).splice(len);
                $scope.myform2 = angular.copy(myform);

                $scope.init();

                $scope.myschema = $scope.projectWithCustomFieldData.schemaform.schema;
                $scope.modalInstance = $modalInstance;

            });

            $scope.success = function(file, form_key) {
                //apply the urls of the flowfile object to the correct custom field of $scope.mol.customFields - find the attachments array and add it
                //put a new method in FlowFileFactory

                var AttachmentFactory = FlowFileFactory.cbhChemFlowFile;
                AttachmentFactory.get({
                    'identifier': file.uniqueIdentifier
                }, function(data) {
                    //add this to attachments in the form element (find it by form key in mol.customFields)
                    var downloadUri = data.download_uri
                    var attachment_obj = {
                        url: downloadUri,
                        printName: file.name,
                        mimeType: file.file.type,
                    }
                    $scope.mol.custom_fields[form_key[0]].attachments.push(attachment_obj)

                })

            }

            $scope.removeFile = function(form_key, index, url) {
                $scope.mol.custom_fields[form_key[0]].attachments = $filter('filter')($scope.mol.custom_fields[form_key[0]].attachments, function(value, index) {
                    return value.url !== url; })
            }

            $scope.openClone = function() {
                $modalInstance.dismiss("cancel");
                if ($scope.projectObj.project_type.show_compounds) {
                    //If this is a compounds project redirect to compound clone page
                    $state.go("cbh.projects.project.addsingle", { 'projectKey': $scope.projectObj.project_key, idToClone: $scope.mol.id }, { reload: true });
                } else {
                    $rootScope.$broadcast("cloneAnItem", mol)
                }

            }

            $scope.enterEditMode = function(edit){
              if(edit == true){
                $scope.editMode = true;
              }
              else {
                $scope.editMode = false;              
              }
              $scope.$broadcast('schemaFormRedraw');
              
            }




            $scope.init = function() {
                $scope.keyValues = $scope.myform2.map(

                    function(item) {
                        var key = item;
                        if (angular.isDefined(item.key)) {
                            key = item.key
                        };
                        var value = "";
                        if (angular.isDefined($scope.mol.custom_fields[key])) {


                            value = $scope.mol.custom_fields[key]
                        }
                        if (value.constructor === Array) {
                            value = value.join(", ");
                        }
                        //need to also return the format so we can differentiate file upload fields
                        var isFileField = false;
                        //only file fields have the 'default' attribute (at the moment)
                        var attachments = [];
                        if (item.default) {
                            isFileField = true;
                            //also need to rearrange value so it's not a string representation
                            attachments = item.default.attachments;

                        }
                        return {
                            'key': key,
                            'value': value,
                            'isFileField': isFileField,
                            'attachments': attachments
                        };
                    }
                );

                $scope.firstList = $scope.keyValues.splice(0, len);
                $scope.secondList = $scope.keyValues;

                $scope.$broadcast('schemaFormRedraw');


            };




            $scope.removeAlert = function() {
                $scope.update_success = false;
            }
            $scope.isUpdated = false;
            $scope.updateBatch = function(instance) {
                CBHCompoundBatch.patch({
                    "customFields": $scope.mol.customFields,
                    "projectKey": $scope.projectWithCustomFieldData.project_key,
                    "id": $scope.mol.id
                }).then(
                    function(data) {
                        $scope.mol.customFields = data.customFields;
                        mol.customFields = data.customFields;
                        //reindex the compound
                        CBHCompoundBatch.reindexModifiedCompound($scope.mol.id).then(function(d) {
                            //Make sure all the custom fields have been updated

                        });
                        $scope.update_success = true;
                        $scope.editMode = false;
                        $scope.init();
                        $timeout($scope.removeAlert, 5000);
                        $scope.isUpdated = true;
                        if (angular.isDefined(instance)) {
                            instance.dismiss('cancel');
                        }

                    }
                );
            }

            $scope.cancel = function() {
                //clear mol, redraw schema form to remove cached data from file upload plugin then dismiss instance
                $scope.mol = {}
                $scope.$broadcast('schemaFormRedraw');
                $scope.modalInstance.dismiss('cancel');
            }
        }
    ]);