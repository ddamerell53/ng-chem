'use strict';

/**
 * @ngdoc function
 * @name chembiohubAssayApp.controller:DataoverviewCtrl
 * @description
 * # DataoverviewCtrl
 * Controller of the chembiohubAssayApp
 */
var showMappingPopupController = function($scope, $modalInstance, project_fields, sheet, $timeout, $filter, dataoverviewctrl) {
                        $scope.dataoverviewctrl = dataoverviewctrl;


                        $scope.project_fields = angular.copy(project_fields);
                        $scope.modded_project_fields = [];
                        $scope.modalInstance = $modalInstance;
                        $scope.sheet = sheet;
                        //limit project_field options to those which are not selected elsewhere, but still include the currently selected one (!)
                        angular.forEach($scope.project_fields, function(field) {
                            var added = false;
                            if (sheet.listOfUnmappedFields.indexOf(field.value) > -1) {
                                $scope.modded_project_fields.push(field);
                                added = true;
                            }
                            //is it this mapping?
                            if (field.value == dataoverviewctrl.col_being_mapped.attachment_field_mapped_to || (!added && field.value == null)) {
                                $scope.modded_project_fields.push(field);
                            }
                        });
                        // $scope.mapping = $scope.modded_project_fields[0];
                        //find the project field where the URI is the value
                        angular.forEach($scope.modded_project_fields, function(field) {

                            if (field.value == dataoverviewctrl.col_being_mapped.attachment_field_mapped_to) {
                                $scope.mapping = field;
                                $scope.oldRequired = angular.copy($scope.mapping.required);
                            }
                        });
                        $scope.setWarningMessage = function() {
                            var set = false;
                            angular.forEach($scope.modded_project_fields, function(field) {
                                if ($scope.dataoverviewctrl.col_being_mapped.attachment_field_unmappable_to == field.value) {
                                    $scope.dataoverviewctrl.col_being_mapped.warningMessage = "Attemped to map this field to " + angular.copy(field.name) + " but there are rows with unmappable data. Please correct and re-upload.";
                                    $scope.dataoverviewctrl.col_being_mapped.messageClass = "text-danger";
                                }
                            });
                        }
                        $scope.setWarningMessage();
                        $scope.cancel = function() {
                            $modalInstance.dismiss('cancel');
                        };
                        $scope.someMappingFunction = function() {
                            //store a copy of the field being mapped to in case we lose it after patching
                            if (!$scope.justChanged) {
                                if ($scope.mapping.value) {
                                    var splicing = sheet.listOfUnmappedFields.indexOf($scope.mapping.value);
                                    sheet.listOfUnmappedFields.splice(sheet.listOfUnmappedFields.indexOf($scope.mapping.value), 1);
                                    if ($scope.mapping.required) {
                                        sheet.listOfUnmappedMandatoryFields.splice(sheet.listOfUnmappedMandatoryFields.indexOf($scope.mapping.value), 1);
                                    }
                                }
                                if (dataoverviewctrl.col_being_mapped.attachment_field_mapped_to != $scope.mapping.value) {
                                    if (dataoverviewctrl.col_being_mapped.attachment_field_mapped_to != null) {
                                        sheet.listOfUnmappedFields.push(dataoverviewctrl.col_being_mapped.attachment_field_mapped_to);
                                        if ($scope.oldRequired) {
                                            sheet.listOfUnmappedMandatoryFields.push(dataoverviewctrl.col_being_mapped.attachment_field_mapped_to);
                                        }
                                    }
                                }
                                var name_of_field = $scope.mapping.name;
                                var copyToSend = angular.copy($scope.dataoverviewctrl.col_being_mapped);
                                copyToSend.attachment_field_mapped_to = $scope.mapping.value;
                                copyToSend.attachment_field_unmappable_to = null;
                                copyToSend.unmappable_rows = [];
                                $scope.dataoverviewctrl.col_being_mapped.unmappable_rows = [];
                                $scope.dataoverviewctrl.col_being_mapped.attachment_field_unmappable_to = null;
                                $scope.oldRequired = angular.copy($scope.mapping.required);
                                var promise = $http.patch(copyToSend.resource_uri,
                                    copyToSend
                                ).then(
                                function(data) {
                                        if (data.data.attachment_field_unmappable_to) {
                                            $scope.setWarningMessage();
                                            //we can't map this field.
                                            //re-add the field to the list of unmapped fields
                                            //if($scope.col_being_mapped.required) {
                                            if (copyToSend.attachment_field_mapped_to != null) {
                                                sheet.listOfUnmappedFields.push(angular.copy(copyToSend.attachment_field_mapped_to));
                                                if ($scope.mapping.required) {
                                                    sheet.listOfUnmappedMandatoryFields.push(angular.copy(copyToSend.attachment_field_mapped_to));
                                                }
                                            }
                                            //change the error message to say you still can't map that field
                                            $scope.mapping = $scope.modded_project_fields[0];
                                            //blur the select box to refresh
                                            sheet.setNewMapping(data.data);
                                            var selectBox = document.getElementById('field-selector');
                                            angular.element(selectBox).blur();
                                            // dataoverviewctrl.setNewMapping($scope.mapping.value);
                                            return data.data;
                                        } else {
                                            $scope.dataoverviewctrl.col_being_mapped.messageClass = "text-success";
                                            $scope.dataoverviewctrl.col_being_mapped.warningMessage = "Mapping saved";
                                            sheet.setNewMapping(data.data);
                                            return data.data;
                                        }
                                    },
                                    function(errorData) {

                                    }
                                );
                                return promise;
                            };
                        }




                        $scope.clearMapping = function(isRequiredField) {
                            //deselct the items from the ngmodel of the select box

                            $scope.mapping = $scope.modded_project_fields[0];

                            //clear the URI indicating the mapping from the file column
                            $scope.someMappingFunction();

                        }

                    }


