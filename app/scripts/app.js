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
    //'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.router'
  ])
  .config(function ($stateProvider, $urlRouterProvider) {
    
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
        .state('demo.add', {
            url: '/add',
            //template: '<p>Hello</p>'
            templateUrl: 'views/demo-add.html'
        })

        .state('demo.map', {
            url: '/map',
            //template: '<p>Hello</p>'
            templateUrl: 'views/demo-map.html'
        })
        
        // url will be /form/interests
        .state('demo.validate', {
            url: '/validate',
            templateUrl: 'views/demo-validate.html'
            //template: '<p>second</p>'
        })
        
        // url will be /form/payment
        .state('demo.finish', {
            url: '/finish',
            templateUrl: 'views/demo-finish.html'
            //template: '<p>third</p>'
        });
        
    // catch all route
    // send users to the form page 
    //$urlRouterProvider.otherwise('/demo/add');

  });
