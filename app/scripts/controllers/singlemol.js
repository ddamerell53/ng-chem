'use strict';

/**
 * @ngdoc controller
 * @name chembiohubAssayApp.controller:SinglemolCtrl
 * @description
 * # SinglemolCtrl
 * This controller handles fetching, editing and cloning data for viewing a single record within a modal window (which has its own route).
 */
angular.module('chembiohubAssayApp')
    .controller('SinglemolCtrl', ['$scope', '$rootScope', '$modalInstance', '$timeout', 'CBHCompoundBatch', 'ProjectFactory', '$cookies', 'FlowFileFactory', '$filter', '$stateParams', 'urlConfig', '$state', '$window', 'projectList',
        function($scope, $rootScope, $modalInstance, $timeout, CBHCompoundBatch, ProjectFactory, $cookies, FlowFileFactory, $filter, $stateParams, urlConfig, $state, $window, projectList) {
            
            var mol = {}
            $scope.mol = {}
            var myform, len;



            //TODO handle error here
            $http.get(urlConfig.cbh_compound_batches_v2.list_endpoint + "/" + $stateParams.uniqId + "/").then(function(data) {


                mol = angular.copy(data.data);
                $scope.isNewCompoundsInterface = false;
                
                $scope.mol = angular.copy(mol);
                
                var projid = mol.projectfull.id;
                
                $scope.projectWithCustomFieldData;
                angular.forEach(projectList.objects, function(myproj) {
                    if (myproj.id == projid) {
                        $scope.projectWithCustomFieldData = myproj;
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
                if($stateParams.edit){
                    var fieldName = $stateParams.edit.substring(14,$stateParams.edit.length)
                    angular.forEach(myform, function(f){
                        if(f.key == fieldName){
                            $scope.firstForm = [angular.copy(f)];
                            $scope.secondForm = [];
                            $scope.myform2 = angular.copy($scope.firstForm);
                            $scope.init();

                            $scope.myschema = angular.copy($scope.projectWithCustomFieldData.schemaform.schema);
                            
                            $scope.modalInstance = $modalInstance;
                        }
                    });
                    
                    $scope.editMode = true;
                }else{
                    $scope.editMode = false;
                    $scope.firstForm = angular.copy(myform).splice(0, len);
                    $scope.secondForm = angular.copy(myform).splice(len);
                    $scope.myform2  = angular.copy(myform);
                    $scope.init();

                    $scope.myschema = angular.copy($scope.projectWithCustomFieldData.schemaform.schema);
                            
                    $scope.modalInstance = $modalInstance;
                    
                }
                

                

                 
                    

                $timeout(function(){
                    $scope.$apply();
                })

            });

            /*$scope.fileInit = function(form_key){
                //need to transplant the items in item.value.attachments to item.attachments
                //so that the file upload directive can see them
                $scope.mol.indexed_fields[form_key[0]].attachments = $scope.mol.custom_fields[form_key[0]].value.attachments
                
            }*/

            $scope.success = function(file, form_key) {
                //apply the urls of the flowfile object to the correct custom field of $scope.mol.customFields - find the attachments array and add it
                //put a new method in FlowFileFactory
                //need to modify this so that the items are added to the value part of the schema item returned by the API
                //TODO handle error here
                
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
                    //so that the schema form file upload plugin can see the files
                    $scope.mol.custom_fields[form_key[0]].attachments.push(attachment_obj)
                    //also push to the value part for the form itself
                    //$scope.mol.indexed_fields[form_key[0]].value.attachments.push(attachment_obj)

                })

            }

            $scope.removeFile = function(form_key, index, url) {
                $scope.mol.custom_fields[form_key[0]].attachments = $filter('filter')($scope.mol.custom_fields[form_key[0]].attachments, function(value, index) {
                    return value.url !== url; })
                //$scope.mol.custom_fields[form_key[0]].value.attachments = $filter('filter')($scope.mol.custom_fields[form_key[0]].value.attachments, function(value, index) {
                //    return value.url !== url; })
            }

            //use this to check the file size. Is passed through to the schema form file upload directive via cbh_core_model/models.py
            $scope.sizeCheck = function(file, form_key){
                
                //get the file
                
                if (file.size > 20000000) {
                    //cancel the file
                    file.flowObj.removeFile(file);
                    //get the form element ad change the validation message, mark as invalid
                    alert("This system has a file size limit of 20Mb per file. Please try with a smaller file.");
                    return false;
                    

                }
                
            }

            $scope.openClone = function() {
                
                if ($scope.mol.projectfull.project_type.show_compounds) {
                    //If this is a compounds project redirect to compound clone page
                    
                    $state.go("cbh.projects.project.addsingle", { 'projectKey': $scope.mol.projectfull.project_key, idToClone: $scope.mol.id }, { reload: true });
                } else {
                    $rootScope.$broadcast("cloneAnItem", mol);
                    $modalInstance.dismiss("cancel");
                }

            }

            $scope.enterEditMode = function(edit){
              if(edit == true){
                $scope.editMode = true;
              }
              else {
                $scope.editMode = false;              
              }
              $scope.mol = angular.copy(mol);
              $scope.$apply();
              
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
            $scope.closeInstance = false;
            $scope.updateBatch = function() {
                //TODO handle error here
                CBHCompoundBatch.patch($scope.mol ).then(
                    function(data) {
                        $scope.update_success = true;
                        $scope.editMode = false;
                        $scope.init();
                        $timeout($scope.removeAlert, 5000);
                        $scope.isUpdated = true;
                        if ($scope.closeInstance == true) {
                            $scope.modalInstance.dismiss('cancel');
                            $rootScope.$broadcast("filtersUpdated",{});
                        }

                    }
                );
            }

            $scope.cancel = function() {
                //clear mol, redraw schema form to remove cached data from file upload plugin then dismiss instance
                $scope.mol = {}
                $scope.$broadcast('schemaFormRedraw');
                $scope.modalInstance.dismiss('cancel');
                if($scope.isUpdated){
                    $rootScope.$broadcast("filtersUpdated",{});
                }else{
                    
                }
            }

            //validation of form happens here
            $scope.errormess = "";
            //$scope.doArchiveItem = false;

            $scope.validateFormData = function(myEditedForm){
                
                $scope.errormess = "";
                //this step is necessary to ensure that required fields have data
                //and for validation check on the form as a whole to fail if required fields are missing
                //don't look for this in the angular schema form examples - it's not there...
                $scope.$broadcast("schemaFormValidate");
                if(myEditedForm.$valid && !myEditedForm.$pristine){
                    $scope.updateBatch();
                }
                else if(myEditedForm.$pristine){
                    $scope.errormess = "You must add some data before you can submit your form.";
                }
                else {
                    $scope.errormess = "You have required fields missing or incorrect data - please correct these and try again.";
                }
                //TODO: account for string being too long for text field length (1028 chars)

            };
        }
    ]);