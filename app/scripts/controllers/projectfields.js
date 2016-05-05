'use strict';

/**
 * @ngdoc controller
 * @name chembiohubAssayApp.controller:ProjectfieldsCtrl
 * @description
 * # ProjectfieldsCtrl
 * This controller is used for the project setup functionality (adding and editing projects through the user interface).
 */
angular.module('chembiohubAssayApp')
  .controller('ProjectfieldsCtrl', ["$scope", "$modalInstance", "$rootScope", "ProjectFactory", "projectId", "default_project_type", "projectTypes", "skinConfig",
    function($scope, $modalInstance, $rootScope, ProjectFactory,  projectId, default_project_type, projectTypes, skinConfig) {
            $scope.isIE = detectIE();
            var isPlateMapType = function(key){
              var readonly = false;
                        var current=$scope.proj; 
                        
                        if(angular.isDefined(current)){
                          angular.forEach(key.slice(0,-1), function(p){ current = current[p]; }); 
                          if(angular.isDefined(current)){
                            
                            if(current.readonly_on_create){
                              readonly=true;
                            }
                          }
                          
                        }
                        
                        return readonly;
            }
            var isReadOnlyFunc= function(key){
                        //This function takes the key of the individual copy of this form that is in the array of forms in schema form
                        //The function is called because of a modification to the default template of angular schema form found in 
                        //cbh_angular_schema_form_extension.js We iterate the object path to find the model value for the project data field in question
                        //If this value has an ID then the user is NOT ALLOWED to change the field any more
                        var readonly = false;
                        var current=$scope.proj; 
                        
                        if(angular.isDefined(current)){
                          angular.forEach(key.slice(0,-1), function(p){ current = current[p]; }); 
                          if(angular.isDefined(current)){
                            if(current.id){
                              readonly=true;
                            }
                          }
                          
                        }
                        if(!readonly){
                          return isPlateMapType(key);
                        }

                        return readonly;
                      }
            
            var field_types = skinConfig.objects[0].field_type_choices;
              var restrictions = [
                {"value": "open","name":"Open"},
                {"value": "restricted","name":"Restricted to editors"}
              ];
              var setForms = function(){
                 $scope.projectForm = [
                  {"key":"name",
                    "htmlClass": "col-sm-4",
                    "disableSuccessState":true,
                    "title": "Project Name",
                    "required": true,
                    "feedback": false,
                    onChange: function(modelValue,form) {
                        $scope.proj.custom_field_config.name = $scope.proj.name + "__config";
                    }
                  },
                    
                  {
                    "key": "project_type",
                    "title": "Project Type",
                    "type": "radiobuttons",
                    "titleMap": projectTypes,
                    "htmlClass": "col-sm-4",
                    "onChange": "updatedProjectType()",
                    "disableSuccessState":true,
                    "feedback": false

                },
                {"key":"project_counter_start",
                    "htmlClass": "col-sm-4",
                    "disableSuccessState":true,
                    "title": "Project Counter Starts At",
                    "required": true,
                    "feedback": false,
                  },
                {
                    "key": "custom_field_config.project_data_fields",
                    "title": "Project Data Fields",
                    "type": "array",
                    "description": "Fields that will be displayed for this project. Drag a field to change the order it is displayed in. The order of existing fields can be changed but they cannot be removed or renamed.",

                    "items": [
                    {"type":"section",
                    "htmlClass": "row",
                    "items":[
                      {"key":"custom_field_config.project_data_fields[].name",
                    "htmlClass": "col-sm-2",
                           "disableSuccessState":true,
                    "feedback": false,
                      "title": "Name",
                      "required": true,
                      "isReadOnly" : isReadOnlyFunc


                    },
                      {"title": "Required",
                      "type":"select",
                      "disableSuccessState":true,
                      "isReadOnly" : isReadOnlyFunc,
                        "key":"custom_field_config.project_data_fields[].required",
                        "default":false,
                        "titleMap": [{"value":true, "name":"Yes"}, {"value":false, "name":"No"}],
                    "htmlClass": "col-sm-2"},
                      {"title": "Field Type",
                        "key":"custom_field_config.project_data_fields[].field_type",
                        "titleMap": field_types
                        ,
                        "disableSuccessState":true,
                        "type":"select",
                    "htmlClass": "col-sm-2",
                    "isReadOnly" : isReadOnlyFunc
                    
                      },
                      {"title":"Description",
                        "key":"custom_field_config.project_data_fields[].description",
                        "htmlClass": "col-sm-2",
                        "disableSuccessState":true,
                        "feedback": false,
                    },
                    {"title": "Visibility",
                        "key":"custom_field_config.project_data_fields[].open_or_restricted",
                        "titleMap": restrictions ,
                        "disableSuccessState":true,
                        "type":"select",
                    "htmlClass": "col-sm-3"
                      },
                
                       
                    ]
                  },{"type":"section",
                    "htmlClass": "row",
                    "items":[
                                {  "htmlClass": "col-sm-6",
                        "key":"custom_field_config.project_data_fields[].default",
                        "title": "Default Value",
                        "disableSuccessState":true,
                        "feedback": false,
                        "isReadOnly" : isReadOnlyFunc,
                       "condition": "model.custom_field_config.project_data_fields[arrayIndex].required"
                     }, 
                      {  "htmlClass": "col-sm-6",
                        "key":"custom_field_config.project_data_fields[].allowed_values",
                        "disableSuccessState":true,
                        "feedback": false,
                        "title": "Allowed values (comma-separated)",
                        "isReadOnly" : isPlateMapType,
                       "condition": "(model.custom_field_config.project_data_fields[arrayIndex].field_type == 'uiselect' || model.custom_field_config.project_data_fields[arrayIndex].field_type == 'uiselecttags' || model.custom_field_config.project_data_fields[arrayIndex].field_type == 'uiselecttag' || model.custom_field_config.project_data_fields[arrayIndex].field_type == 'radios')"
                     }
                    ]
                  },

                  
                      
                    ],
                    "htmlClass": "col-sm-12"
                }

                ];
              $scope.projectSchema = {"type": "object", 
                                        "properties": 
                                        {"name":
                                          {
                                            "title": "Project Name", 
                                            "type": "string",
                                            "pattern": "^[a-zA-Z0-9_ /&]*$",
                                             "validationMessage" : {202: "Only letters, spaces, numbers, dashes, slashes, & signs and underscores in project names"},

                                          },
                                          "project_type":
                                            {
                                              "title": "Project Type", 
                                              "type": "object",
                                              "enum": projectTypes.map(
                                                function(pT){
                                                    return pT.value
                                                }),
                                              "default": default_project_type,

                                            },
                                            "project_counter_start":{
                                                "title" : "Project Counter Starts At",
                                                "type": "integer",
                                                "default" : 1,
                                            },

                                          "custom_field_config":
                                                { "type": "object",


                                                    "properties":{

                                                        "project_data_fields":
                                                        {
                                                          "type": "array",
                                                          "items": {
                                                            "type": "object",
                                                            "properties": {
                                                              "name": { "type": "string", "default":"", "pattern": "^[^./\"',]*$" , "validationMessage" : {202: "Dots, commas, quotes and slashes not permitted in field names"}},
                                                              "description": { "type": "string" },
                                                              "required": { "type": "boolean","default":false},
                                                              "field_type": {"type":"string", "default": "char","enum":field_types.map(function(r){  return r.value})},
                                                              "open_or_restricted":{"type":"string", "enum":restrictions.map(function(r){ return r.value}),"default" : "open" },
                                                              "allowed_values":{ "type":"string" , "default": "" },
                                                             "default":{ "type":"string", "default": "" }    
                                                            }
                                                          }
                                                        }
                                                }
                                          }
                                        }
                                      };

              }
             


              $scope.modalInstance = $modalInstance;
              //this is no longer needed
              $scope.updatedProjectType = function(){
                  if(projectId == -1){
                      $scope.proj.custom_field_config = angular.copy($scope.proj.project_type.project_template.custom_field_config);
                  }
              };
              $scope.setProjectType = function(){
                //ensures that there is object equality for the project type
                projectTypes.forEach(function(pType){
                      if(pType.value.id==$scope.proj.project_type.id){
                        $scope.proj.project_type = pType.value;
                      }
                  });
              }
              if(projectId == -1){

                  
              
                $scope.operation = "add";
                $scope.proj = {
                  "project_type": default_project_type,
                 
                  
               };
                $scope.updatedProjectType();
                setForms();
              }else{
                ProjectFactory.get({"projectId": projectId}, function(data){
                  
                    $scope.operation = "update";
                  

                  $scope.proj = data;
                  $scope.setProjectType();
                //Set the object reference for projectType
                  
                  setForms();
                });

                
              }
              //interject with platemap fields for the platemap project type
              
              


              
              $scope.copyProjectDefinition = function(copyProjectId){
                ProjectFactory.get({"projectId": copyProjectId}, function(data){
                    //Set the project type from the copy
                    $scope.proj.project_type = data.project_type;
                    //Ensure this matches the list project type
                    $scope.setProjectType();
                    //If there is only one item left in the custom field configs check it is not blank, if not then append the fields from that project
                    if($scope.proj.custom_field_config.project_data_fields.length == 1){
                          if($scope.proj.custom_field_config.project_data_fields[0].name==="" || angular.isUndefined($scope.proj.custom_field_config.project_data_fields[0].name)){
                            $scope.proj.custom_field_config.project_data_fields = [];
                          }
                        }
                    //Push all of the fields into the $scope.proj definition
                    angular.forEach(data.custom_field_config.project_data_fields, function(item){
                        item.id = undefined;
                        item.resource_uri = undefined;
                        item.pk = undefined;
                        $scope.proj.custom_field_config.project_data_fields.push(item);
                    });
                  
                });
              }



              $scope.cancel = function () {
                  $modalInstance.dismiss('cancel');
                };
             $scope.errormess = "";
              var checkForDuplicateNames= function(){
                 var names = {};
                 var dupes = [];
                  angular.forEach($scope.proj.custom_field_config.project_data_fields, function(f, index){
                    if(angular.isUndefined(f.name)){
                      f.name="";
                    }
                    if(f.name){
                      if(!angular.isUndefined(names[f.name])){
                        names[f.name].push(index);
                        dupes.push(f.name);
                      }else{
                        names[f.name] = [index];
                        
                      }
                    }
                    
                  });

                  if(dupes.length>0){
                    $scope.errormess = "Duplicate names found:   " + dupes.join(", ");
                  }
              }

              $scope.saveChanges = function(myForm){
                  $scope.$broadcast("schemaFormValidate");
                  $scope.errormess = "";
                  if(myForm.$valid){
                     var callback = function(data){
                    $modalInstance.dismiss('cancel');
                    location.reload(true);
                  };
                  
                  checkForDuplicateNames();
                    if( !$scope.errormess ){
                      if($scope.operation = "add"){
                         ProjectFactory.save($scope.proj, callback);

                      }else{
                         ProjectFactory.update({"projectId": $scope.proj.id}, $scope.proj, callback);
                      }
                    }else{
                      //
                    }

                  }else{
                    $scope.errormess = "Please correct the errors above in order to save this project.";
                  }
                 
              };
}]);
