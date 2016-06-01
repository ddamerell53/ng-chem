'use strict';


window.searchParamsString = "?pids=&page=&compoundBatchesPerPage=&viewType=&limit&offset&encoded_query=&encoded_sorts=&encoded_hides=&textsearch=&chemical_search_id=";

window.searchResolve = {
        
        projectFactory: ['ProjectFactory', function(ProjectFactory) {
          return ProjectFactory;
        }],
        messages: ['MessageFactory', function(MessageFactory) {
          return MessageFactory.getMessages();
        }],
      }
      

angular.module('chembiohubAssayApp')

//Giving single molecule view a state to not break the back button and help with new API
//http://plnkr.co/edit/CoIhRixz15WZNF4pFHCx?p=preview
.provider('modalState', function($stateProvider) {
    var provider = this;
    this.$get = function() {
        return provider;
    }
    this.state = function(stateName, options) {
        var modalInstance;
        $stateProvider.state(stateName, {
            url: options.url,
            onEnter: function($modal, $state) {
                modalInstance = $modal.open(options);
                modalInstance.result['finally'](function() {
                    modalInstance = null;
                    if ($state.$current.name === stateName) {
                        $state.go('^');
                    }
                });
            },
            onExit: function() {
                if (modalInstance) {
                    modalInstance.close();
                }
            }
        });
        return this;
    };

})

.config(function($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider, modalStateProvider) {
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
      url: '/searchv2' + window.searchParamsString + "&editMode=",
      resolve: angular.copy(window.searchResolve),
      params: {
        archived: undefined  //The archived param is used in the getResultsPage function to add an additional filter 
      },

      views: {
        '': {
          templateUrl: 'views/search.html',
          controller: function($scope, $state){
            $scope.$state = $state;
          }
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
  .state('cbh.archiveitems', {
      url: '/archiveitems' + window.searchParamsString,
      resolve: angular.copy(window.searchResolve),
      params: {
        archived: false  //The archived param is used in the getResultsPage function to add an additional filter 
      },
      views: {
        '': {
          templateUrl: 'views/search.html',
          controller: function($scope, $state){
            $scope.$state = $state;
          }
        },
        'form@cbh.archiveitems': {
          controller: 'Searchv2Ctrl',
          templateUrl: 'views/templates/search-templatev2.html'
        },

        'newresults@cbh.archiveitems': {
          templateUrl: 'views/compound-list-newv2.html',
          controller: 'Compoundbatchv2Ctrl'
        },

      }


    })
.state('cbh.restoreitems', {
      url: '/restoreitems' + window.searchParamsString,
      resolve: angular.copy(window.searchResolve),
      params: {
        archived: true  //The archived param is used in the getResultsPage function to add an additional filter 
      },
      views: {
        '': {
          templateUrl: 'views/search.html',
          controller: function($scope, $state){
            $scope.$state = $state;
          }
        },
        'form@cbh.restoreitems': {
          controller: 'Searchv2Ctrl',
          templateUrl: 'views/templates/search-templatev2.html'
        },

        'newresults@cbh.restoreitems': {
          templateUrl: 'views/compound-list-newv2.html',
          controller: 'Compoundbatchv2Ctrl'
        },

      }


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
      controller: function($scope, $rootScope, loggedInUser, urlConfig, $filter){
        $scope.links = [];
        $scope.userFromList = loggedInUser
        $scope.loadSavedSearches = function(){
            
            var encoded_username= $filter("encodeParamForSearch")({"field_path": "created_by", "value": loggedInUser.display_name});

                var params = {'encoded_query': encoded_username};

                $http.get( urlConfig.cbh_saved_search.list_endpoint  + "/", {'params': params}).then(function(data){

                $scope.links = data.data.objects;
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
        params: {
          idToClone : undefined
        },
        resolve: {
            mol: ['CBHCompoundBatch', '$stateParams', '$timeout', function(CBHCompoundBatch, $stateParams, $timeout) {
              if($stateParams.idToClone){
                return CBHCompoundBatch.get( $stateParams.idToClone ).then(function(data){
                    data.customFields = data.custom_fields;
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
    

    /* PLATE MAP IMPLEMENTATION */
    .state('cbh.projects.project.addplate', {
      url: 'add_plate/',
      templateUrl: 'views/add_plate.html',
      controller: 'PlatemapCtrl',

    })

    .state('cbh.projects.project.listplates', {
      url: 'plates/?plate=&page=&compoundBatchesPerPage=&textsearch=',
      templateUrl: 'views/list_plates.html',
      controller: 'PlatemapCtrl',
    });
    
    modalStateProvider.state('cbh.searchv2.record', {
        url: '/:uniqId?edit=',
        templateUrl: 'views/templates/single-compound-full.html',
        size: 'lg',
        controller: 'SinglemolCtrl'
    })
    .state('cbh.archiveitems.record', {
        url: '/:uniqId?edit=',
        templateUrl: 'views/templates/single-compound-full.html',
        size: 'lg',
        controller: 'SinglemolCtrl'
    })
    .state('cbh.restoreitems.record', {
        url: '/:uniqId?edit=',
        templateUrl: 'views/templates/single-compound-full.html',
        size: 'lg',
        controller: 'SinglemolCtrl'
    });
    //we can use modalStateProvider for other modals that need their own directly navigable route




  }).run(function($http, $cookies, $rootScope, $document, $state, $urlMatcherFactory, projectList, urlConfig, prefix, csrftoken) {

    $http.defaults.headers.post['X-CSRFToken'] = csrftoken;
    $http.defaults.headers.patch['X-CSRFToken'] = csrftoken;
    $http.defaults.headers.put['X-CSRFToken'] = csrftoken;


    
      var projKeys = projectList.objects.map(function(item) {
        return item.project_key;
      });
      $rootScope.urlMatcher = $urlMatcherFactory.compile("/{projectKey:" + projKeys.join('|') + "}/?limit&offset");
    


    $rootScope.$on('$stateChangeSuccess', function(e, to) {

      $document.scrollTop(0, 0);
    });

    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
      //TODO handle
    });



  })

  .factory('authHttpResponseInterceptor', ['$q', '$location', 'urlConfig', function($q, $location, urlConfig) {
    return {
      response: function(response) {
        if (response.status === 401) {
          //TODO handle
        }
        return response || $q.when(response);
      },
      responseError: function(rejection) {
        // if (rejection.status === 401) {
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
  }])
  .config(['$compileProvider', function($compileProvider){
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|blob):|data:image\//);
  }]);