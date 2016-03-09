'use strict';

/**
 * @ngdoc overview
 * @name chembiohubAssayApp
 * @description
 * # chembiohubAssayApp
 *
 * Main module of the application.
 */



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

        controller: "CbhCtrl",
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
      url: '/search?creator_uri=textsearch=created_by=editMode=&archived=&scroll=&scrollTop=&sorts=&page=&compoundBatchesPerPage=&project__project_key__in&functional_group&flexmatch&related_molregno__chembl__chembl_id__in&with_substructure&similar_to&fpValue&created__gte&created__lte&molfile&smiles&search_custom_fields__kv_any&multiple_batch_id=&viewType=&doScroll=&showBlanks=&showNonBlanks=&limit&offset&justAdded=',
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

    .state('cbh.searchv2', {
      url: '/searchv2?editMode=&page=&compoundBatchesPerPage=&viewType=&limit&offset&justAdded=&encoded_query=&encoded_sorts=&encoded_hides=',

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
        'form@cbh.searchv2': {
          controller: 'Searchv2Ctrl',
          templateUrl: 'views/templates/search-templatev2.html'
        },

        'newresults@cbh.searchv2': {
          templateUrl: 'views/compound-list-newv2.html',
          controller: 'Compoundbatchv2Ctrl'
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
    
    .state('cbh.home', {
      url: '/home',
      templateUrl: 'views/user-profile.html',
      controller: function($scope, $rootScope, loggedInUser, urlConfig){
        $scope.links = [];
        $scope.userFromList = loggedInUser
        $scope.loadSavedSearches = function(){
            
            var params = {'creator_uri': loggedInUser.resource_uri};

            console.log(params);
            $http.get( urlConfig.cbh_saved_search.list_endpoint  + "/get_list_elasticsearch/", {'params': params}).then(function(data){
                
                $scope.links = data.data.objects;
                console.log($scope.links);
                $scope.$apply();
                
            });
        };
        $scope.loadSavedSearches();
      } 
    })

    .state('cbh.projects.list', {
      url: '/list',
      templateUrl: 'views/projects-list.html',
      controller: "ProjectlistCtrl"
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
        url: 'addsingle/?mb_id=&warningsFilter=&idToClone=',
        templateUrl: 'views/add-single-compound.html',
        controller: 'AddSingleCompoundCtrl',
        resolve: {
            mol: ['CBHCompoundBatch', '$stateParams', '$timeout', function(CBHCompoundBatch, $stateParams, $timeout) {
              if($stateParams.idToClone){
                return CBHCompoundBatch.get( $stateParams.idToClone ).then(function(data){
                    return data
                  
                });
                }
                else{
                    return {
                        molecule: "",
                        customFields: {},
                        supplementaryFields: [],
                    }
                }
            }],
        }


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

    /* PLATE MAP IMPLEMENTATION */
    .state('cbh.addPlate', {
      url: '/add_plate',
      resolve: {
        projectFactory: ['ProjectFactory', function(ProjectFactory) {
          return ProjectFactory;
        }],

      },
      templateUrl: 'views/add_plate.html',
      controller: 'PlatemapCtrl',

    })

    .state('cbh.listPlates', {
      url: '/plates?plate=',
      resolve: {
        projectFactory: ['ProjectFactory', function(ProjectFactory) {
          return ProjectFactory;
        }],

      },
      templateUrl: 'views/list_plates.html',
      controller: 'PlatemapCtrl',
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