'use strict';

/**
 * @ngdoc function
 * @name ngChemApp.controller:BatchesCtrl
 * @description
 * # BatchesCtrl
 * Controller of the ngChemApp
 */
angular.module('ngChemApp')
  .controller('BatchesCtrl',['$scope', '$modal', '$timeout', '$q', '$state', '$stateParams','$location', 'gridconfig', 'projectKey', 'projectFactory', 'MessageFactory', 'ProjectCustomFields', 'CBHCompoundBatch', function ($scope, $modal, $timeout, $q, $state, $stateParams, $location, gridconfig, projectKey, projectFactory, MessageFactory, ProjectCustomFields, CBHCompoundBatch) {
    var filters = { };
    
    var multiple_batch_id = $stateParams.multiple_batch_id;
    //..
    $scope.state = $state.current
    $scope.params = $stateParams; 
    $scope.legends = MessageFactory.getLegends();

    if(multiple_batch_id) {
      filters = { 'multiple_batch_id' : multiple_batch_id }
    }

    else if($scope.validatedData) {
      filters = { 'multiple_batch_id' : $scope.validatedData.currentBatch }
    }
$scope.tagFunction = function(content){
    var item = {
      value: content,
      label: content,
      description : '',
      group: ''
    }
    return item;
  };
    //$scope.proj = $rootScope.getProjectObj(projectKey);

ProjectCustomFields.query(projectKey, {}, $scope.tagFunction).then(function(data){
                 $scope.myschema = data.schemaform.schema;
                 $scope.myform = data.schemaform.form;
        });


    projectFactory.get().$promise.then(function(res) {
                $scope.projects = res.objects;
                angular.forEach(res.objects, function(proj) {
                  if(proj.project_key == projectKey) {
                    $scope.proj = proj;
                  }
                });
              });


    $scope.dummyproj = "$scope.state.data.dummyproj";
    //initialise from URL parameters - page size and filters

    $scope.projectKey = projectKey;
    $scope.gridconfig = gridconfig;

    
      if($state.params.offset && $state.params.limit) {
          $scope.gridconfig.configObject.pagingOptions.pageSize = ($state.params.limit || 20);
          $scope.gridconfig.configObject.pagingOptions.currentPage = parseInt($state.params.offset) / parseInt($state.params.limit);
        }
        else {
          $scope.gridconfig.configObject.pagingOptions.pageSize = 20;
          $scope.gridconfig.configObject.pagingOptions.currentPage = 1;
        }
        //empty the compounds?
        $scope.gridconfig.configObject.compounds = [];
        $scope.gridconfig.configObject.filters = filters;
        var projkey_frag = ($scope.projectKey) ? "project__project_key=" + $scope.projectKey + "&" : "" ;
        var batch_frag = ($scope.validatedData) ? "multiple_batch_id=" + filters.multiple_batch_id + "&" : "" ;
        $scope.gridconfig.configObject.paramsUrl = projkey_frag + batch_frag;
    

    
    
    
    
    
    //$scope.gridconfig.configObject.pagingOptions

    $timeout(function() {
        $scope.gridconfig.initializeGridParams(projectKey, filters).then(function(result) {
        $scope.gridconfig.configObject.totalServerItems = result.meta.totalCount;
        $scope.gridconfig.configObject.compounds = result.objects;
      }, 200);
    });
    //watches the paging buttons to pull in new results for the window
    $scope.$watch('gridconfig.configObject.pagingOptions', function (newVal, oldVal) {
      if (newVal !== oldVal && (newVal.currentPage !== oldVal.currentPage || newVal.pageSize !== oldVal.pageSize)) {
        $scope.gridconfig.initializeGridParams(projectKey,filters).then(function(result) {
          $scope.gridconfig.configObject.totalServerItems = result.meta.totalCount;
          $scope.gridconfig.configObject.compounds = result.objects;
          //this.configObject.filters = coreFilters;
          $location.search('limit', newVal.pageSize).search('offset', parseInt(newVal.currentPage * newVal.pageSize)).replace();
          //$scope.$apply();
        });
      }
    }, true);
    $scope.modalInstance = {};
    $scope.mol = {}; 

    $scope.openSingleMol = function(uox_id, cbh_compound_batch_id) {
      angular.forEach($scope.gridconfig.configObject.compounds, function(item) {
        
        if (item.chemblId == uox_id) {
          //$scope.mol = item;
          if(item.id == cbh_compound_batch_id) {
            $scope.mol = item;
          }

        }
      });
      $scope.modalInstance = $modal.open({
        templateUrl: 'views/single-compound.html',
        size: 'lg',
        resolve: {
          mol: function () {
            return $scope.mol;
          },
          myform: function(){
            return $scope.myform;
          }          ,
          myschema: function(){
            return $scope.myschema;
          }
        }, 
        controller: function($scope, $modalInstance, mol, myform, myschema, $timeout) {
          $scope.mol = mol;
          $scope.myform = myform;
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
                    console.debug($scope.firstList);


          };
          $scope.init();
         

          $scope.removeAlert = function(){
            $scope.update_success = false;
          }
          $scope.updateBatch = function(){
            CBHCompoundBatch.patch({"customFields" : $scope.mol.customFields, "projectKey": projectKey, "id": $scope.mol.id}).then(
                function(data){
                  $scope.mol=data;
                  mol=data;
                  $scope.update_success = true;
                  $scope.init();
                  $timeout($scope.removeAlert, 5000);
                }
              );
          }
          $scope.myschema = myschema;
          $scope.modalInstance = $modalInstance;
// $scope.$watch('mol', function(n,o), true){
//   $scope.pointers = n;
// });
        }
      });
    };

    $scope.openHeadersLegend = function(){
      $scope.modalInstance = $modal.open({
        templateUrl: 'views/legend.html',
        size: 'md',
        controller: function($scope, $modalInstance, MessageFactory) {
          $scope.modalInstance = $modalInstance;
          $scope.legends = MessageFactory.getLegends();
        }
      });
    }

    $scope.exportSearch = function(format) {
      $scope.gridconfig.exportFullResults(format);
    }

  }]);
