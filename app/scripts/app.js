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
    $urlRouterProvider.otherwise('/404');

    /*$urlRouterProvider.rule(function ($injector, $location) {
       //what this function returns will be set as the $location.url
        var path = $location.path(), normalized = path.toLowerCase();
        if (path != normalized) {
            //instead of returning a new url string, I'll just change the $location.path directly so I don't have to worry about constructing a new url string and so a new state change is not triggered
            $location.replace().path(normalized);
        }
        // because we've returned nothing, no state change occurs
    });*/

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

        .state('demo', {
            data: {
              login_rule: function($rootScope) {
                //check login status here
                //console.log($rootScope);
                //is $rootScope.logged_in_user?
                console.log($rootScope.isLoggedIn());
                return $rootScope.isLoggedIn();

              }
            },
            url: '/:projectKey/demo',
            templateUrl: 'views/start.html',
            controller: 'DemoCtrl'
        })

        .state('projects', {
            url: '/projects',
            data: {
              login_rule: function($rootScope) {
                //console.log('project rule');
                console.log($rootScope.isLoggedIn());
                return $rootScope.isLoggedIn();
              }
            },
            templateUrl: 'views/projects.html',
            controller: 'ProjectCtrl'
        })

        .state('projects.add', {
            url: '/add',
            templateUrl: 'views/projects-add.html',
            controller: function($scope){
              //add stuff here as necessary
            }
        })
        
        // nested states 
        // each of these sections will have their own view
        // url will be nested (/form/profile)
        .state('demo.intro', {
            url: '/intro',
            templateUrl: 'views/demo-intro.html',
            controller: function($scope) {
              $scope.wizard.step = 0;
              $scope.wizard.dynamic = 0;
              $scope.wizard.totalSteps = 0;
              applyTicks("intro");
            }
        })

        .state('demo.add', {
            url: '/add',
            templateUrl: 'views/demo-add.html',
            controller: function($scope) {
              $scope.wizard.step = 1;
              $scope.wizard.dynamic = 41;
              applyTicks("add");
            }
        })

        .state('demo.add.single', {
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

        .state('demo.add.multiple', {
            url: '/multiple',
            templateUrl: 'views/demo-add-multiple.html',
            controller: function($scope) {
              $scope.wizard.step = 1;
              $scope.wizard.dynamic = 41;
              $scope.wizard.totalSteps = 4;
              $scope.urlBase = "/chemblws/cbh_compound_batches/";
              var arr = window.location.href.split("/");
              $scope.myUrl = arr[0] + "//" + arr[2] + $scope.urlBase;
            }
        })

        .state('demo.map', {
            url: '/map',
            templateUrl: 'views/demo-map.html',
            controller: function($scope) {
              $scope.wizard.step = 2;
              $scope.wizard.dynamic = 58;

              applyTicks("map");
            }
        })

        .state('demo.map.file', {
            url: '/map-file',
            templateUrl: 'views/demo-map-file.html',
            controller: function($scope) {
              
            }
        })
        .state('demo.map.multiple', {
            url: '/map-multiple',
            templateUrl: 'views/demo-map-multiple.html',
            controller: function($scope) {

            }
        })
        // url will be /form/interests
        .state('demo.validate', {
            url: '/validate',
            templateUrl: 'views/demo-validate.html',
            controller: function($scope) {
              $scope.wizard.step = 3;
              $scope.wizard.dynamic = 74;
              applyTicks("validate");
            }
        })


        
        // url will be /form/payment
        .state('demo.finish', {
            url: '/finish',
            templateUrl: 'views/demo-finish.html',
            controller: function($scope) {
              if ($scope.wizard.totalSteps == 4) {
                $scope.wizard.step = 4;
                //call whatever method will move past validating the batch  
              }
              else {
                $scope.wizard.step = 2;
                //call submit single mol
                $scope.saveSingleMol();
              }
              
              $scope.wizard.dynamic = 90.5;
              applyTicks("finish");
              // function getSmiles(mol){
              //   return mol.canonicalSmiles;
              // }
            }
        });
        

  }).run(function($http, $cookies, $rootScope, $state, LoginService) {
    $http.defaults.headers.post['X-CSRFToken'] = $cookies.csrftoken;

    $rootScope.logged_in_user = {};

    LoginService.setLoggedIn().then(
                function(data){
                    $rootScope.logged_in_user = data.objects[0];
                }
            );

    $rootScope.$on('$stateChangeStart', function(e, to) {
      console.log(to);
      if (to.name == '404') return;
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
