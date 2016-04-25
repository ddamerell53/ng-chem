'use strict';


function detectIE() {
    var ua = window.navigator.userAgent;

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

 
/**
 * @ngdoc function
 * @name chembiohubAssayApp.controller:CbhCtrl
 * @description
 * # CbhCtrl
 * Controller of the chembiohubAssayApp
 */
angular.module('chembiohubAssayApp')
  .controller('CbhCtrl', function($scope, $rootScope, $state, $location, $modal, urlConfig, loggedInUser, projectList, prefix, $compile, MessageFactory, skinConfig, InvitationFactory) {

          var cbh = this;
          

          cbh.isIE = detectIE();
          cbh.appName = "Platform"
          cbh.logged_in_user = loggedInUser;
          cbh.projects = projectList;
          cbh.skinning = skinConfig.objects[0];
          //$scope.skinning = cbh.skinning;
          cbh.prefix = urlConfig.instance_path.base;
          cbh.api_base = urlConfig.admin.list_endpoint;
          cbh.searchPage = function() {
            $state.go('cbh.search', {}, {
              reload: true
            });
          }
          cbh.textsearch = '';
          $scope.projects = projectList.objects;

          $rootScope.projects = projectList.objects;
          $scope.projects.map(function(proj) {
            if (!proj.is_default) {
              $scope.isDefault = false;
            }
          });
          angular.element(document).ready(function() {

            angular.element("info-box", function() {});
          });
          $scope.isLoggedIn = function() {
            var loggedIn = false;
            if (cbh.logged_in_user.id > 0) {
              loggedIn = true;
            }
            return loggedIn;
          };

          $rootScope.getUrlBase = function() {
            return urlConfig.instance_path.url_frag;
          };

          $scope.getProjectObj = function(projectKey) {
            angular.forEach($scope.projects, function(proj) {
              if (projectKey == proj.project_key) {
                return proj;
              }
            });
          };
          cbh.messages = MessageFactory.getMessages();

          /* Create an object for communication between handsontable and the search form WRT custom fields */
          cbh.createCustomFieldTransport = function(newValue, oldValue, arrayContains) {
            var addOrRemove = ""

            var valToSend;
            var strippedValues = []

            //need to strip out angular $$ variables to enable array comparison
            angular.forEach(newValue, function(item) {
              if (angular.isObject(item)) {
                item = angular.fromJson(angular.toJson(item));
              }
              strippedValues.push(item);
            })

            //work out the array difference so we know which value to add to (or remove from) the search form
            //the order of supplying arrays is important in these comparators, hence the size comparison conditional
            //we need to use underscore filter for object array comparison
            //we need to use underscore difference for string array comparison
            if (angular.isDefined(newValue) && angular.isDefined(oldValue)) {
              if (newValue.length > oldValue.length) {
                addOrRemove = "add"
                  //work out which values are in the new value but not the old value
                if (arrayContains == "obj") {
                  var valToSend = _.filter(strippedValues, function(obj) {
                    return !_.findWhere(oldValue, obj);
                  });
                } else if (arrayContains == "string") {
                  var valToSend = _.difference(strippedValues, oldValue);
                }

              } else if (oldValue.length > newValue.length) {
                addOrRemove = "remove";
                //work out which values are in the old value but not the new value
                if (arrayContains == "obj") {
                  var valToSend = _.filter(oldValue, function(obj) {
                    return !_.findWhere(strippedValues, obj);
                  });
                } else if (arrayContains == "string") {
                  var valToSend = _.difference(oldValue, strippedValues);
                }

              }

              return {
                'newValue': valToSend[0],
                'addOrRemove': addOrRemove
              };
            }

          }
          cbh.openFilterPopup = function(col) {
                console.log('col', col);
                $scope.col = angular.copy(col);
                $scope.modalInstance = $modal.open({
                  templateUrl: 'views/templates/compound-table-filter.html',
                  size: 'md',
                  resolve: {
                    col: function () {
                      return $scope.col;
                    },

                  }, 
                  controller: function($scope, $modalInstance, col, $timeout) {
                    $scope.col = col;
                    
                    $scope.modalInstance = $modalInstance;

                    $scope.cancel = function () {
                      $modalInstance.dismiss('cancel');
                    };

                  }
                });
              }

          cbh.openSingleMol = function(mol, isNewCompoundsInterface, editingOnlyProperty) {
            var templateU = editingOnlyProperty ? 'views/templates/single-field.html' : 'views/templates/single-compound-full.html';

            var editingClass = editingOnlyProperty ? 'editing' : '';


            $scope.modalInstance = $modal.open({
              templateUrl: templateU,
              size: 'lg',
              windowClass: editingClass,
              controller: ['$scope', '$rootScope', '$modalInstance', '$timeout', 'CBHCompoundBatch', 'ProjectFactory', '$cookies', 'FlowFileFactory', '$filter',
                function($scope, $rootScope, $modalInstance, $timeout, CBHCompoundBatch, ProjectFactory, $cookies, FlowFileFactory, $filter) {
                  
                  /* FlowFile attachment for custom field stuff */
                  
                  //$scope.flowinit and csrftoken is now generated in the back end
                  $scope.success = function(file, form_key){
                    //apply the urls of the flowfile object to the correct custom field of $scope.mol.customFields - find the attachments array and add it
                    //put a nedw method in FlowFileFactory
                    var AttachmentFactory = FlowFileFactory.cbhChemFlowFile;
                    AttachmentFactory.get({
                      'identifier': file.uniqueIdentifier
                    }, function(data){
                      //add this to attachments in the form element (find it by form key in mol.customFields)
                      var downloadUri = data.download_uri
                      var attachment_obj = {
                          url: downloadUri,
                          printName: file.name,
                          mimeType: file.file.type,
                      }
                      $scope.mol.customFields[form_key[0]].attachments.push(attachment_obj)

                    })

                  }

                  $scope.removeFile = function(form_key, index, url){
                    $scope.mol.customFields[form_key[0]].attachments  = $filter('filter')($scope.mol.customFields[form_key[0]].attachments, function(value, index) {return value.url !== url;})
                  }

                  $scope.sizeCheck = function(file, form_key){
                
                      //get the file
                      console.log('file size',file.size);
                      if (file.size > 20000000) {
                          //cancel the file
                          file.flowObj.removeFile(file);
                          //get the form element ad change the validation message, mark as invalid
                          alert("This system has a file size limit of 20Mb per file. Please try with a smaller file.");
                          return false;
                          

                      }
                      
                  }



                  $scope.isNewCompoundsInterface = isNewCompoundsInterface;
                  $scope.editMode = false;
                  $scope.mol = angular.copy(mol);
                  var split = mol.project.split("/");
                  var projid = split[split.length - 1];
                  $scope.projectWithCustomFieldData;
                  angular.forEach($rootScope.projects, function(myproj) {
                    if (myproj.id.toString() == projid) {
                      $scope.projectWithCustomFieldData = myproj;
                      $scope.projectObj = myproj;
                    }
                  });

                  $scope.openClone = function(){
                    $modalInstance.dismiss("cancel");
                    if($scope.projectObj.project_type.show_compounds){
                          //If this is a compounds project redirect to compound clone page
                        $state.go("cbh.projects.project.addsingle", {'projectKey':$scope.projectObj.project_key, idToClone: $scope.mol.id}, { reload: true });
                    }else{
                        $rootScope.$broadcast("cloneAnItem", mol)
                    }

                  }
                  $scope.singleForm = false;

                  if (editingOnlyProperty) {
                    angular.forEach($scope.projectWithCustomFieldData.schemaform.form, function(formItem) {
                      if (formItem.key === editingOnlyProperty.split(".")[1]) {
                        $scope.singleForm = [angular.copy(formItem)];
                      }
                    });
                  }


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
                        //need to also return the format so we can differentiate file upload fields
                        var isFileField = false;
                        //only file fields have the 'default' attribute (at the moment)
                        var attachments = [];
                        if(item.default){
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

                  };
                  $scope.init();



                  $scope.removeAlert = function() {
                    $scope.update_success = false;
                  }
                  cbh.isUpdated = false;
                  $scope.updateBatch = function(instance) {
                    //TODO handle error here
                    CBHCompoundBatch.patch({
                      "customFields": $scope.mol.customFields,
                      "projectKey": $scope.projectWithCustomFieldData.project_key,
                      "id": $scope.mol.id
                    }).then(
                      function(data) {
                        $scope.mol.customFields = data.customFields;
                        mol.customFields = data.customFields;
                        //reindex the compound
                        CBHCompoundBatch.reindexModifiedCompound($scope.mol.id).then(function(d){
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
                  $scope.myschema = $scope.projectWithCustomFieldData.schemaform.schema;
                  $scope.modalInstance = $modalInstance;
                  $scope.cancel = function(){
                    //clear mol, redraw schema form to remove cached data from file upload plugin then dismiss instance
                    $scope.mol = {}
                    $scope.$broadcast('schemaFormRedraw');
                    $scope.modalInstance.dismiss('cancel');
                  }

                }
              ]
            }).result.finally(function() {
              if (cbh.isUpdated) {
                $rootScope.$broadcast("updateListView");
              }
            });
          };
          
          /* Global error handling popup for displaying generic error messages */
          cbh.errorPopup = function(input_popup_data) {

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
          /* 
             Global invitation popup for inviting external users to use the system.
             Creates a new user with the details supplied here and emails the invitee.
           */
          cbh.invitationPopup = function() {

            //$scope.popup_data = angular.copy(input_popup_data);
            $scope.modalInstance = $modal.open({
              templateUrl: 'views/templates/modal-invitation-template.html',
              size: 'md',
              controller: function($scope, $modalInstance, InvitationFactory) {
                
                $scope.clearForm = function(){
                  $scope.invite = {
                    firstName:'',
                    lastName:'',
                    email: '',
                    projects_selected: [],
                    remind: false

                  };

                $scope.validationMessage = "";
                }
                
                $scope.modalInstance = $modalInstance;
                $scope.clearForm();
                $scope.setWatcher = function(){
                  $scope.watch = $scope.$watch("invite.email", function(old,newob){
                    if(old != newob){
                      $scope.invite.remind  = false;
                    }
                  });
                }
                $scope.setWatcher();
                $scope.projects = [];
                angular.forEach(cbh.projects.objects, function(proj){
                  if(proj.editor){
                    $scope.projects.push(proj);
                  }
                });

                $scope.cancel = function () {
                  $scope.validationMessage = "";
                  $modalInstance.dismiss('cancel');
                };

                $scope.sendInvite = function() {
                  //check fields are filled in
                  //send info to backend to set up new users
                    $scope.validationMessage = "";

                  if($scope.invite.email == ""){
                    $scope.validationMessage = "Please enter an email address so we can send the invitation.";
                  }
                  else if($scope.invite.projects_selected.length == 0) {
                    $scope.validationMessage = "Please select at least one project to add this user to.";
                  }
                  else {
                    //OK we have the info we need - send the invite!
                    
                    //send via some form of service
                    
                    InvitationFactory.invite.save($scope.invite,
                        function(data) {
                            $scope.watch();
                            $scope.invite.email="";
                            $scope.invite.remind  = false;
                            $scope.validationMessage = data.message;
                            $timeout(function(){
                              $scope.setWatcher();
                            },100);
                            

                        },
                        function(error){
                          if(error.status == 409){
                                //http conflict means we have the invitee in the db already but no reminder has been asked for
                               $scope.validationMessage = error.data.error;
                               $scope.invite.remind = true;
                          }else{
                              $scope.validationMessage = "There was a problem sending your invitation, please contact the ChemBio Hub team.";

                              if(error.data){
                                if(error.data.error){
                                  $scope.validationMessage = error.data.error;
                                }
                              }
                          }
                          
                        }
                    );
                  }


                };

                
              }
            });
          };

          cbh.currentPageClass = function(state_to_match) {
            if ($state.includes(state_to_match)) {
              return 'current-page';
            } else {
              return '';
            }
          }




        });
