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
    'ui.bootstrap'
  ])
  .config(function ($stateProvider, $urlRouterProvider) {
      
          // catch all route
    // send users to the form page 
    $urlRouterProvider.otherwise('/demo/intro');


      $stateProvider
          
        // HOME STATES AND NESTED VIEWS ========================================
        .state('demo', {
            url: '/demo',
            templateUrl: 'views/start.html',
            controller: 'DemoCtrl'
        })
        
        // nested states 
        // each of these sections will have their own view
        // url will be nested (/form/profile)
        .state('demo.intro', {
            url: '/intro',
            templateUrl: 'views/demo-intro.html',
            controller: function($rootScope) {
              $rootScope.step = 0;
              $rootScope.dynamic = 0;
              applyTicks("intro");
            }
        })

        .state('demo.add', {
            url: '/add',
            templateUrl: 'views/demo-add.html',
            controller: function($rootScope) {
              $rootScope.step = 1;
              $rootScope.dynamic = 41;
              applyTicks("add");
            }
        })

        .state('demo.add.single', {
            url: '/single',
            templateUrl: 'views/demo-add-single.html',
            controller: function($scope, $rootScope) {

                $scope.cust_fields_count = 0
                $scope.custom_fields = [];

                $scope.errors = [];

                $scope.addCustomField = function() {
                  console.log('getting here');
                  var newItemNo = $scope.cust_fields_count + 1;
                  $scope.custom_fields.push(newItemNo);
                  $scope.cust_fields_count++;
                };

                $scope.removeCustomField = function(number) {
                  var ind = $scope.custom_fields.indexOf(number);
                  $scope.custom_fields.splice(ind, 1);
                };
                $scope.open_warnings = false;

                

            }
        })

        .state('demo.add.multiple', {
            url: '/multiple',
            templateUrl: 'views/demo-add-multiple.html',
            controller: function($rootScope) {
              
            }
        })

        .state('demo.map', {
            url: '/map',
            templateUrl: 'views/demo-map.html',
            controller: function($rootScope) {
              $rootScope.step = 2;
              $rootScope.dynamic = 58;
              applyTicks("map");
            }
        })
        
        // url will be /form/interests
        .state('demo.validate', {
            url: '/validate',
            templateUrl: 'views/demo-validate.html',
            controller: function($rootScope) {
              $rootScope.step = 3;
              $rootScope.dynamic = 74;
              applyTicks("validate");
            }
        })

        //substates of validate - we can tab out our output from the server
        .state('demo.validate.pains', {
          url:'/pains',
          templateUrl: 'views/demo-validate-pains.html',
          controller: function($rootScope) {
            //stuff

          }
        })

        .state('demo.validate.standardise', {
          url:'/standardise',
          templateUrl: 'views/demo-validate-standardise.html',
          controller: function($rootScope) {
            //stuff

          }
        })


        
        // url will be /form/payment
        .state('demo.finish', {
            url: '/finish',
            templateUrl: 'views/demo-finish.html',
            controller: function($rootScope) {
              $rootScope.step = 4;
              $rootScope.dynamic = 90.5;
              applyTicks("finish");
            }
        });
        

  }).run(function($http, $cookies) {
    $http.defaults.headers.post['X-CSRFToken'] = $cookies.csrftoken;
});
