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
    //$urlRouterProvider.otherwise('/demo/intro');


      $stateProvider
          
        // HOME STATES AND NESTED VIEWS ========================================
        .state('demo', {
            url: '/:projectKey/demo',
            templateUrl: 'views/start.html',
            controller: 'DemoCtrl'
        })

        .state('projects', {
          url: '/projects',
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
                $scope.cust_fields_count = 0
                $scope.custom_fields = [];
                $scope.addCustomField = function() {
                  var newItemNo = $scope.cust_fields_count + 1;
                  $scope.molecule.metadata.custom_fields.push( { 'name':'', 'value':'', 'id':newItemNo } );
                  $scope.cust_fields_count++;
                };

                $scope.removeCustomField = function(number) {

                  var filteredFields = $scope.molecule.metadata.custom_fields.filter(function(element) {
                    return element.id != number;
                  });

                  $scope.molecule.metadata.custom_fields = filteredFields;
                  

                };
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
                $scope.cust_fields_count = 0
                $scope.custom_fields = [];
                $scope.addCustomField = function() {
                  var newItemNo = $scope.cust_fields_count + 1;
                  $scope.molecule.metadata.custom_fields.push( { 'name':'', 'value':'', 'id':newItemNo } );
                  $scope.cust_fields_count++;
                };

                $scope.removeCustomField = function(number) {

                  var filteredFields = $scope.molecule.metadata.custom_fields.filter(function(element) {
                    return element.id != number;
                  });

                  $scope.molecule.metadata.custom_fields = filteredFields;
                  

                };
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
        

  }).run(function($http, $cookies) {
    $http.defaults.headers.post['X-CSRFToken'] = $cookies.csrftoken;
    

    
}).config(['ngClipProvider', function(ngClipProvider) {
    ngClipProvider.setPath("../bower_components/zeroclipboard/dist/ZeroClipboard.swf");
  }]);

  ;
