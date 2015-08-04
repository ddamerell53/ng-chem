'use strict';

/**
 * @ngdoc overview
 * @name ngChemApp
 * @description
 * # ngChemApp
 *
 * Main module of the application.
 */
angular.module('ngChemApp')


  .config(function ($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {
      
          // catch all route
    // send users to the form page 
    $urlRouterProvider.otherwise('/404');


      $urlMatcherFactoryProvider.defaultSquashPolicy("slash");      
      var modalInstance;
      $stateProvider
         .state('cbh', {
          url: '',

            templateUrl: 'views/cbh.html',
            abstract : true,
            
            controller: function($scope, $rootScope, $state, $location, $modal, urlConfig, loggedInUser, projectList, prefix, $compile, MessageFactory, skinConfig) {
                var cbh = this;
                cbh.logged_in_user = loggedInUser;
                cbh.projects = projectList;
                cbh.skinning = skinConfig.objects[0];
                //$scope.skinning = cbh.skinning;
                cbh.prefix = urlConfig.instance_path.base;
                cbh.api_base = urlConfig.admin.list_endpoint;
                cbh.searchPage =   function(){
                  $state.go('cbh.search', {}, {reload:true} );
                }
                $scope.projects = projectList.objects;

                $rootScope.projects = projectList.objects;
                 $scope.projects.map(function(proj){
                  if (!proj.is_default){
                    $scope.isDefault = false;
                  }
                });
                angular.element(document).ready(function() {

                  angular.element("info-box", function() {
                  });
                });
                $scope.isLoggedIn = function() {
                var loggedIn = false;
                    if(cbh.logged_in_user.id > 0) {
                      loggedIn = true;
                    }
                    return loggedIn;
                };

                $rootScope.getUrlBase = function() {
                  return urlConfig.instance_path.url_frag;
                };

                $scope.getProjectObj = function(projectKey){
                  angular.forEach($scope.projects, function(proj){
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
                  angular.forEach(newValue, function(item){
                    if(angular.isObject(item)){
                      item = angular.fromJson(angular.toJson(item));  
                    }
                    strippedValues.push(item);
                  })

                  //work out the array difference so we know which value to add to (or remove from) the search form
                  //the order of supplying arrays is important in these comparators, hence the size comparison conditional
                  //we need to use underscore filter for object array comparison
                  //we need to use underscore difference for string array comparison
                  if(angular.isDefined(newValue) && angular.isDefined(oldValue)){
                    if( newValue.length > oldValue.length) {
                    addOrRemove = "add"
                    //work out which values are in the new value but not the old value
                    if(arrayContains == "obj"){
                      var valToSend = _.filter(strippedValues, function(obj){ return !_.findWhere(oldValue, obj); });
                    }
                    else if (arrayContains == "string") {
                      var valToSend = _.difference(strippedValues, oldValue);
                    }
                    
                  }
                  else if (oldValue.length > newValue.length){
                    addOrRemove = "remove";
                    //work out which values are in the old value but not the new value
                    if(arrayContains == "obj"){
                      var valToSend = _.filter(oldValue, function(obj){ return !_.findWhere(strippedValues, obj); });
                    }
                    else if (arrayContains == "string") {
                      var valToSend = _.difference(oldValue, strippedValues);
                    }
                    
                  }

                  return {'newValue': valToSend[0], 'addOrRemove': addOrRemove};
                  }
                  
              }

              cbh.openSingleMol = function(mol, isNewCompoundsInterface, editingOnlyProperty) {
                  var templateU = editingOnlyProperty ? 'views/templates/single-field.html':'views/templates/single-compound-full.html';

                  var editingClass = editingOnlyProperty ? 'editing' : '';

                  $scope.modalInstance = $modal.open({
                    templateUrl: templateU,
                    size: 'lg',
                    windowClass: editingClass,
                    controller: ['$scope','$rootScope', '$modalInstance', '$timeout', 'CBHCompoundBatch', 'ProjectFactory',
                    function($scope, $rootScope, $modalInstance,  $timeout, CBHCompoundBatch, ProjectFactory) {
                      $scope.isNewCompoundsInterface = isNewCompoundsInterface;
                      $scope.editMode = false;
                      $scope.mol = angular.copy(mol);
                      var split = mol.project.split("/");
                      var projid = split[split.length-1];
                      $scope.projectWithCustomFieldData;
                      angular.forEach($rootScope.projects,function(myproj){
                        if(myproj.id.toString() == projid){
                          $scope.projectWithCustomFieldData = myproj;
                          $scope.projectObj = myproj;
                        }
                      });
                      $scope.singleForm = false;

                      if(editingOnlyProperty){
                        angular.forEach($scope.projectWithCustomFieldData.schemaform.form, function(formItem){
                          if(formItem.key === editingOnlyProperty.split(".")[1]){
                            $scope.singleForm = [angular.copy(formItem)];
                          }
                        });
                      }
                      

                      var myform = $scope.projectWithCustomFieldData.schemaform.form;
                      var len = Math.ceil( myform.length/2);
                      $scope.firstForm = angular.copy(myform).splice(0, len);
                      $scope.secondForm = angular.copy(myform).splice(len);
                      $scope.myform2 = angular.copy(myform);
                      $scope.init = function(){
                         $scope.keyValues = $scope.myform2.map(

                            function(item){
                              var key = item;
                              if(angular.isDefined(item.key)){
                                key =item.key
                              };
                              var value = "";
                              if (angular.isDefined($scope.mol.customFields[key])){


                                  value = $scope.mol.customFields[key]

                              }
                              if (value.constructor === Array){
                                value = value.join(", ");
                              }
                              return {'key':key, 'value':value };
                            }
                          );

                      $scope.firstList = $scope.keyValues.splice(0, len);
                      $scope.secondList = $scope.keyValues;

                      };
                      $scope.init();
                     

                      $scope.removeAlert = function(){
                        $scope.update_success = false;
                      }
                      cbh.isUpdated = false;
                      $scope.updateBatch = function(instance){
                        CBHCompoundBatch.patch({"customFields" : $scope.mol.customFields,
                                                "projectKey" : $scope.projectWithCustomFieldData.project_key,
                                                "id": $scope.mol.id}).then(
                            function(data){
                              $scope.mol.customFields=data.customFields;
                              mol.customFields=data.customFields;
                              //reindex the compound
                              CBHCompoundBatch.reindexModifiedCompound($scope.mol.id);
                              $scope.update_success = true;
                              $scope.editMode = false;
                              $scope.init();
                              $timeout($scope.removeAlert, 5000);
                              cbh.isUpdated = true;
                              if(angular.isDefined(instance)){
                                instance.dismiss('cancel');
                              }
                              
                            }
                          );
                      }
                      $scope.myschema = $scope.projectWithCustomFieldData.schemaform.schema;
                      $scope.modalInstance = $modalInstance;
            // $scope.$watch('mol', function(n,o), true){
            //   $scope.pointers = n;
            // });    

                    }]
                  }).result.finally(function() {
                      if(cbh.isUpdated){
                        $rootScope.$broadcast("updateListView");
                      }
                });
                };




            },
            controllerAs : "cbh",
            
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
            url: '/search?editMode=&archived=&projectFrom=&scroll=&scrollTop=&sorts=&page=&compoundBatchesPerPage=&project__project_key__in&functional_group&flexmatch&related_molregno__chembl__chembl_id__in&with_substructure&similar_to&fpValue&created__gte&created__lte&molfile&smiles&search_custom_fields__kv_any&multiple_batch_id=&viewType=&doScroll=&showBlanks=&showNonBlanks=&limit&offset',
            //url: '/search',
            //params: ['project__project_key', 'flexmatch', 'with_substructure', 'similar_to', 'fpValue', 'created__gte', 'created__lte', 'molfile', 'smiles', 'limit', 'offset', 'random'],
            resolve:{
              gridconfig: ['CompoundListSetup', function(CompoundListSetup){
                  return CompoundListSetup;
              }],
              projectFactory: ['ProjectFactory', function(ProjectFactory) {
                return ProjectFactory;
              }],
             
              projectKey: ['$stateParams', function($stateParams){
                  //There is no project key but this needs to be here to stop us breaking the batch controller
                  return "";
              }],
             

              paramsAndForm: ['$stateParams', 'searchUrlParams', 
                  function($stateParams, searchUrlParams){
                      return searchUrlParams.setup($stateParams, {molecule: {}});
                  }],
              messages: ['MessageFactory', function(MessageFactory){
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
             
              'newresults@cbh.search' :{
                templateUrl: 'views/compound-list-new.html',
                controller: 'CompoundbatchCtrl'
              },

            }
            
            
        })

        .state('cbh.help', {
            //parent: 'Default',
            url: '/help',
            
            resolve:{
              messages: ['MessageFactory', function(MessageFactory){
                return MessageFactory.getMessages();
              }],
            },
            templateUrl: 'views/help.html',
            controller: function($scope, $rootScope) {
              $scope.slides = [
                { image: "images/add-compounds-v2.gif", text: "Adding compounds" },
                { image: "images/searching-v2.gif", text: "Searching by tag" },
                { image: "images/searching-struc-v2.gif", text: "Searching by structure" },
              ];
              $rootScope.projName = "";
            }
        })

        .state('cbh.projects', {
            url: '/projects',
            
            resolve:{
              gridconfig: ['CompoundListSetup', function(CompoundListSetup){
                  return CompoundListSetup;
              }],
              messages: ['MessageFactory', function(MessageFactory){
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
              messages: ['MessageFactory', function(MessageFactory){
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
                UserFactory.get({'username': $stateParams.username }, function(r){
                  deferred.resolve(r);
                });
                return deferred.promise;
              }],
              batchesForUser: ['CBHCompoundBatch', 'userFromList', '$q', function(CBHCompoundBatch, userFromList, $q) {
                var deferred = $q.defer();
                CBHCompoundBatch.multiBatchForUser(userFromList.objects[0].username).then(function(m){
                  deferred.resolve(m);
                });
                return deferred.promise;
              }],
              messages: ['MessageFactory', function(MessageFactory){
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
            controller: function($rootScope, $state, $stateParams, $scope) {
              $rootScope.headline = $scope.cbh.skinning.project_alias + " List";
              $rootScope.subheading = "Click a " + $scope.cbh.skinning.project_alias + " title to see more details and add compounds or items to that " + $scope.cbh.skinning.project_alias;
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
              $scope.addSingleRecord = function(projKey){
                console.log('hello');
                $scope.toggleSingleForm.showFlag = true;
                console.log(projKey);
                $state.go('cbh.projects.list.project', {'projectKey': projKey, 'page':1, 'sorts':[]});
              };
              
            }
        })

        // .state('cbh.projects.empty', {
        //   url: '/newuser',
        //   templateUrl: 'views/no-projects.html',
        //   controller: function($scope) {

        //   }

        // })

        .state('cbh.projects.list.project', {
            url: window.projectUrlMatcher + "?editMode=archived=?page=&compoundBatchesPerPage=&viewType=&doScroll=&sorts=",
            resolve: {
              projectKey: ['$stateParams', function($stateParams){
                  return $stateParams.projectKey;
              }],
              paramsAndForm: ['$stateParams', 'searchUrlParams', 
                  function($stateParams, searchUrlParams){     
                      return searchUrlParams.fromForm({"project__project_key__in" : [$stateParams.projectKey,]});
              }]
              
            },
           
            views: {
              projectsummary: {
                templateUrl: 'views/project-summary.html',
                controller: function($scope, $state,  projectKey, CBHCompoundBatch){
                   $scope.projects = $scope.cbh.projects.objects;
                      angular.forEach($scope.projects, function(proj) {
                        if(proj.project_key == projectKey) {
                          $scope.proj = proj;
                          $scope.cbh.includedProjectKeys = [$scope.proj.project_key];

                        }
                      });
                      var myform = angular.copy($scope.proj.schemaform.form);
                      $scope.myschema = angular.copy($scope.proj.schemaform.schema);
                      $scope.formChunks = myform.chunk(Math.ceil($scope.proj.schemaform.form.length/3));
                      $scope.blankForm = function(){
                           $scope.newMol = {"customFields" : {}};
                      };
                      $scope.blankForm();
                      $scope.saveSingleCompound = function(){
                        CBHCompoundBatch.saveSingleCompound(projectKey, '', $scope.newMol.customFields).then(
                          function(data){
                            CBHCompoundBatch.reindexModifiedCompound(data.data.id).then(function(reindexed){
                                $state.go($state.current, {"page" : 1, "sorts": [], "filters": undefined}, {reload: true});
                            });
                          }
                        );
                      }
                      

                  $scope.cbh.searchPage =   function(){
                    $state.go('cbh.search', {"project__project_key__in": $scope.proj.project_key}, {reload:true} );
                  };
                },
              },
              'newresults' :{
                templateUrl: 'views/compound-list-new.html',
                controller: 'CompoundbatchCtrl'
              },
            }
            
        })

        .state('cbh.projects.project', {
            url: window.projectUrlMatcher,
            templateUrl: 'views/project-full.html',
            controller: function($scope, $rootScope,$state, projectKey) {
              //need to check here thaat project is valid
              //we already have a list of allowed projects - if none of these, redirect to project list?
              $rootScope.projectKey = projectKey;
              $scope.cbh.searchPage =   function(){
                    $state.go('cbh.search', {"project__project_key__in": projectKey}, {reload:true} );
                  };
            },
            resolve: {
              projectKey: ['$stateParams', function($stateParams){
                  return $stateParams.projectKey;
              }]
            }
        })
        .state('cbh.projects.project.addcompounds',{
          url: 'addcompounds/?mb_id=&warningsFilter=&page=&compoundBatchesPerPage=&sorts=',
          templateUrl : 'views/add-compounds2.html',
          controller : 'AddCompoundsCtrl',
          // reloadOnSearch: false
        })

        .state('cbh.projects.add', {
            url: 'add',
            templateUrl: 'views/projects-add.html',
            controller: function($rootScope){
              $rootScope.headline = "Add a new Project"
              $rootScope.subheading = ""
              $rootScope.help_lookup = ""
              $rootScope.glyphicon = "folder-open";
            }
        })




        .state('cbh.projects.project.demo', {
            
            resolve:{
              projectFactory: ['ProjectFactory', function(ProjectFactory) {
                return ProjectFactory;
              }],
              
            },
            url: 'demo',
            templateUrl: 'views/start.html',
            controller: 'DemoCtrl'
        })
        
        // nested states 
        // each of these sections will have their own view
        // url will be nested (/form/profile)
        .state('cbh.projects.project.demo.intro', {
            url: '/intro',
            templateUrl: 'views/demo-intro.html',
            controller: function($scope) {
              $scope.wizard.step = 0;
              $scope.wizard.dynamic = 0;
              $scope.wizard.totalSteps = 0;
              applyTicks("intro");
            }
        })

        .state('cbh.projects.project.demo.add', {
            url: '/add',
            templateUrl: 'views/demo-add.html',
            controller: function($scope) {
              $scope.wizard.step = 1;
              $scope.wizard.dynamic = 41;
              applyTicks("add");
              


            }
        })

        .state('cbh.projects.project.demo.add.single', {
            url: '/single',
            templateUrl: 'views/demo-add-single.html',
            controller: function($scope) {
             
                $scope.single=true;

                $scope.wizard.step = 1;
                $scope.wizard.dynamic = 49.5;
                //only need 2 wizard steps if this is the case
                $scope.wizard.totalSteps = 2;

                

                $scope.errors = [];

                //default selection set in the scope molecule object, select box value bound to form.                                           
                
                $scope.sketchMolfile = "";
     
                $scope.open_warnings = false;
                
            }
        })

        .state('cbh.projects.project.demo.add.multiple', {
            url: '/multiple',
            templateUrl: 'views/demo-add-multiple.html',
            controller: function($scope) {
              $scope.filedata.flow.files=[];
              $scope.startAgain();
              $scope.wizard.step = 1;
              $scope.wizard.dynamic = 41;
              $scope.wizard.totalSteps = 4;

              
            }
        })


        // url will be /form/interests
        .state('cbh.projects.project.demo.validate', {
            url: '/validate/:multiple_batch_id',
            resolve: {
              multiple_batch_id: ['$stateParams', function($stateParams){
                  return $stateParams.multiple_batch_id;
              }],
            },
            templateUrl: 'views/demo-validate.html',
            controller: function($scope) {
              $scope.fullPage="col-md-3";
              $scope.wizard.step = 2;
              $scope.wizard.dynamic =  58;
              applyTicks("validate");
            }
        })

        .state('cbh.projects.project.demo.map', {
            url: '/map/:multiple_batch_id',
            resolve: {
              multiple_batch_id: ['$stateParams', function($stateParams){
                  return $stateParams.multiple_batch_id;
              }],
            },
            templateUrl: 'views/demo-map.html',
            controller: function($scope) {
              $scope.wizard.step = 3;
              $scope.wizard.dynamic = 74;

              applyTicks("map");
            }
        })

        .state('cbh.projects.project.demo.map.file', {
            url: '/map-file',
            templateUrl: 'views/demo-map-file.html',
            controller: function($scope) {
              
            }
        })
        .state('cbh.projects.project.demo.map.multiple', {
            url: '/map-multiple',
            templateUrl: 'views/demo-map-multiple.html',
            controller: function($scope) {

            }
        })
        
        // url will be /form/payment
        .state('cbh.projects.project.demo.map.finish', {
            url: '/finish/?page=&compoundBatchesPerPage=&viewType=&doScroll=',
            resolve: {
              multiple_batch_id: ['$stateParams', function($stateParams){
                  return $stateParams.multiple_batch_id;
              }],
              paramsAndForm: ['$stateParams', 'searchUrlParams', 
                  function($stateParams, searchUrlParams){     
                      return searchUrlParams.fromForm({'multiple_batch_id' : $stateParams.multiple_batch_id
                        ,"project__project_key__in" : [$stateParams.projectKey,]});
              }]
            },
              
            views: {
              '': {
                templateUrl: 'views/demo-finish.html',
                controller: function($scope, $stateParams) {

                  if ($scope.wizard.totalSteps == 4) {
                    $scope.wizard.step = 4;
                  }
                  else {
                    $scope.wizard.step = 2;
                  }
                  
                  $scope.wizard.dynamic = 100;
                  applyTicks("finish");
                  $scope.multiple_batch_id = $stateParams.multiple_batch_id;

                }
              },
              'newresults@cbh.projects.project.demo.map.finish' :{
                templateUrl: 'views/compound-list-new.html',
                controller: 'CompoundbatchCtrl'
              }
              

            }
            
        })

 


  }).run(function($http, $cookies, $rootScope, $document, $state, $urlMatcherFactory, LoginService, ProjectFactory, urlConfig, prefix) {
    var pref = prefix.split("/")[0];
    $http.defaults.headers.post['X-CSRFToken'] = $cookies[pref + "csrftoken"];
    $http.defaults.headers.patch['X-CSRFToken'] = $cookies[pref + "csrftoken"];
    $http.defaults.headers.put['X-CSRFToken'] = $cookies[pref + "csrftoken"];4


   var projs = ProjectFactory.get().$promise;
   projs.then(function(data){
    var projectList= data.objects.map(function(item){
      return item.project_key;
    });
    $rootScope.urlMatcher = $urlMatcherFactory.compile("/{projectKey:" + projectList.join('|') + "}/?limit&offset");
   });

    // $rootScope.$on('$stateChangeStart', function(e, to, toParams, from, fromParams) {
    //   //console.log(to.name);
    //   if (to.name == '404') return;
    //   if(to.name.lastIndexOf('singleCompound', 0) === 0) return;
      
    //   // need to stop people navigating to a nonsense/nonexistent project
    //   if (toParams.projectKey) {
    //       var flag = false;
          
            
    //         angular.forEach($rootScope.projects, function(proj) {
    //           if (toParams.projectKey == proj.project_key) {
    //             //the project key in the url is an accessible project! Have a biscuit.
    //             flag = true;
    //           }
    //         });

           
            
    //         if(flag) {
    //           $state.go(to, toParams, {notify: false});
    //         }
    //         else{

    //             e.preventDefault(); // stop current execution

    //           $state.go('cbh.projects.list', {});
    //         }
            
    //       }
          
      

    //  });

    $rootScope.$on('$stateChangeSuccess', function(e, to) {

      $document.scrollTop(0,0);
    });

    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error){ 
        console.log(error);
    });

    


  
    
}).config(['ngClipProvider', function(ngClipProvider) {
    ngClipProvider.setPath("bower_components/zeroclipboard/dist/ZeroClipboard.swf");
}])
.factory('authHttpResponseInterceptor',['$q','$location', 'urlConfig',function($q,$location, urlConfig){
    return {
        response: function(response){
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
}])
.config(['$httpProvider',function($httpProvider) {
    //Http Intercpetor to check auth failures for xhr requests
    $httpProvider.interceptors.push('authHttpResponseInterceptor');
}]);



