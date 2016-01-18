'use strict';

/**
 * @ngdoc overview
 * @name chembiohubAssayApp
 * @description
 * # chembiohubAssayApp
 *
 * Main module of the application.
 */


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

 
angular.module('chembiohubAssayApp')


.config(function($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
$urlRouterProvider.when('', '/projects/list');

    // catch all route
    // send users to the form page 
    $urlRouterProvider.otherwise('/404');

    // the known route, with missing '/' - let's create alias
// the unknown
    $urlMatcherFactoryProvider.defaultSquashPolicy("slash");
    var modalInstance;
    $stateProvider
      .state('cbh', {
        url: '',

        templateUrl: 'views/cbh.html',
        abstract: true,

        controller: function($scope, $rootScope, $state, $location, $modal, urlConfig, loggedInUser, projectList, prefix, $compile, MessageFactory, skinConfig, InvitationFactory) {

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
              controller: ['$scope', '$rootScope', '$modalInstance', '$timeout', 'CBHCompoundBatch', 'ProjectFactory',
                function($scope, $rootScope, $modalInstance, $timeout, CBHCompoundBatch, ProjectFactory) {

                  $scope.isNewCompoundsInterface = isNewCompoundsInterface;
                  $scope.editMode = false;
                  $scope.mol = angular.copy(mol);
                  var split = mol.project.split("/");
                  var projid = split[split.length - 1];
                  $scope.projectWithCustomFieldData;
                  angular.forEach($rootScope.projects, function(myproj) {
                    if (myproj.id.toString() == projid) {
                      $scope.projectWithCustomFieldData = myproj;
                      $scope.projectWithCustomFieldData.updateCustomFields();
                      $scope.projectObj = myproj;
                    }
                  });
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
                  cbh.isUpdated = false;
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




        },
        controllerAs: "cbh",

      })

    // HOME STATES AND NESTED VIEWS ========================================
    .state('404', {
      url: '/404',
      /*data: {
        login_rule: ""
      },*/
      templateUrl: '404.html',
      controller: function($scope) {

      }
    })



    .state('cbh.search', {
      url: '/search?creator_uri=textsearch=created_by=editMode=&archived=&projectFrom=&scroll=&scrollTop=&sorts=&page=&compoundBatchesPerPage=&project__project_key__in&functional_group&flexmatch&related_molregno__chembl__chembl_id__in&with_substructure&similar_to&fpValue&created__gte&created__lte&molfile&smiles&search_custom_fields__kv_any&multiple_batch_id=&viewType=&doScroll=&showBlanks=&showNonBlanks=&limit&offset',
      //url: '/search',
      //params: ['project__project_key', 'flexmatch', 'with_substructure', 'similar_to', 'fpValue', 'created__gte', 'created__lte', 'molfile', 'smiles', 'limit', 'offset', 'random'],
      resolve: {
        gridconfig: ['CompoundListSetup', function(CompoundListSetup) {
          return CompoundListSetup;
        }],
        projectFactory: ['ProjectFactory', function(ProjectFactory) {
          return ProjectFactory;
        }],

        messages: ['MessageFactory', function(MessageFactory) {
          return MessageFactory.getMessages();
        }],

      },

      views: {
        '': {
          templateUrl: 'views/search.html',
        },
        'form@cbh.search': {
          controller: 'SearchCtrl',
          templateUrl: 'views/templates/search-template.html'
        },

        'newresults@cbh.search': {
          templateUrl: 'views/compound-list-new.html',
          controller: 'CompoundbatchCtrl'
        },

      }


    })

    .state('cbh.search_assays', {
      url: '/search-assays?textsearch=&l0=&l1=&l2=&start=&end=&useruris=',
      resolve: {
        /*project_with_forms : ['AddDataFactory',function(AddDataFactory){
          return AddDataFactory.pwf.get(function(data){
            console.log(data)
            return data;
          }).$promise;
        }

        ]*/
      },
      templateUrl: 'views/searchassays.html',
      controller: 'SearchAssaysCtrl',
      controllerAs: 'searchassay',


    })

    .state('cbh.help', {
      //parent: 'Default',
      url: '/help',

      resolve: {
        messages: ['MessageFactory', function(MessageFactory) {
          return MessageFactory.getMessages();
        }],
      },
      templateUrl: 'views/help.html',
      controller: function($scope, $rootScope, $anchorScroll, $location) {
        $scope.slides = [{
          image: "images/add-compounds-v2.gif",
          text: "Adding compounds"
        }, {
          image: "images/searching-v2.gif",
          text: "Searching by tag"
        }, {
          image: "images/searching-struc-v2.gif",
          text: "Searching by structure"
        }, ];
        $rootScope.projName = "";

        $scope.scrollTo = function(id) {
          $location.hash(id);
          $anchorScroll();
        }
      }
    })

    .state('cbh.projects', {
      url: '/projects',

      resolve: {
        gridconfig: ['CompoundListSetup', function(CompoundListSetup) {
          return CompoundListSetup;
        }],
        messages: ['MessageFactory', function(MessageFactory) {
          return MessageFactory.getMessages();
        }],



      },
      templateUrl: 'views/projects.html',
      controller: 'ProjectCtrl'
    })

    .state('cbh.users', {
      url: '/users',
      templateUrl: 'views/users-list.html',
      resolve: {
        userList: ['UserFactory', function(UserFactory) {
          return UserFactory.get().$promise;
        }],
        messages: ['MessageFactory', function(MessageFactory) {
          return MessageFactory.getMessages();
        }],
      },
      controller: function($scope, $rootScope, userList) {
        $scope.users = userList.objects;
        $rootScope.projName = "Projects";
      },
    })

    .state('cbh.user', {
      url: '/user/:username',
      templateUrl: 'views/user-profile.html',
      resolve: {
        userFromList: ['UserFactory', '$stateParams', '$q', function(UserFactory, $stateParams, $q) {
          var deferred = $q.defer();
          UserFactory.get({
            'username': $stateParams.username
          }, function(r) {
            deferred.resolve(r);
          });
          return deferred.promise;
        }],
        batchesForUser: ['CBHCompoundBatch', 'userFromList', '$q', function(CBHCompoundBatch, userFromList, $q) {
          var deferred = $q.defer();
          CBHCompoundBatch.multiBatchForUser(userFromList.objects[0].username).then(function(m) {
            deferred.resolve(m);
          });
          return deferred.promise;
        }],
        messages: ['MessageFactory', function(MessageFactory) {
          return MessageFactory.getMessages();
        }],
      },
      controller: function($scope, $rootScope, userFromList, batchesForUser) {
        $scope.userFromList = userFromList.objects[0];
        $scope.batchesForUser = batchesForUser.objects;
        $rootScope.projName = "Projects";

      },
    })

    .state('cbh.projects.list', {
      url: '/list',
      templateUrl: 'views/projects-list.html',
      controller: function($rootScope, $state, $stateParams, $scope, AddDataFactory, $modal, ProjectFactory, ProjectTypeFactory) {
      var chemical_type = "";

        var refreshProjectTypes = function(){
                ProjectTypeFactory.get({}, function(data){
                  $rootScope.projectTypes = data.objects.map(function(pType){
                      
                      if(pType.name=="chemical"){
                        chemical_type = pType;
                      }
                      return {"name": pType.name, "value" : pType};
                    });
                  
                  });
                
              }
        refreshProjectTypes();


        $scope.openProjectWindow = function(index){
          $scope.modalInstance = $modal.open({
            templateUrl: 'views/modal-edit-project.html',
            size: 'lg',
            controller: function($scope, $modalInstance) {
              var pid;
              $scope.modalInstance = $modalInstance;
              if(index == -1){

                  
              
                $scope.operation = "add";
                $scope.proj = {
                  "project_type": chemical_type,
                  "custom_field_config":{
                    "project_data_fields": [{"required":false, "field_type": "char", "open_or_restricted": "open"},]

                  }
                  
               };
              }else{
                 pid= $rootScope.projects[index].id;
                ProjectFactory.get({"projectId": pid}, function(data){
                  $scope.proj = data;
                  $scope.operation = "update";
                //Set the object reference for projectType
                  $rootScope.projectTypes.forEach(function(pType){
                      if(pType.value.id==$scope.proj.project_type.id){
                        $scope.proj.project_type = pType.value;
                      }
                  });
                });

                
              }
              var field_types = [{"name": "Short text", "value": "char"},  
              {"name": "Full text", "value": "textarea"}, 
              {"name": "Choice", "value": "uiselect"}, 
              {"name": "Integer field", "value": "integer"},
               {"name": "Decimal field", "value": "number"}, 
               {"name": "Choice allowing create", "value": "uiselecttag"}, 
               {"name": "Tags field allowing create", "value": "uiselecttags"}, 
               {"name": "Percentage field", "value": "percentage"},
                {"name": "Date Field", "value": "date"}, 
                {"name": "Link to server or external", "value": "href"}, 
                {"name": "Image link to embed", "value": "imghref"}, 
                {"name": "Decimal field", "value": "decimal"}, 
                {"name": "checkbox", "value": "boolean"}];
              var restrictions = [
                {"value": "open","name":"Open"},
                {"value": "restricted","name":"Restricted to editors"}
              ];


              $scope.projectForm = [
                  {"key":"name",
                    "htmlClass": "col-sm-5",
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
                    "titleMap": $rootScope.projectTypes,
                    "htmlClass": "col-sm-5",
                    "disableSuccessState":true,
                    "feedback": false

                },
                {
                    "key": "custom_field_config.project_data_fields",
                    "title": "Project Data Fields",
                    "type": "array",

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
                      "isReadOnly" : function(value){
                        var readonly = false;
                        angular.forEach($scope.proj.custom_field_config.project_data_fields, function(item){
                          if(item.name==value){
                            if(item.id){
                              readonly = true;
                            }
                          }
                        });
                        return readonly;
                      }


                    },
                      {"title": "Required",
                      "type":"select",
                      "disableSuccessState":true,
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
                        "key":"default",
                        "title": "Default Value",
                       "condition": "model.custom_field_config.project_data_fields[arrayIndex].required"
                     }, 
                      {  "htmlClass": "col-sm-6",
                        "key":"allowed_values",
                        "title": "Allowed values (comma-separated)",
                       "condition": "(model.custom_field_config.project_data_fields[arrayIndex].field_type == 'uiselect' || model.custom_field_config.project_data_fields[arrayIndex].field_type == 'uiselecttags' || model.custom_field_config.project_data_fields[arrayIndex].field_type == 'uiselecttag')"
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
                                              "type": "string",
                                              "enum": $rootScope.projectTypes.map(
                                                function(pT){
                                                    return pT.value
                                                }),
                                              "default": chemical_type,

                                            },

                                          "custom_field_config":
                                                { "type": "object","properties":{

                                                  "project_data_fields":
                                                  {
                                                    "type": "array",
                                                    "items": {
                                                      "type": "object",
                                                      "properties": {
                                                        "name": { "type": "string", "default":"", "pattern": "^[^./\"',]*$" , "validationMessage" : {202: "Dots, commas, quotes and slashes not permitted in field names"}},
                                                        "description": { "type": "string" },
                                                        "required": { "type": "boolean","default":false},
                                                        "field_type": {"type":"string",
                                                        "default": "char",
                                                        "enum":field_types.map(function(r){
                                                          return r.value
                                                        })
                                                          },
                                                        "open_or_restricted":{"type":"string",
                                                        "enum":restrictions.map(function(r){
                                                          return r.value
                                                        }),
                                                        "default" : "open"
                                                          },
                                                          "allowed_values":{
                                                            "type":"string",

                                                          },
                                                            "default":{
                                                            "type":"string",

                                                          }

                                                        
                                                      }
                                                    }
                                                  }}
                                          }
                                        }
                                      };
              
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
                  console.log(dupes)
                  console.log(names)
                  
                  if(dupes.length>0){
                    $scope.errormess = "Duplicate names found:   " + dupes.join(", ");
                  }
              }

              $scope.saveChanges = function(){
                  var callback = function(data){
                    $rootScope.projects[index] = $scope.proj;
                    $modalInstance.dismiss('cancel');
                    location.reload(true);
                  };
                  checkForDuplicateNames();
                  $scope.$broadcast('schemaFormValidate');
                    if($scope.projectForm.$valid && !$scope.errormess ){
                      if($scope.operation = "add"){
                       ProjectFactory.save($scope.proj, callback);
                      }else{
                        ProjectFactory.update({"projectId": $scope.proj.id}, $scope.proj, callback);
                      }
                    }else{

                    }
              };
            }
          });
   
        }

        
        $scope.cbh.appName = "Platform";

        $rootScope.headline = $scope.cbh.skinning.project_alias + " List";
        $rootScope.subheading = "A list of all of the projects you have access to.";
        $rootScope.help_lookup = "";
        $rootScope.projectKey = $scope.cbh.skinning.project_alias + "s";
        $rootScope.projName = $scope.cbh.skinning.project_alias + "s";
        $rootScope.glyphicon = "folder-open";

        //if a new user has no projects associated, refdirect them to a default view with supplementary info
        // if(angular.equals({}, $rootScope.projects)) {
        //   $state.go('cbh.projects.empty');
        // }
        $scope.isDefault = true;
        $scope.toggleDataSummary = {
          showFlag: false,
        }
        $scope.toggleSingleForm = {
          showFlag: false,
        };
        

       
        /* Provide a link from the project list page to the assayreg page for items in this project which have been added by this user */
        $scope.cbh.searchForUserWithProjectKey = function(projKey){
          AddDataFactory.nestedDataClassification.get({
                        "project_key": projKey,
                    },
                    function(data) {
                        if (data.objects.length >= 1) {
                          //forward to the assayreg search with this project and this user prepopulated
                            $state.go('cbh.search_assays', {
                              'useruris': [ $scope.cbh.logged_in_user.resource_uri ],
                              'l0': [ data.objects[0].l0.resource_uri ],
                            })

                        } else {
                          //there's no data for that assayreg project - just let them search their name
                            $state.go('cbh.search_assays', {
                              'useruris': [ $scope.cbh.logged_in_user.resource_uri ]
                            })
                        }
                    }
                );
        };

      }
    })

    // .state('cbh.projects.empty', {
    //   url: '/newuser',
    //   templateUrl: 'views/no-projects.html',
    //   controller: function($scope) {

    //   }

    // })

 

    
    .state('cbh.projects.project', {
        url: window.projectUrlMatcher,
        templateUrl: 'views/project-full.html',
        controller: function($scope, $rootScope, $state, projectKey) {
          //need to check here thaat project is valid
          //we already have a list of allowed projects - if none of these, redirect to project list?
          $rootScope.projectKey = projectKey;
          $scope.cbh.searchPage = function() {
            $state.go('cbh.search', {
              "project__project_key__in": projectKey
            }, {
              reload: true
            });
          };
        },
        resolve: {
          projectKey: ['$stateParams', function($stateParams) {
            return $stateParams.projectKey;
          }]
        }
      })
      .state('cbh.projects.project.addcompounds', {
        url: 'addcompounds/?mb_id=&warningsFilter=&page=&compoundBatchesPerPage=&sorts=',
        templateUrl: 'views/add-compounds2.html',
        controller: 'AddCompoundsCtrl',
        // reloadOnSearch: false
      })
      .state('cbh.projects.project.addsingle', {
        url: 'addsingle/?mb_id=&warningsFilter=',
        templateUrl: 'views/add-single-compound.html',
        controller: 'AddSingleCompoundCtrl',
      })
    .state('cbh.projects.project.assay', {
      url: 'assay/',
      controllerAs: 'assayctrl',
      abstract:true,
      resolve: {
        project_with_forms : ['projectKey','AddDataFactory',function(projectKey, AddDataFactory){
          return AddDataFactory.pwf.get({"project_key": projectKey }, function(data){
            return data;
          }).$promise;
        }

        ]
      },
      controller:  function($scope, $stateParams, $rootScope, AddDataFactory, project_with_forms, projectKey, CustomFieldConfig) {
            var assayctrl = this;
            assayctrl.dfc_lookup  = {};
            assayctrl.proj = project_with_forms.objects[0];
            $scope.cbh.appName = "AssayReg";

            angular.forEach(assayctrl.proj.data_form_configs, function(dfc){
              dfc.get_main_schema = function(){
                return CustomFieldConfig.getSchema(dfc[dfc.last_level].project_data_fields);
                
              };
              dfc.get_main_form = function(){
                return CustomFieldConfig.getForm(dfc[dfc.last_level].project_data_fields);
              }
              assayctrl.dfc_lookup[dfc.resource_uri] = dfc;
              if(dfc.last_level == "l0"){
                assayctrl.l0_dfc = dfc;
                assayctrl.l0_cfc = assayctrl.l0_dfc["l0"];
                assayctrl.l0_schema = dfc.get_main_schema();
                assayctrl.l0_form = dfc.get_main_form();
              }
            });
            angular.forEach(assayctrl.proj.data_form_configs, function(dfc){
              dfc.full_permitted_children = dfc.permitted_children.map(function(uri){
                return assayctrl.dfc_lookup[uri];
              })
            });

            
        },
      templateUrl: 'views/demo-add.html',

    })


    /* ASSAYREG IMPLEMENTATION */
    .state('cbh.projects.project.assay.add_data', {
      url: 'add_data/:dc?lev=&data_form_id=',
      templateUrl: 'views/add-data.html',
      controller: 'AddDataCtrl',
      controllerAs: 'addctrl',
    })

    .state('cbh.projects.project.assay.edit_data', {
      url: 'edit_data/:dc?lev=',
      templateUrl: 'views/edit-data.html',
      controller: 'EditDataCtrl',
      controllerAs: 'editctrl',
    })

    .state('cbh.projects.project.assay.view_data', {
      url: 'view_data/:dc',
      templateUrl: 'views/view-data.html',
      controller: 'ViewDataCtrl',
      controllerAs: 'viewctrl',
    })

    .state('cbh.projects.project.assay.data_overview', {
      url: 'data_overview/',
      templateUrl: 'views/data-overview.html',
      controller: 'DataOverviewCtrl',
      controllerAs: 'dataoverviewctrl',
      /*views: {
        'multiple': {
          templateUrl: 'views/assayupload.html',
          controller: 'AssayUploadCtrl',
        },
      },*/
    })




  }).run(function($http, $cookies, $rootScope, $document, $state, $urlMatcherFactory, LoginService, projectList, urlConfig, prefix) {
    var pref = prefix.split("/")[0];
    $http.defaults.headers.post['X-CSRFToken'] = $cookies[pref + "csrftoken"];
    $http.defaults.headers.patch['X-CSRFToken'] = $cookies[pref + "csrftoken"];
    $http.defaults.headers.put['X-CSRFToken'] = $cookies[pref + "csrftoken"];


    
      var projKeys = projectList.objects.map(function(item) {
        return item.project_key;
      });
      $rootScope.urlMatcher = $urlMatcherFactory.compile("/{projectKey:" + projKeys.join('|') + "}/?limit&offset");
    


    $rootScope.$on('$stateChangeSuccess', function(e, to) {

      $document.scrollTop(0, 0);
    });

    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
      console.log(error);
    });



  })
  .factory('authHttpResponseInterceptor', ['$q', '$location', 'urlConfig', function($q, $location, urlConfig) {
    return {
      response: function(response) {
        if (response.status === 401) {
          console.log("Response 401");
        }
        return response || $q.when(response);
      },
      responseError: function(rejection) {
        // if (rejection.status === 401) {
        //     console.log("Response Error 401",rejection);
        //     window.location = urlConfig.instance_path.url_frag + "login"
        //     //$location.path('/login').search('returnTo', $location.path());
        // }
        return $q.reject(rejection);
      }
    }
  }]).config(['ngClipProvider', function(ngClipProvider) {
    ngClipProvider.setPath("bower_components/zeroclipboard/dist/ZeroClipboard.swf");
  }])
    //Here we define our interceptor
    .factory('globalInterceptor', function($q, $raven){
        //When the interceptor runs, it is passed a promise object

        return {
            response: function(response) {

              return response || $q.when(response);
            },
            responseError: function(rejection) {
              if (["4", "5"].indexOf(rejection.status.toString().substring(0,1) ) > -1) {
                //Capture all 4 and 500 errors passing the extra data 
               Raven.captureException(JSON.stringify(rejection.config),{"extra": rejection.data});
              }
              return $q.reject(rejection);
            }
        }
        
    })
  .config(['$httpProvider', function($httpProvider) {
    //Http Intercpetor to check auth failures for xhr requests
    $httpProvider.interceptors.push('authHttpResponseInterceptor');
    $httpProvider.interceptors.push('globalInterceptor');
  }]);