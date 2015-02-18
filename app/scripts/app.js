'use strict';

/**
 * @ngdoc overview
 * @name ngChemApp
 * @description
 * # ngChemApp
 *
 * Main module of the application.
 */
angular.module('ngChemApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngGrid',
    'ngSanitize',
    'ngTouch',
    'ui.router',
    'ui.bootstrap',
    'dndLists',
    'flow',
    'ngClipboard',


  ])
  .config(function ($stateProvider, $urlRouterProvider) {
      
          // catch all route
    // send users to the form page 
    //$urlRouterProvider.otherwise('/404');

    /*$urlRouterProvider.rule(function ($injector, $location) {
       //what this function returns will be set as the $location.url
        var path = $location.path(), normalized = path.toLowerCase();
        if (path != normalized) {
            //instead of returning a new url string, I'll just change the $location.path directly so I don't have to worry about constructing a new url string and so a new state change is not triggered
            $location.replace().path(normalized);
        }
        // because we've returned nothing, no state change occurs
    });*/
      var modalInstance;
      $stateProvider
          
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

        .state('search', {
            //parent: 'Default',
            url: '/search',
            data: {
              login_rule: function($rootScope) {
                return $rootScope.isLoggedIn();
              }
            },
            resolve:{
              gridconfig: ['CompoundListSetup', function(CompoundListSetup){
                  //return CompoundListSetup.get();
                  return CompoundListSetup;
              }]
            },
            templateUrl: 'views/search.html',
            controller: function($scope) {
              
            }
        })

        .state('help', {
            //parent: 'Default',
            url: '/help',
            data: {
              login_rule: function($rootScope) {
                return $rootScope.isLoggedIn();
              }
            },
            resolve:{
              /*gridconfig: ['CompoundListSetup', function(CompoundListSetup){
                  //return CompoundListSetup.get();
                  return CompoundListSetup;
              }]*/
            },
            templateUrl: 'views/help.html',
            controller: function($scope) {

            }
        })

        .state('projects', {
            //parent: 'Default',
            url: '/projects',
            data: {
              login_rule: function($rootScope) {
                return $rootScope.isLoggedIn();
              }
            },
            resolve:{
              gridconfig: ['CompoundListSetup', function(CompoundListSetup){
                  //return CompoundListSetup.get();
                  return CompoundListSetup;
              }]
            },
            templateUrl: 'views/projects.html',
            controller: 'ProjectCtrl'
        })

        .state('projects.list', {
            url: '/list',
            //templateUrl: 'views/projects-list.html',
            template: '<project-list></project-list><div class="form-views" ui-view></div>',
            controller: function($rootScope) {
              $rootScope.headline = "Projects List";
              $rootScope.subheading = "Click a project title to see more details and add compounds to that project";
              $rootScope.help_lookup = "";
              $rootScope.projectKey = "Projects";
              $rootScope.glyphicon = "folder-open";
            }
        })

        .state('projects.list.project', {
            url: '/:projectKey',
            templateUrl: 'views/project-summary.html',
            //controller: 'BatchesCtrl',
            resolve: {
              projectKey: ['$stateParams', function($stateParams){
                  return $stateParams.projectKey;
              }]
            },
            //controller to handle ng-grid paging
            //gridconfig is a service and defined in the projects parent state - cascades
            controller: function($scope, $modal, gridconfig, projectKey){
              $scope.projectKey = projectKey;
              $scope.gridconfig = gridconfig;
              $scope.gridconfig.initializeGridParams(projectKey,{}).then(function(result) {
                $scope.gridconfig.configObject.totalServerItems = result.meta.totalCount;
                $scope.gridconfig.configObject.compounds = result.objects;
              });
              //watches the paging buttons to pull in new results for the window
              $scope.$watch('gridconfig.configObject.pagingOptions', function (newVal, oldVal) {
                if (newVal !== oldVal && (newVal.currentPage !== oldVal.currentPage || newVal.pageSize !== oldVal.pageSize)) {
                  console.log('paging change');
                  $scope.gridconfig.initializeGridParams(projectKey,{}).then(function(result) {
                    $scope.gridconfig.configObject.totalServerItems = result.meta.totalCount;
                    $scope.gridconfig.configObject.compounds = result.objects;
                  });
                }
              }, true);
              $scope.modalInstance = {};
              $scope.mol = {}; 

              $scope.openSingleMol = function(uox_id) {
                angular.forEach($scope.gridconfig.configObject.compounds, function(item) {
                  
                  if (item.chemblId == uox_id) {
                    $scope.mol = item;

                  }
                });
                console.log($scope.mol);
                $scope.modalInstance = $modal.open({
                  templateUrl: 'views/single-compound.html',
                  size: 'lg',
                  resolve: {
                    mol: function () {
                      return $scope.mol;
                    }
                  }, 
                  controller: function($scope, $modalInstance, mol) {
                    $scope.mol = mol;
                    $scope.modalInstance = $modalInstance;
                  }
                });
              };
              
            },
        })

        .state('projects.project', {
            url: '/:projectKey',
            templateUrl: 'views/project-full.html',
            controller: function($rootScope, projectKey) {
              $rootScope.projectKey = projectKey;
            },
            resolve: {
              projectKey: ['$stateParams', function($stateParams){
                  return $stateParams.projectKey;
              }]
            }
        })

        .state('projects.add', {
            url: '/add',
            templateUrl: 'views/projects-add.html',
            controller: function($rootScope){
              $rootScope.headline = "Add a new Project"
              $rootScope.subheading = ""
              $rootScope.help_lookup = ""
              $rootScope.glyphicon = "folder-open";
            }
        })




        .state('projects.project.demo', {
            data: {
              login_rule: function($rootScope) {
                return $rootScope.isLoggedIn();
              }
            },
            url: '/demo',
            templateUrl: 'views/start.html',
            controller: 'DemoCtrl'
        })
        
        // nested states 
        // each of these sections will have their own view
        // url will be nested (/form/profile)
        .state('projects.project.demo.intro', {
            url: '/intro',
            templateUrl: 'views/demo-intro.html',
            controller: function($scope) {
              $scope.wizard.step = 0;
              $scope.wizard.dynamic = 0;
              $scope.wizard.totalSteps = 0;
              applyTicks("intro");
            }
        })

        .state('projects.project.demo.add', {
            url: '/add',
            templateUrl: 'views/demo-add.html',
            controller: function($scope) {
              $scope.wizard.step = 1;
              $scope.wizard.dynamic = 41;
              applyTicks("add");

            }
        })

        .state('projects.project.demo.add.single', {
            url: '/single',
            templateUrl: 'views/demo-add-single.html',
            controller: function($scope) {

                $scope.wizard.step = 1;
                $scope.wizard.dynamic = 49.5;
                //only need 2 wizard steps if this is the case
                $scope.wizard.totalSteps = 2;

                

                $scope.errors = [];

                $scope.stereochem_options = [{ name:'-1', value:'as drawn'},
                                            { name:'6', value:'achiral',}, 
                                            { name:'7', value:'racemic',}, 
                                            { name:'8', value:'single enantiomer of known absolute configuration'},
                                            { name:'9', value:'single enantiomer of unknown absolute configuration'},
                                            { name:'10', value:'single diastereoisomer of known absolute configuration'},
                                            { name:'11', value:'single diastereoisomer of unknown absolute configuration'},
                                            { name:'12', value:'meso'},
                                            { name:'13', value:'E'},
                                            { name:'14', value:'Z'},
                                            { name:'15', value:'mixture E/Z'},
                                            { name:'16', value:'cis'},
                                            { name:'17', value:'trans'},
                                            { name:'18', value:'mixture of diastereoisomers'}
                                            ];
                //default selection set in the scope molecule object, select box value bound to form.                                           
                

                $scope.sketchMolfile = "";
     
                $scope.open_warnings = false;
                

                

            }
        })

        .state('projects.project.demo.add.multiple', {
            url: '/multiple',
            templateUrl: 'views/demo-add-multiple.html',
            controller: function($scope) {
              $scope.filedata.flow.files=[];
              $scope.startAgain();
              $scope.wizard.step = 1;
              $scope.wizard.dynamic = 41;
              $scope.wizard.totalSteps = 4;
              $scope.urlBase = "/chemblws/cbh_compound_batches/";
              var arr = window.location.href.split("/");
              $scope.myUrl = arr[0] + "//" + arr[2] + $scope.urlBase;
              
            }
        })

        .state('projects.project.demo.map', {
            url: '/map',
            templateUrl: 'views/demo-map.html',
            controller: function($scope) {
              $scope.wizard.step = 2;
              $scope.wizard.dynamic = 58;

              applyTicks("map");
            }
        })

        .state('projects.project.demo.map.file', {
            url: '/map-file',
            templateUrl: 'views/demo-map-file.html',
            controller: function($scope) {
              
            }
        })
        .state('projects.project.demo.map.multiple', {
            url: '/map-multiple',
            templateUrl: 'views/demo-map-multiple.html',
            controller: function($scope) {

            }
        })
        // url will be /form/interests
        .state('projects.project.demo.validate', {
            url: '/validate',
            templateUrl: 'views/demo-validate.html',
            controller: function($scope) {
              $scope.wizard.step = 3;
              $scope.wizard.dynamic = 74;
              applyTicks("validate");
            }
        })


        
        // url will be /form/payment
        .state('projects.project.demo.finish', {
            url: '/finish',
            templateUrl: 'views/demo-finish.html',
            controller: function($scope, $timeout, gridconfig, projectKey) {

              $scope.projectKey = projectKey;
              $scope.gridconfig = gridconfig;

              var filters = {multiple_batch_id : $scope.validatedData.currentBatch};
              //timeout to allow molecules to be saved
              $timeout(function() {
                  $scope.gridconfig.initializeGridParams(projectKey, filters).then(function(result) {
                  $scope.gridconfig.configObject.totalServerItems = result.meta.totalCount;
                  $scope.gridconfig.configObject.compounds = result.objects;
                }, 200);
              });
              
              //watches the paging buttons to pull in new results for the window
              $scope.$watch('gridconfig.configObject.pagingOptions', function (newVal, oldVal) {
                if (newVal !== oldVal && (newVal.currentPage !== oldVal.currentPage || newVal.pageSize !== oldVal.pageSize)) {
                  console.log('paging change');
                  $scope.gridconfig.initializeGridParams(projectKey, filters).then(function(result) {
                    $scope.gridconfig.configObject.totalServerItems = result.meta.totalCount;
                    $scope.gridconfig.configObject.compounds = result.objects;
                  });
                }
              }, true);

              $scope.modalInstance = {};
              $scope.mol = {}; 

              $scope.openSingleMol = function(uox_id) {
                angular.forEach($scope.gridconfig.configObject.compounds, function(item) {
                  
                  if (item.chemblId == uox_id) {
                    $scope.mol = item;

                  }
                });
                console.log($scope.mol);
                $scope.modalInstance = $modal.open({
                  templateUrl: 'views/single-compound.html',
                  size: 'lg',
                  resolve: {
                    mol: function () {
                      return $scope.mol;
                    }
                  }, 
                  controller: function($scope, $modalInstance, mol) {
                    $scope.mol = mol;
                    $scope.modalInstance = $modalInstance;
                  }
                });
              };

              if ($scope.wizard.totalSteps == 4) {
                $scope.wizard.step = 4;
                //call whatever method will move past validating the batch  
              }
              else {
                $scope.wizard.step = 2;
                //call submit single mol
                //$scope.saveSingleMol();
              }
              
              $scope.wizard.dynamic = 90.5;
              applyTicks("finish");

            }
        })
        
        .state("Default", {
          /*url: '/',
          abstract: true,*/
        })
        
        //creating a stateful modal box to show single compound details as directed at:
        // http://www.sitepoint.com/creating-stateful-modals-angularjs-angular-ui-router/
        /*.state('Modal', {
          parent: 'Default',
          onEnter: ["$state", '$modal', function($state, $modal) {
            //console.log($state);
            var modalInstance = $modal.open({
              template: '<div ui-view="modal"></div>',
              backdrop: true,
              windowClass: 'right fade'
            });
            $(document).on("keyup", function(e) {
              if(e.keyCode == 27) {
                $(document).off("keyup");
                $state.go("Default");
              }
            });
       
          }],
          onExit: function() {
            if (modalInstance) {
                modalInstance.close();
            }
          },
          abstract: true
        })

        .state('singleCompound', {
          parent: 'Modal',
          views: {
            "modal@": {
              templateUrl: "views/single-compound.html"
            }
          },*/
          /*resolve:{
              
              modalProvider: ['ModalProvider', function(ModalProvider){
                return ModalProvider;
              }]
            },
            controller: function($scope, $state, modalProvider) {
              this.parent = modalProvider.getModal('projects.list.project');
            }*/
        //});
        

  }).run(function($http, $cookies, $rootScope, $document, $state, LoginService, ProjectFactory) {
    $http.defaults.headers.post['X-CSRFToken'] = $cookies.csrftoken;

    $rootScope.logged_in_user = {};
    $rootScope.projects = {};

    LoginService.setLoggedIn().then(
                function(data){
                    $rootScope.logged_in_user = data.objects[0];
                }
            );
    ProjectFactory.get().$promise.then(function(res) {
          $rootScope.projects = res.objects;
        });

    $rootScope.$on('$stateChangeStart', function(e, to) {
      console.log(to.name);
      if (to.name == '404') return;
      if(to.name.lastIndexOf('singleCompound', 0) === 0) return;
      if (!angular.isFunction(to.data.login_rule)) return;
      var result = to.data.login_rule($rootScope);

      if (result && result.to) {
        console.log("result and result.to is passing");
        e.preventDefault();
        // Optionally set option.notify to false if you don't want 
        // to retrigger another $stateChangeStart event
        $state.go(result.to, result.params, {notify: false});
      }
      else {
        $state.go('404');
      }
    });

    $rootScope.$on('$stateChangeSuccess', function(e, to) {
      //$('html,body').animate({ scrollTop: target.offset().top}, 1000);
      //$animate.
      $document.scrollTop(0,0);
    });

    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error){ 
        console.log(error);
    });

    $rootScope.isLoggedIn = function() {
        var loggedIn = false;
        if($rootScope.logged_in_user.id > 0) {
          loggedIn = true;
        }
        return loggedIn;
    }




    
}).config(['ngClipProvider', function(ngClipProvider) {
    ngClipProvider.setPath("../bower_components/zeroclipboard/dist/ZeroClipboard.swf");
}]);

  ;



