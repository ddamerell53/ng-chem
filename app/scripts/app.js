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
    'flow'
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

                $scope.cust_fields_count = 0
                $scope.custom_fields = [];

                $scope.errors = [];

                $scope.stereochem_options = [{ name:'1', value:'as drawn'},
                                            { name:'2', value:'achiral',}, 
                                            { name:'3', value:'racemic',}, 
                                            { name:'4', value:'single enantiomer of known absolute configuration'},
                                            { name:'5', value:'single enantiomer of unknown absolute configuration'},
                                            { name:'6', value:'single diastereoisomer of known absolute configuration'},
                                            { name:'7', value:'single diastereoisomer of unknown absolute configuration'},
                                            { name:'8', value:'meso'},
                                            { name:'9', value:'E'},
                                            { name:'10', value:'Z'},
                                            { name:'11', value:'mixture E/Z'},
                                            { name:'12', value:'cis'},
                                            { name:'13', value:'trans'},
                                            { name:'14', value:'mixture of diastereoisomers'}
                                            ];
                //default selection set in the scope molecule object, select box value bound to form.                                           
                

                $scope.sketchMolfile = "";

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
            }
        })

        .state('demo.map', {
            url: '/map',
            templateUrl: 'views/demo-map.html',
            controller: function($scope) {
              $scope.wizard.step = 2;
              $scope.wizard.dynamic = 58;

              //set up test lists of droppables here
              $scope.dragmodels = {
                  selected: null,
                  lists: {"A": []}
              };
              $scope.dropmodels = {
                  selected: null,
                  lists: {"Source ID": [], "Project ID": [], "Supplier": [], "Purity": [], "Comments": [], "Other": [],}
              }

              // Generate initial model
              for (var i = 1; i <= 3; ++i) {
                  $scope.dragmodels.lists.A.push({label: "Item A" + i});
              }

              applyTicks("map");
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

        //substates of validate - we can tab out our output from the server
        .state('demo.validate.pains', {
          url:'/pains',
          templateUrl: 'views/demo-validate-pains.html',
          controller: function($scope) {
            //stuff

          }
        })

        .state('demo.validate.standardise', {
          url:'/standardise',
          templateUrl: 'views/demo-validate-standardise.html',
          controller: function($scope) {
            //stuff

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
            }
        });
        

  }).run(function($http, $cookies) {
    $http.defaults.headers.post['X-CSRFToken'] = $cookies.csrftoken;

    
});