var getSheetsByFile = function(dpc,fileId, $scope, FlowFileFactory, destroying, prefix, dataoverviewctrl) {
                        //perform get request to get list of sheets
                        //probably best to create a resource here - we will need it for other types of upload (img etc)
                        //FlowFileFactory.cbhFlowfile.
                        // dataoverviewctrl.setLoadingMessageHeight();
                        // dataoverviewctrl.currentlyLoading = true;
                        $scope.iamloading = true;
                        $scope.loadingMessage = "Loading File...";
                        var FlowDF = FlowFileFactory.cbhFlowfile;
                        dpc.uploadData.fileId = fileId;

                        var fdfresult = FlowDF.get({
                            'fileId': fileId
                        });
                        fdfresult.$promise.then(function(result) {
                            //dpc.uploadData.sheet_names = result.sheet_names;
                            if (fdfresult.original_filename.indexOf(".xlsx") ==-1){
                                dataoverviewctrl.errorPopup( "Incorrect file format. Please note only XLSX files are permitted.");
                                $scope.iamloading = false;
                                return
                            }
                            if( result.sheet_names.length == 0){
                                dataoverviewctrl.errorPopup( "No sheets found in file.");
                                $scope.iamloading = false;
                                return
                            }
                                
                            angular.forEach(result.sheet_names, function(sheet_name) {
                                /*newobj = {}
                                newobj.name = sheet_name*/

                                var sheet = {
                                    'name': sheet_name,
                                    active: false
                                };

                                sheet.listOfUnmappedFields = [];
                                sheet.listOfUnmappedMandatoryFields = [];

                                sheet.specifySheet = function() {
                                      
                                  if(!destroying) {
                                    if (!angular.isDefined(sheet.metadata)) {
                                        $scope.iamloading = true;
                                        $scope.loadingMessage = "Loading Sheet...";
                                        //we now have sheetName.name, pass to the specified webservice
                                        var AttachmentFactory = FlowFileFactory.cbhAttachments;
                                        /*
                                        flowfile: '@flowfile',
                                        data_point_classification:  "@data_point_classification",
                                        chosen_data_form_config: "@chosen_data_form_config",
                                        sheet_name: "@sheetname",
                                         */
                                        //Resource URIs are not obvious here - the flowfile one cannot be sent from backend as it proports to contain session id which must be kept private
                                        //The data point classification one is from the "nested resource" so is wrong

                                        var AttachmentFactory = FlowDF.save({
                                            'flowfile': '/' + prefix + '/datastore/cbh_flowfiles/' + dpc.uploadData.fileId,
                                            'data_point_classification': '/' + prefix + '/datastore/cbh_datapoint_classifications/' + dpc.id, //dpc
                                            'chosen_data_form_config': dpc.next_level_dfc.resource_uri,
                                            'sheet_name': sheet.name,

                                        }, function(result) {
                                            sheet.active = true;
                                            sheet.metadata = result;
                                            //sheet.listOfMappedFields = dpc.getListOfMappedFields(sheet.metadata.attachment_custom_field_config.project_data_fields);
                                            //dataoverviewctrl.listOfUnmappedFields = dataoverviewctrl.getListOfUnmappedFields(result.attachment_custom_field_config.project_data_fields, result.attachment_custom_field_config.titleMap);
                                            sheet.listOfUnmappedFields = sheet.getListOfUnmappedFields(result.attachment_custom_field_config.project_data_fields, result.titleMap)
                                            sheet.listOfUnmappedMandatoryFields = sheet.getListOfUnmappedMandatoryFields(result.attachment_custom_field_config.project_data_fields, result.titleMap)
                                            sheet.setTotalUnmapped();
                                            $scope.iamloading = false;
                                        });
                                    }
                                  }
                                }

                                sheet.setTotalUnmapped = function() {
                                    sheet.totalUnmapped = 0;
                                    sheet.totalMappingErrors = 0;
                                    angular.forEach(sheet.metadata.attachment_custom_field_config.project_data_fields, function(field) {
                                        if (field.attachment_field_mapped_to) {
                                            sheet.totalUnmapped++;
                                        }
                                        if (field.attachment_field_unmappable_to) {
                                            sheet.totalMappingErrors++;
                                        }
                                    });
                                }

                                sheet.setNewMapping = function(value) {

                                    var toSplice = 0;
                                    angular.forEach(sheet.metadata.attachment_custom_field_config.project_data_fields, function(field, index) {
                                        if (field.id == value.id) {
                                            toSplice = index;
                                        }
                                    });
                                    sheet.metadata.attachment_custom_field_config.project_data_fields[toSplice] = value;
                                    dataoverviewctrl.col_being_mapped = value;
                                    sheet.setTotalUnmapped();
                                };


                                sheet.saveSheet = function(sheet_id) {
                                        $scope.iamloading = true;
                                        $scope.loadingMessage = "Saving Sheet " + sheet.name + "...";
                                        angular.forEach(dpc.sheets, function(s){
                                          s.specifySheet = null;
                                        })
                                        $http.get('/' + prefix + '/datastore/cbh_attachments/save_temporary_data?sheetId=' + sheet_id).then(function(response) {
                                            $scope.iamloading = false;
                                            $state.go($state.current, $stateParams, {
                                                reload: true
                                            });


                                        });
                                    }
                                    //create a list of fields which still need a mapping
                                sheet.getListOfUnmappedFields = function(fields, map) {

                                    var fieldList = []

                                    //check each entry in title map - if it has no corresponding entry in any attachment field config, add it to the list
                                    angular.forEach(map, function(item) {

                                        var hasEntry = false;
                                        angular.forEach(fields, function(field) {
                                            if (field.attachment_field_mapped_to) {

                                                if (field.attachment_field_mapped_to == item.value || !item.value) {
                                                    hasEntry = true;
                                                }


                                            }

                                        });
                                        if (!hasEntry) {
                                            if (item.value) {
                                                fieldList.push(item.value)
                                            }
                                        }

                                    })

                                    return fieldList;
                                };
                                sheet.getListOfUnmappedMandatoryFields = function(fields, map) {

                                    var fieldList = []

                                    //check each entry in title map - if it has no corresponding entry in any attachment field config, add it to the list
                                    angular.forEach(map, function(item) {

                                        var hasEntry = false;
                                        angular.forEach(fields, function(field) {

                                            if (field.attachment_field_mapped_to != null) {

                                                if (field.attachment_field_mapped_to == item.value || !item.value) {
                                                    hasEntry = true;
                                                }


                                            }

                                        });
                                        if (!hasEntry && item.required) {
                                            if (item.value) {
                                                fieldList.push(item.value)
                                            }
                                        }

                                    })

                                    return fieldList;
                                };



                                dpc.uploadData.sheets.push(sheet);
                            })
                            dpc.uploadData.uploaded = true;


                        }, 
                        function(errorData){
                          //console.log(errorData.statusText + ": " + errorData.data.error);
                          //launch a popup
                          //$scope.loadingMessage = errorData.statusText + ": " + errorData.data.error;
                          dataoverviewctrl.errorPopup(errorData.data.error + ". Please note only XLSX files are permitted.");
                          $scope.iamloading = false;
                        });

                    }



