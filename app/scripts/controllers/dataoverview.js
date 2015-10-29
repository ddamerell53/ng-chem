'use strict';

/**
 * @ngdoc function
 * @name ngChemApp.controller:DataoverviewCtrl
 * @description
 * # DataoverviewCtrl
 * Controller of the ngChemApp
 */
angular.module('chembiohubAssayApp')
  .controller('DataOverviewCtrl', ['$scope', 'AddDataFactory', '$modal', '$resource', '$stateParams', '$state' , '$timeout', 'prefix', 'urlConfig', '$cookies', 'FlowFileFactory', 
    function ($scope, AddDataFactory, $modal, $resource, $stateParams, $state, $timeout, prefix, urlConfig, $cookies, FlowFileFactory) {
	var dataoverviewctrl = this;





  var classes = {
    'l1': "l1",
    'l2' : "l2"
  }
  $scope.iamloading = false;
	$scope.modalInstance = {};
    $scope.popup_data = {};
    $scope.dpcForUpload = {};
    $scope.getAnnotations = function(dpc){

          dpc.dfc_full = $scope.assayctrl.dfc_lookup[dpc.data_form_config];
          dpc.main_cfc = dpc.dfc_full[dpc.level_from];
          dpc.main_data = dpc[dpc.level_from];
          dpc.htmlClassName = classes[dpc.level_from];


        
          dpc.setChosenDataFormConfig = function(dfc_uri, adding, templateData){
            
            dpc.addingChild = adding;
            dpc.next_level_dfc = $scope.assayctrl.dfc_lookup[dfc_uri];
            dpc.next_level_cfc = dpc.next_level_dfc[dpc.next_level_dfc.last_level];
            if (!angular.isDefined(templateData)){
              templateData =  {'project_data': {} ,'custom_field_config' : dpc.next_level_cfc.resource_uri};
            }else{
              templateData.id = null;
              templateData.resource_uri = null;
            }
            dpc.default_data =templateData;
            dpc.next_level_edit_form = dpc.next_level_dfc.get_main_form();
            dpc.next_level_edit_schema = dpc.next_level_dfc.get_main_schema();
            dpc.new_next_level_model = angular.copy(dpc.default_data );
            dpc.next_data_type_name = dpc.next_level_dfc[dpc.next_level_dfc.last_level].data_type.name;
            dpc.next_level_searchnames = dpc.next_level_cfc.project_data_fields.map(function(field){
              return dpc.next_level_dfc.last_level + ".project_data." + field.elasticsearch_fieldname;
            })
          }

          //setting up a method for setting up dfc for file upload
          //don't know what I do and don't need from this
          dpc.setChosenDataFormConfigMultiple = function(dfc_uri, adding, templateData) {

            

            dpc.addingMultiple = adding;
            dpc.next_level_dfc = $scope.assayctrl.dfc_lookup[dfc_uri];
            dpc.next_level_cfc = dpc.next_level_dfc[dpc.next_level_dfc.last_level];
            if (!angular.isDefined(templateData)){
              templateData =  {'project_data': {} ,'custom_field_config' : dpc.next_level_cfc.resource_uri};
            }else{
              templateData.id = null;
              templateData.resource_uri = null;
            }
            dpc.default_data =templateData;
            dpc.next_level_edit_form = dpc.next_level_dfc.get_main_form();
            dpc.next_level_edit_schema = dpc.next_level_dfc.get_main_schema();
            dpc.new_next_level_model = angular.copy(dpc.default_data );
            dpc.next_data_type_name = dpc.next_level_dfc[dpc.next_level_dfc.last_level].data_type.name;
      /*
      ************************ 
      STUFF FOR FILE UPLOAD UI
      ************************ 
      */

      dpc.inputData = {inputstring : ""};
        dpc.filedata = {};
        dpc.filesUploading = false;
        dpc.dataReady = false;
    

    //object containing user config, selected options and flowfile metadata returned from ws callls
    dpc.initUpload = function(){
       dpc.uploadData = {
      
      'uploaded': false,
      'fileId': '',
      'resource_uri': '',
      'sheets'  : []

    }
    }
    dpc.initUpload();
    
   
    dpc.cancelFile = function(){
      dpc.setChosenDataFormConfigMultiple(dfc_uri, adding, templateData);
    }

    dpc.getSheetsForFile = function(fileId) {
      //perform get request to get list of sheets
      //probably best to create a resource here - we will need it for other types of upload (img etc)
      //FlowFileFactory.cbhFlowfile.
      // dataoverviewctrl.setLoadingMessageHeight();
      // dataoverviewctrl.currentlyLoading = true;
      var FlowDF = FlowFileFactory.cbhFlowfile;
        dpc.uploadData.fileId = fileId;
        var fdfresult = FlowDF.get({'fileId': fileId});
        fdfresult.$promise.then(function(result){
          //dpc.uploadData.sheet_names = result.sheet_names;
          angular.forEach(result.sheet_names, function(sheet_name) {
            /*newobj = {}
            newobj.name = sheet_name*/

            var sheet = {'name': sheet_name,
                          active:false};

              sheet.listOfUnmappedFields = [];
              sheet.listOfUnmappedMandatoryFields = [];
            sheet.specifySheet = function() {
                 if(!angular.isDefined(sheet.metadata)){
                      
                      //we now have sheetName.name, pass to the specified webservice
                      var FlowDF = FlowFileFactory.cbhAttachments;
                      /*
                      flowfile: '@flowfile',
                      data_point_classification:  "@data_point_classification",
                      chosen_data_form_config: "@chosen_data_form_config",
                      sheet_name: "@sheetname",
                       */
                       //Resource URIs are not obvious here - the flowfile one cannot be sent from backend as it proports to contain session id which must be kept private
                       //The data point classification one is from the "nested resource" so is wrong

                      var fdfresult = FlowDF.save({ 
                        'flowfile': '/'+ prefix + '/datastore/cbh_flowfiles/' + dpc.uploadData.fileId,
                        'data_point_classification' :'/'+  prefix + '/datastore/cbh_datapoint_classifications/' + dpc.id,//dpc
                        'chosen_data_form_config': dpc.next_level_dfc.resource_uri,
                        'sheet_name': sheet.name,

                      }, function(result){
                        sheet.active=true;
                        sheet.metadata = result;
                        //sheet.listOfMappedFields = dpc.getListOfMappedFields(sheet.metadata.attachment_custom_field_config.project_data_fields);
                        //dataoverviewctrl.listOfUnmappedFields = dataoverviewctrl.getListOfUnmappedFields(result.attachment_custom_field_config.project_data_fields, result.attachment_custom_field_config.titleMap);
                        sheet.listOfUnmappedFields = sheet.getListOfUnmappedFields(result.attachment_custom_field_config.project_data_fields, result.titleMap)
                        sheet.listOfUnmappedMandatoryFields = sheet.getListOfUnmappedMandatoryFields(result.attachment_custom_field_config.project_data_fields, result.titleMap)

                      });
                 }


              }

              sheet.saveSheet = function(sheet_id) {
                
                $http.get('/'+ prefix + '/datastore/cbh_attachments/save_temporary_data?sheetId=' + sheet_id ).then(function(response){
                     $state.go($state.current, $stateParams, {reload: true});
                 });
              }
              //create a list of fields which still need a mapping
              sheet.getListOfUnmappedFields = function(fields, map){
                
                var fieldList = []
               
                //check each entry in title map - if it has no corresponding entry in any attachment field config, add it to the list
                angular.forEach(map, function(item){

                  var hasEntry = false;
                  angular.forEach(fields, function(field) {
                    if(field.attachment_field_mapped_to){
                      
                      if (field.attachment_field_mapped_to == item.value || !item.value){
                        hasEntry = true;
                      }


                    }

                  });
                  if(!hasEntry){
                    if(item.value){
                      fieldList.push(item.value)
                    }
                  }

                })

                return fieldList;
              };
              sheet.getListOfUnmappedMandatoryFields = function(fields, map){
                
                var fieldList = []
              
                //check each entry in title map - if it has no corresponding entry in any attachment field config, add it to the list
                angular.forEach(map, function(item){

                  var hasEntry = false;
                  angular.forEach(fields, function(field) {

                    if(field.attachment_field_mapped_to != null){
                      
                      if (field.attachment_field_mapped_to == item.value || !item.value){
                        hasEntry = true;
                      }


                    }

                  });
                  if(!hasEntry && item.required){
                    if(item.value){
                      fieldList.push(item.value)
                    }
                  }

                })

                return fieldList;
              };



            dpc.uploadData.sheets.push(sheet);
          })
          dpc.uploadData.uploaded = true;

        });

    }

            


            dpc.next_level_searchnames = dpc.next_level_cfc.project_data_fields.map(function(field){
              
              return dpc.next_level_dfc.last_level + ".project_data." + field.elasticsearch_fieldname;
            })
          }

          dpc.cancel = function(){
            if (dpc.dfc_full.permitted_children.length > 0){
              //Default to the first in the list for thios but reset it every time that someone 
              dpc.setChosenDataFormConfig(dpc.dfc_full.permitted_children[0]);
            }
            dpc.addingChild = false

          }

          if (dpc.dfc_full.permitted_children.length > 0){
            //Default to the first in the list for thios but reset it every time that someone 
            dpc.setChosenDataFormConfig(dpc.dfc_full.permitted_children[0], false);
            dpc.addingChild = false;

          }


          

          dpc.addDataToForm = function(data){
            dpc.addingChild = true;
            dpc.setForm(data);
            
          }/*
          dpc.editData = function(data){
            dpc.addingChild = false;
            dpc.setForm(data);
          }*/
          // dpc.setForm(dpc.default_data);
          dpc.addChild = function(){
              dataoverviewctrl.setLoadingMessageHeight();
              dataoverviewctrl.currentlyLoading = true;
              var AddDF = AddDataFactory.dataClassification;
           
              var adfresult = AddDF.get({'dc': dpc.id});
                  adfresult.$promise.then(function(clone){

                        clone.children = [];
                        clone.id = null;
                        clone.resource_uri = null;
                        clone.parent_id = dpc.id;
                        clone[dpc.next_level] = dpc.new_next_level_model;
                        clone.data_form_config = dpc.next_level_dfc.resource_uri;
                        clone.$save(function(data){
                            $state.go($state.current, $stateParams, {reload: true});
                        });
                  });
          };

          dpc.updateChild = function(child_dpc_id){
            dataoverviewctrl.setLoadingMessageHeight();
      dataoverviewctrl.currentlyLoading = true;
              var AddDF = AddDataFactory.dataClassification;
              var adfresult = AddDF.get({'dc': child_dpc_id});
                  adfresult.$promise.then(function(clone){
                        clone[dpc.next_level] = dpc.new_next_level_model;
                        clone.$update({'dc': child_dpc_id} ,function(data){
                            $state.go($state.current, $stateParams, {reload: true});
                        });
                  });
          }
/*
          dpc.saveEdits = function(child_dpc_id){
              var AddDF = AddDataFactory.dataClassification;
              var adfresult = AddDF.get({'dc': child_dpc_id});
              adfresult.$promise.then(function(clone){
                    //clone[dpc.next_level] = dpc.new_next_level_model;
                    clone.$update({'dc': child_dpc_id} ,function(data){
                        $state.go($state.current, $stateParams, {reload: true});
                    });
              });
          }*/

          

          if(   dpc.next_level_dfc.human_added){
            dpc.childrenTemplate = "views/templates/overview-children-table.html";
          }else{
            dpc.childrenTemplate = "views/templates/overview-children.html";
          }

          $scope.dpcForUpload = dpc;
        
        
    };
    $scope.iterate_children = function(obj){
        angular.forEach(obj.children, function(child, index){
          if( angular.isDefined(child.id)){
            child.parentObj = obj;
            
            $scope.getAnnotations(child);
            $scope.iterate_children(child);
            
       
          }});
    }

    $scope.no_l0 = false;
    dataoverviewctrl.fetchData = function(){
      
      
       AddDataFactory.nestedDataClassification.get({
        "project_key": $scope.assayctrl.proj.project_key, 
      },
        function(data){
          if(data.objects.length >= 1){
            $scope.no_l0 = false;
            dataoverviewctrl.l0_object = data.objects[0];

            $scope.getAnnotations(dataoverviewctrl.l0_object);
            $scope.iterate_children(dataoverviewctrl.l0_object);

          }else{
            $scope.no_l0 = true;
            dataoverviewctrl.l0_object = angular.copy($scope.assayctrl.l0_dfc.template_data_point_classification);
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
      $scope.col_being_mapped = col_being_mapped;
      $scope.sheet = sheet;
      $scope.modalInstance = $modal.open({
        templateUrl: 'views/templates/map-file-modal.html',
        size: 'sm',
        resolve: {
          project_fields: function () {
            return $scope.project_fields;
          },
          col_being_mapped: function () {
            return $scope.col_being_mapped;
          },
          sheet: function () {
            return $scope.sheet;
          },

        }, 
        controller: function($scope, $modalInstance, project_fields, col_being_mapped, sheet, $timeout, $filter) {

          $scope.project_fields = angular.copy(project_fields);
          $scope.modded_project_fields = [];
          $scope.col_being_mapped = col_being_mapped;
          
          $scope.modalInstance = $modalInstance;

          

          $scope.sheet = sheet;


          
          //limit project_field options to those which are not selected elsewhere, but still include the currently selected one (!)
          angular.forEach($scope.project_fields, function(field){
            var added = false;
            if(sheet.listOfUnmappedFields.indexOf(field.value) > -1){
              $scope.modded_project_fields.push(field);
              added = true;
            }
            //is it this mapping?
              if(!added && field.value == col_being_mapped.attachment_field_mapped_to || field.value==null){
                $scope.modded_project_fields.push(field);
              }
            
          });
          $scope.mapping = $scope.modded_project_fields[0];

          
          if(col_being_mapped.attachment_field_mapped_to != null) {
            //find the project field where the URI is the value
            var set = false;
            angular.forEach($scope.project_fields, function(field){
              if(field.value == col_being_mapped.attachment_field_mapped_to){
                $scope.mapping = field;
                $scope.oldRequired = angular.copy($scope.mapping.required);
              }
            });
          }
          
          $scope.setWarningMessage = function(){
            var set = false;
            angular.forEach($scope.modded_project_fields, function(field){
              if(col_being_mapped.attachment_field_unmappable_to == field.value){
                $scope.warningMessage = "Attemped to map this field to " + field.name + " but there are rows with unmappable data.";
                $scope.messageClass = "text-danger";
                set = true;
              }
            });

          }

          $scope.setWarningMessage();

          $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
          };

          $scope.someMappingFunction = function() {
            //store a copy of the field being mapped to in case we lose it after patching
             if($scope.mapping.value ){
              var splicing = sheet.listOfUnmappedFields.indexOf($scope.mapping.value);

                sheet.listOfUnmappedFields.splice(sheet.listOfUnmappedFields.indexOf($scope.mapping.value), 1); 

                if($scope.mapping.required){
                  sheet.listOfUnmappedMandatoryFields.splice(sheet.listOfUnmappedMandatoryFields.indexOf($scope.mapping.value), 1);  
                }
            }
             if(col_being_mapped.attachment_field_mapped_to != $scope.mapping.value ){
                if(col_being_mapped.attachment_field_mapped_to != null){
                sheet.listOfUnmappedFields.push(col_being_mapped.attachment_field_mapped_to);  
                if($scope.oldRequired){
                  sheet.listOfUnmappedMandatoryFields.push(col_being_mapped.attachment_field_mapped_to);
                }
                }
                
            }
            
            
            var old_attachment_field_mapped_to = col_being_mapped.attachment_field_mapped_to;
            var name_of_field = $scope.mapping.name;

            $scope.setNewMapping();
            $scope.oldRequired = angular.copy($scope.mapping.required);
            var promise = $http.patch(  col_being_mapped.resource_uri ,       
                  col_being_mapped
                ).then(
                function(data){
                  console.log(sheet.listOfUnmappedFields);
                    
                    col_being_mapped = data.data;
                    
                    if(data.data.attachment_field_unmappable_to){
                      $scope.setWarningMessage();
                      //we can't map this field.
                      //re-add the field to the list of unmapped fields
                      //if($scope.col_being_mapped.required) {
                        if(old_attachment_field_mapped_to != null){
                          sheet.listOfUnmappedFields.push(old_attachment_field_mapped_to)
                        //}
                          if($scope.mapping.required) {
                            sheet.listOfUnmappedMandatoryFields.push(old_attachment_field_mapped_to)
                          }
                        }
                        
                      
                      //change the error message to say you still can't map that field
                      $scope.mapping = $scope.modded_project_fields[0];
                      $scope.clearMapping(col_being_mapped.required);
                      //blur the select box to refresh
                      var selectBox = document.getElementById('field-selector');
                      angular.element(selectBox).blur();
                    }
                    else {
                      $scope.messageClass = "text-success";
                      $scope.warningMessage = "Mapping saved";
                     
                      return data.data;
                    }
                    
                }, function(errorData){
                  
                  
                }
            );
            return promise;
          };

          $scope.setNewMapping = function(){
            col_being_mapped.attachment_field_mapped_to = $scope.mapping.value
          };

          $scope.clearMapping = function(isRequiredField){
            //deselct the items from the ngmodel of the select box
            
            $scope.mapping = $scope.modded_project_fields[0];
            //clear the URI indicating the mapping from the file column
            $scope.someMappingFunction(col_being_mapped);

          }

        }
      });
    };    

   

    dataoverviewctrl.openEditDetail = function(input_popup_data) {

      $scope.popup_data = angular.copy(input_popup_data);
      $scope.modalInstance = $modal.open({
        templateUrl: 'views/modal-edit-template.html',
        size: 'lg',
        resolve: {
          popup_data: function () {
            return $scope.popup_data;
          },

        }, 
        controller: function($scope, $modalInstance, popup_data, $timeout) {
          $scope.popup_data = popup_data;
          $scope.popup_data.this_level_edit_form = [];
          $scope.popup_data.this_level_edit_schema = { "type": "object", 'properties' : {}, 'required': [] };
          
          angular.forEach(popup_data.main_cfc.project_data_fields, function(proj_data){
            //pull out the edit_form.form and edit_schema.schema
            var form = angular.copy(proj_data.edit_form.form[0]);
            form.htmlClass = "col-xs-6";
            $scope.popup_data.this_level_edit_form.push(form);
            angular.extend($scope.popup_data.this_level_edit_schema.properties, angular.copy(proj_data.edit_schema.properties));
          });
          $scope.modalInstance = $modalInstance;

		  $scope.cancel = function () {
		    $modalInstance.dismiss('cancel');
		  };
      $scope.saveEdits = function() {
        //do the update
        dataoverviewctrl.setLoadingMessageHeight();
      dataoverviewctrl.currentlyLoading = true;
        var AddDF = AddDataFactory.dataClassification;
        var adfresult = AddDF.get({'dc': $scope.popup_data.id});
            adfresult.$promise.then(function(clone){
                  clone[$scope.popup_data.level_from] = $scope.popup_data.main_data;
                  clone.$update({'dc': $scope.popup_data.id} ,function(data){
                    $modalInstance.dismiss('saved');
                      $state.go($state.current, $stateParams, {reload: true});
                  });
            }, function(errorData){
              //TODO error handling
            });
          }
        }
      });
    };

$scope.csrftoken = $cookies[prefix.split("/")[0] + "csrftoken"];
    $scope.flowinit = {
      //need to change target to the new WS path provided by Andy
        target: urlConfig.instance_path.url_frag + 'flow/upload/',
        headers: {
            'X-CSRFToken': $scope.csrftoken
        }
    };
    dataoverviewctrl.fetchData();

dataoverviewctrl.setLoadingMessageHeight = function(){
            var scrollTop = $(window).scrollTop();
            $("#loading-message").css("top", (scrollTop +200) + "px")
        }
    dataoverviewctrl.save_dpc = function(new_dpc){
      dataoverviewctrl.setLoadingMessageHeight();
      dataoverviewctrl.currentlyLoading = true;
        var AddDF = AddDataFactory.dataClassification;
        AddDF.save(new_dpc,
            function(data){
              $state.go($state.current, $stateParams, {reload: true});
            },
            function(errorData){
              //TODO error handling
            }
          );
      }





  }]);