angular.module('chembiohubAssayApp')
    .controller('DataOverviewCtrl', ['$scope', 'AddDataFactory', '$modal', '$resource', '$stateParams', '$state', '$timeout', '$interval', 'prefix', 'urlConfig', '$cookies', 'FlowFileFactory', 'DraftFactory', 'projectKey', '$filter',
        

        function($scope, AddDataFactory, $modal, $resource, $stateParams, $state, $timeout, $interval, prefix, urlConfig, $cookies, FlowFileFactory, DraftFactory, projectKey, $filter) {
           var dataoverviewctrl = this;

           dataoverviewctrl.success = function(file, form_key){
                //can I access the model for the attachment field? Yes
                
                //build a URL for this upload so that calling it from the view redirects through the correct resource
                //in order to check for project permissions, user permissions etc.
                //now add parts to the url indicating project, file.uniqueIdentifier, field name (and filename?)
                //add this to an object also containing mimetype data?
                //populate the object
                var AttachmentFactory = FlowFileFactory.cbhBaseAttachment;
                var url_string = ""

                var fdfresult = AttachmentFactory.save({
                                            'flowfile': '/' + prefix + '/datastore/cbh_flowfiles/' + file.uniqueIdentifier,
                                            'data_point_classification': '/' + prefix + '/datastore/cbh_datapoint_classifications/' + dataoverviewctrl.currentlyAddingTo.id, //dpc
                                        },function (data){
                                            url_string = data.resource_uri
                                            var attachment_obj = {
                                                url: url_string,
                                                printName: file.name,
                                                mimeType: file.file.type,
                                            }

                                            if(angular.isUndefined(dataoverviewctrl.currentlyAddingTo.new_next_level_model.project_data[form_key[0]])){
                                                dataoverviewctrl.currentlyAddingTo.new_next_level_model.project_data[form_key[0]] = {'attachments': []};
                                            }
                                            dataoverviewctrl.currentlyAddingTo.new_next_level_model.project_data[form_key[0]].attachments.push(attachment_obj);

                                        });
                
            }
            dataoverviewctrl.removeFile = function(form_key, index, url){
                //can I access the model for the attachment field? Yes

                if( angular.isUndefined(dataoverviewctrl.currentlyAddingTo.new_next_level_model.project_data[form_key[0]])){
                    dataoverviewctrl.currentlyAddingTo.new_next_level_model.project_data[form_key[0]] = {'attachments': []};
                }
                dataoverviewctrl.currentlyAddingTo.new_next_level_model.project_data[form_key[0]].attachments  = $filter('filter')(dataoverviewctrl.currentlyAddingTo.new_next_level_model.project_data[form_key[0]].attachments, function(value, index) {return value.url !== url;})

            }



            var destroying = false;
            $scope.$on('$destroy', function() {
                destroying = true;
            });
                $scope.cbh.appName = "AssayReg";

            
            var classes = {
                'l1': "l1",
                'l2': "l2"
            }
            $scope.iamloading = false;
            $scope.loadingMessage = "Loading..."
            $scope.modalInstance = {};
            $scope.popup_data = {};
            $scope.dpcForUpload = {};
            dataoverviewctrl.currentlyAddingTo = null;

            $scope.getAnnotations = function(dpc) {
                dpc.dfc_full = $scope.assayctrl.dfc_lookup[dpc.data_form_config];
                dpc.main_cfc = dpc.dfc_full[dpc.level_from];
                dpc.main_data = dpc[dpc.level_from];
                dpc.htmlClassName = classes[dpc.level_from];
                dpc.setChosenDataFormConfig = function(dfc_uri, adding, templateData) {
                    if(dataoverviewctrl.currentlyAddingTo != null && adding){
                        dataoverviewctrl.errorPopup("You are already adding to a different dataset or by a different method. Please cancel that form before continuing.")
                        return;
                    }
                    if(adding){
                        dataoverviewctrl.currentlyAddingTo = dpc;
                    }
                     
                    dpc.addingChild = adding;
                    dpc.next_level_dfc = $scope.assayctrl.dfc_lookup[dfc_uri];
                    dpc.next_level_cfc = dpc.next_level_dfc[dpc.next_level_dfc.last_level];
                    if (!angular.isDefined(templateData)) {
                        templateData = {
                            'project_data': {},
                            'custom_field_config': dpc.next_level_cfc.resource_uri
                        };
                    } else {
                        templateData.id = null;
                        templateData.resource_uri = null;
                    }
                    dpc.default_data = templateData;
                    dpc.next_level_edit_form = dpc.next_level_dfc.get_main_form();
                    dpc.next_level_edit_schema = dpc.next_level_dfc.get_main_schema();
                    dpc.new_next_level_model = angular.copy(dpc.default_data);
                    dpc.next_data_type_name = dpc.next_level_dfc[dpc.next_level_dfc.last_level].data_type.name;
                    dpc.next_level_searchnames = dpc.next_level_cfc.project_data_fields.map(function(field) {
                        return dpc.next_level_dfc.last_level + ".project_data." + field.elasticsearch_fieldname;
                    })
                    /*if(adding){
                        dataoverviewctrl.autosave = $interval(function(){dataoverviewctrl.saveDraft(dpc.new_next_level_model.project_data);}, 60000);    
                    }*/
                    
                }


                //setting up a method for setting up dfc for file upload
                //don't know what I do and don't need from this
                dpc.setChosenDataFormConfigMultiple = function(dfc_uri, adding, templateData) {
                    if(dataoverviewctrl.currentlyAddingTo != null && adding){
                        dataoverviewctrl.errorPopup("You are already adding to a different dataset or by a different method. Please cancel that form before continuing.");
                         return;
                    }
                    if(adding){
                        dataoverviewctrl.currentlyAddingTo = dpc;
                    }

                    dpc.addingMultiple = adding;
                    dpc.next_level_dfc = $scope.assayctrl.dfc_lookup[dfc_uri];
                    dpc.next_level_cfc = dpc.next_level_dfc[dpc.next_level_dfc.last_level];
                    if (!angular.isDefined(templateData)) {
                        templateData = {
                            'project_data': {},
                            'custom_field_config': dpc.next_level_cfc.resource_uri
                        };
                    } else {
                        templateData.id = null;
                        templateData.resource_uri = null;
                    }
                    dpc.default_data = templateData;
                    dpc.next_level_edit_form = dpc.next_level_dfc.get_main_form();
                    dpc.next_level_edit_schema = dpc.next_level_dfc.get_main_schema();
                    dpc.new_next_level_model = angular.copy(dpc.default_data);
                    dpc.next_data_type_name = dpc.next_level_dfc[dpc.next_level_dfc.last_level].data_type.name;
                    /*
                    ************************ 
                    STUFF FOR FILE UPLOAD UI
                    ************************ 
                    */

                    dpc.inputData = {
                        inputstring: ""
                    };
                    dpc.filedata = {};
                    dpc.filesUploading = false;
                    dpc.dataReady = false;


                    //object containing user config, selected options and flowfile metadata returned from ws callls
                    dpc.initUpload = function() {
                        dpc.uploadData = {

                            'uploaded': false,
                            'fileId': '',
                            'resource_uri': '',
                            'sheets': []

                        }
                    }
                    dpc.initUpload();


                    dpc.cancelFile = function() {
                        dpc.setChosenDataFormConfigMultiple(dfc_uri, false, templateData);
                        dataoverviewctrl.currentlyAddingTo = null;
                    }

                    dpc.getSheetsForFile = function(fileId){
                        getSheetsByFile(dpc, fileId, $scope, FlowFileFactory, destroying, prefix, dataoverviewctrl);
                    }




                    dpc.next_level_searchnames = dpc.next_level_cfc.project_data_fields.map(function(field) {

                        return dpc.next_level_dfc.last_level + ".project_data." + field.elasticsearch_fieldname;
                    })
                }

                dpc.cancel = function() {
                    if (dpc.dfc_full.permitted_children.length > 0) {
                        //Default to the first in the list for thios but reset it every time that someone 
                        dpc.setChosenDataFormConfig(dpc.dfc_full.permitted_children[0]);
                    }
                    dpc.addingChild = false
                    dataoverviewctrl.currentlyAddingTo = null;
                    //$interval.cancel(dataoverviewctrl.autosave);

                }

                if (dpc.dfc_full.permitted_children.length > 0) {
                    //Default to the first in the list for thios but reset it every time that someone 
                    dpc.setChosenDataFormConfig(dpc.dfc_full.permitted_children[0], false);
                    dpc.addingChild = false;

                }




                dpc.addDataToForm = function(data) {
                        dpc.addingChild = true;

                        dpc.setForm(data);

                    }
                    /*
                              dpc.editData = function(data){
                                dpc.addingChild = false;
                                dpc.setForm(data);
                              }*/
                    // dpc.setForm(dpc.default_data);
                dpc.addChild = function() {
                    dataoverviewctrl.setLoadingMessageHeight();
                    dataoverviewctrl.currentlyLoading = true;
                    var AddDF = AddDataFactory.dataClassification;

                    var adfresult = AddDF.get({
                        'dc': dpc.id
                    });
                    adfresult.$promise.then(function(clone) {

                        clone.children = [];
                        clone.id = null;
                        clone.resource_uri = null;
                        clone.parent_id = dpc.id;
                        clone[dpc.next_level] = dpc.new_next_level_model;
                        clone.data_form_config = dpc.next_level_dfc.resource_uri;
                        clone.$save(function(data) {
                            $state.go($state.current, $stateParams, {
                                reload: true
                            });
                        });
                    });
                };

                dpc.updateChild = function(child_dpc_id) {
                    dataoverviewctrl.setLoadingMessageHeight();
                    dataoverviewctrl.currentlyLoading = true;
                    var AddDF = AddDataFactory.dataClassification;
                    var adfresult = AddDF.get({
                        'dc': child_dpc_id
                    });
                    adfresult.$promise.then(function(clone) {
                        clone[dpc.next_level] = dpc.new_next_level_model;
                        clone.$update({
                            'dc': child_dpc_id
                        }, function(data) {
                            $state.go($state.current, $stateParams, {
                                reload: true
                            });
                        });
                    });
                }

                dpc.saveDraft = function(form_data){
                    console.log("Saving draft");
                    //save the contents of the form to either a django object or a redis cache object
                    var df = DraftFactory.save_draft
                    var dfresult = df.get({
                        //put the draft content to save here
                        'content': form_data
                    });
                    dfresult.$promise.then(function(data) {
                        //do stuff here to indicate draft has been saved (if the message comes back correctly)
                        console.log('dpc draft saved', data);
                    });

                }

                

                if (dpc.next_level_dfc.human_added) {
                    dpc.childrenTemplate = "views/templates/overview-children-table.html";
                } else {
                    dpc.childrenTemplate = "views/templates/overview-children.html";
                }

                $scope.dpcForUpload = dpc;


            };
            $scope.iterate_children = function(obj) {
                angular.forEach(obj.children, function(child, index) {
                    if (angular.isDefined(child.id)) {
                        child.parentObj = obj;

                        $scope.getAnnotations(child);
                        $scope.iterate_children(child);

                    }
                });
            }

            $scope.no_l0 = false;
            dataoverviewctrl.no_l0_dfc = false;
            dataoverviewctrl.fetchData = function() {
                 

                AddDataFactory.nestedDataClassification.get({
                        "project_key": $scope.assayctrl.proj.project_key,
                    },
                    function(data) {
                        if (data.objects.length >= 1) {
                            $scope.no_l0 = false;
                            dataoverviewctrl.no_l0_dfc = false;
                            dataoverviewctrl.l0_object = data.objects[0];

                            $scope.getAnnotations(dataoverviewctrl.l0_object);
                            $scope.iterate_children(dataoverviewctrl.l0_object);

                        } else {
                            $scope.no_l0 = true;
                            
                            if(!$scope.assayctrl.l0_dfc) {
                                dataoverviewctrl.no_l0_dfc = true;
                            }
                            else {
                                dataoverviewctrl.l0_object = angular.copy($scope.assayctrl.l0_dfc.template_data_point_classification);
                            }
                            
                        }


                    }
                );
            }


            dataoverviewctrl.openDetail = function(input_popup_data) {

                $scope.popup_data = angular.copy(input_popup_data);
                $scope.modalInstance = $modal.open({
                    templateUrl: 'views/modal-template.html',
                    size: 'lg',
                    resolve: {
                        popup_data: function() {
                            return $scope.popup_data;
                        },

                    },
                    controller: function($scope, $modalInstance, popup_data, $timeout) {
                        $scope.popup_data = popup_data;

                        $scope.modalInstance = $modalInstance;

                        $scope.expanded = ''

                        $scope.cancel = function() {
                            $modalInstance.dismiss('cancel');
                        };
                        $scope.toggleExpand = function(printName){
                            if($scope.expanded == printName){
                                $scope.expanded = '';
                            }
                            else {
                                $scope.expanded = printName;
                            }
                                                        
                        }

                        $scope.fetchImage = function(url){
                            //get the image from the backend
                            //using FlowFileFactory cbhBaseAttachment
                            //for now, return a static url placeholder
                            return url;
                        }

                    }
                });
            };

            dataoverviewctrl.errorPopup = function(input_popup_data) {

            $scope.popup_data = angular.copy(input_popup_data);
            $scope.modalInstance = $modal.open({
              templateUrl: 'views/templates/modal-error-template.html',
              size: 'sm',
              resolve: {
                popup_data: function () {
                  return $scope.popup_data;
                },

              }, 
              controller: function($scope, $modalInstance, popup_data, $timeout) {
                $scope.popup_data = popup_data;
                
                $scope.modalInstance = $modalInstance;

                $scope.cancel = function () {
                  $modalInstance.dismiss('cancel');
                };

              }
            });
          };

            dataoverviewctrl.showMappingPopup = function(project_fields, col_being_mapped, sheet) {

                $scope.project_fields = project_fields;
                dataoverviewctrl.col_being_mapped = col_being_mapped;
                $scope.sheet = sheet;
                $scope.modalInstance = $modal.open({
                    templateUrl: 'views/templates/map-file-modal.html',
                    size: 'sm',
                    resolve: {
                        project_fields: function() {
                            return $scope.project_fields;
                        },

                        sheet: function() {
                            return $scope.sheet;
                        },
                        dataoverviewctrl: function() {
                            return dataoverviewctrl;
                        }

                    },
                    controller: showMappingPopupController
                });
            };



            dataoverviewctrl.openEditDetail = function(input_popup_data) {

                $scope.popup_data = angular.copy(input_popup_data);
                $scope.youAreInModal = true;


                $scope.modalInstance = $modal.open({
                    templateUrl: 'views/modal-edit-template.html',
                    size: 'lg',
                    resolve: {
                        popup_data: function() {
                            return $scope.popup_data;
                        },
                        youAreInModal: function() {
                            return $scope.youAreInModal;
                        },
                        success: function(){
                            return $scope.success;
                        },
                        removeFile: function(){
                            return $scope.removeFile;
                        },


                    },
                    controller: function($scope, $modalInstance, popup_data, $timeout, youAreInModal, success, removeFile) {
                        $scope.popup_data = popup_data;




                        $scope.youAreInModal = youAreInModal;
                        $scope.success = success;
                        $scope.removeFile = removeFile;
                        $scope.dataoverviewctrl = dataoverviewctrl;
                        $scope.popup_data.this_level_edit_form = [];
                        $scope.popup_data.this_level_edit_schema = {
                            "type": "object",
                            'properties': {},
                            'required': []
                        };

                        angular.forEach(popup_data.main_cfc.project_data_fields, function(proj_data) {
                            //pull out the edit_form.form and edit_schema.schema
                            var form = angular.copy(proj_data.edit_form.form[0]);
                            form.htmlClass = "col-xs-12";
                            $scope.popup_data.this_level_edit_form.push(form);
                            angular.extend($scope.popup_data.this_level_edit_schema.properties, angular.copy(proj_data.edit_schema.properties));
                        });

                        $scope.success = function(file, form_key){
                        //can I access the model for the attachment field? Yes
                        
                        //build a URL for this upload so that calling it from the view redirects through the correct resource
                        //in order to check for project permissions, user permissions etc.
                        //now add parts to the url indicating project, file.uniqueIdentifier, field name (and filename?)
                        //add this to an object also containing mimetype data?
                        //populate the object
                        var AttachmentFactory = FlowFileFactory.cbhBaseAttachment;
                        var url_string = ""

                        var fdfresult = AttachmentFactory.save({
                                                    'flowfile': '/' + prefix + '/datastore/cbh_flowfiles/' + file.uniqueIdentifier,
                                                    'data_point_classification': '/' + prefix + '/datastore/cbh_datapoint_classifications/' + $scope.popup_data.id, //dpc
                                                },function (data){
                                                    url_string = data.resource_uri
                                                    var attachment_obj = {
                                                        url: url_string,
                                                        printName: file.name,
                                                        mimeType: file.file.type,
                                                    }

                                                    if( angular.isUndefined($scope.popup_data.main_data.project_data[form_key[0]])){
                                                        $scope.popup_data.main_data.project_data[form_key[0]] = {'attachments': []};
                                                    }
                                                    $scope.popup_data.main_data.project_data[form_key[0]].attachments.push(attachment_obj);

                                                });
                        
                    }
                    $scope.removeFile = function(form_key, index, url){
                        //can I access the model for the attachment field? Yes
                        if( angular.isUndefined($scope.popup_data.main_data.project_data[form_key[0]])){
                            console.log("setting to null")
                            $scope.popup_data.main_data.project_data[form_key[0]] = {'attachments': []}
                        }
                        $scope.popup_data.main_data.project_data[form_key[0]].attachments = $filter('filter')($scope.popup_data.main_data.project_data[form_key[0]].attachments, function(value, index) {return value.url !== url;})

                    }


                        $scope.modalInstance = $modalInstance;

                        $scope.cancel = function() {
                            //$interval.cancel($scope.autosave);
                            $modalInstance.dismiss('cancel');
                        };
                        $scope.saveEdits = function() {
                            //do the update
                            dataoverviewctrl.setLoadingMessageHeight();
                            dataoverviewctrl.currentlyLoading = true;
                            var AddDF = AddDataFactory.dataClassification;
                            var adfresult = AddDF.get({
                                'dc': $scope.popup_data.id
                            });
                            adfresult.$promise.then(function(clone) {
                                clone[$scope.popup_data.level_from] = $scope.popup_data.main_data;
                                clone.$update({
                                    'dc': $scope.popup_data.id
                                }, function(data) {
                                    //$interval.cancel($scope.autosave);
                                    $modalInstance.dismiss('saved');
                                    $state.go($state.current, $stateParams, {
                                        reload: true
                                    });
                                });
                            }, function(errorData) {
                                //TODO error handling
                            });
                        }
                        /*$scope.saveDraft = function(form_data){
                            console.log("Saving draft");
                            //save the contents of the form to either a django cache object or a redis cache 
                            var df = DraftFactory.save_draft
                            var dfresult = df.get({
                                //put the draft content to save here
                                'content': form_data
                            });
                            dfresult.$promise.then(function(data) {
                                //do stuff here to indicate draft has been saved (if the message comes back correctly)
                                console.log('edit draft saved', data);
                            });

                        };
                        $scope.autosave = $interval(function(){$scope.saveDraft($scope.popup_data.main_data);}, 60000);
                        $scope.displayDraftList = false;
                        $scope.draftList = []
                        $scope.toggleDraftList = function(){
                            $scope.displayDraftList = !$scope.displayDraftList;
                            //have we switched on the draft list? Refresh here
                            
                        }
                        $scope.loadDraft = function(draft_key){
                            var df = DraftFactory.get_draft;
                            var dfresult = df.get({
                                'draft_key': draft_key
                            });
                            dfresult.$promise.then(function(data) {
                                //put the loaded data into the form's model
                                console.log('modal edit load draft', data);
                            });
                        }

                        $scope.loadDraftList = function(){
                            var df = DraftFactory.list;
                            var dfresult = df.get();
                            dfresult.$promise.then(function(data) {
                                //put the loaded data into the form's model
                                $scope.draftList = data;
                            });
                        }*/
                    }
                });
            };
            //this method is called when the angular schema form file upload template has uploaded a file
            //get the file identifier and add to the schema form model

            $scope.success = dataoverviewctrl.success;
            $scope.removeFile = dataoverviewctrl.removeFile;
            
            $scope.csrftoken = $cookies[prefix.split("/")[0] + "csrftoken"];
            $scope.flowinit = {
                //need to change target to the new WS path provided by Andy
                target: urlConfig.instance_path.url_frag + 'flow/upload/',
                headers: {
                    'X-CSRFToken': $scope.csrftoken
                }
            };
            dataoverviewctrl.flowinit = $scope.flowinit;
            dataoverviewctrl.fetchData();

            dataoverviewctrl.setLoadingMessageHeight = function() {
                var scrollTop = $(window).scrollTop();
                $("#loading-message").css("top", (scrollTop + 200) + "px")
            }
            dataoverviewctrl.save_dpc = function(new_dpc) {
                dataoverviewctrl.setLoadingMessageHeight();
                dataoverviewctrl.currentlyLoading = true;
                var AddDF = AddDataFactory.dataClassification;
                AddDF.save(new_dpc,
                    function(data) {
                        $state.go($state.current, $stateParams, {
                            reload: true
                        });
                    },
                    function(errorData) {
                        //TODO error handling
                    }
                );
            }
            /*dataoverviewctrl.saveDraft = function(form_data){
                //console.log("saving new object draft");
                var df = DraftFactory.save_draft;
                var dfresult = df.get({
                    //put the draft content to save here
                    'content': form_data
                });
                dfresult.$promise.then(function(data) {
                    //do stuff here to indicate draft has been saved (if the message comes back correctly)
                    console.log('dataoverviewctrl save draft', data);
                });
            }
            dataoverviewctrl.displayDraftList = false;
            dataoverviewctrl.draftList = []
            dataoverviewctrl.toggleDraftList = function(){
                dataoverviewctrl.displayDraftList = !dataoverviewctrl.displayDraftList;
                //have we switched on the draft list? Refresh here

            }
            dataoverviewctrl.loadDraft = function(draft_key){
                var df = DraftFactory.get_draft;
                var dfresult = df.get({
                    'draft_key': draft_key
                });
                dfresult.$promise.then(function(data) {
                    //put the loaded data into the form's model
                    console.log('dataoverviewctrl save draft', data);
                });
            }
            dataoverviewctrl.loadDraftList = function(){
                var df = DraftFactory.list;
                var dfresult = df.get();
                dfresult.$promise.then(function(data) {
                    //put the loaded data into the form's model
                    dataoverviewctrl.draftList = data;
                });
            }*/

            //dataoverviewctrl.turnOnAutosave = false;
            /*if(dataoverviewctrl.addingChild){
                dataoverviewctrl.autosave = $interval(function(){$scope.saveDraft();}, 2000);    
            }
            $scope.$watch("dataoverviewctrl.addingChild",function handleChange( newValue, oldValue ) {
                        console.log("addingChild has changed");
                        if(newValue == true){
                            dataoverviewctrl.autosave = $interval(function(){dataoverviewctrl.saveDraft();}, 2000);  
                        }
                        else{
                            $interval.cancel(dataoverviewctrl.autosave);
                        }
                    })*/
            
            //to apply double scroll to each of these elements:
            //use ng-init in the template to register when data has been laoded - table doesn't exist until this
            //give each table an ID based on the data being loaded - to allow double scroll to be called on one element as it is loaded
            //call another function within the timeout which initiates double scroll with enough time to load fully

            dataoverviewctrl.tableLoaded = function(nl_cfc){
                $timeout(function(){dataoverviewctrl.initDblScroll(nl_cfc);}, 2000);
            }
            dataoverviewctrl.initDblScroll = function(id){
                $('#table-' + id).doubleScroll();
            }


        }


    ]);