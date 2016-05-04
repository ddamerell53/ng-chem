'use strict';

var ngFooter = function ($scope, grid) {
    $scope.pagingOptions = grid.pagingOptions;
    $scope.maxRows = function () {
        var ret = Math.max($scope.totalServerItems);
        return ret;
    };
    
     $scope.$on('$destroy', $scope.$watch('totalServerItems',function(n,o){
        $scope.currentMaxPages = $scope.maxPages();
    }));


    $scope.maxPages = function () {
        if($scope.maxRows() === 0) {
            return 1;
        }
        return Math.ceil($scope.maxRows() / $scope.pagingOptions.pageSize);
    };

    $scope.pageForward = function() {
        var page = $scope.pagingOptions.currentPage;
        if ($scope.totalServerItems > 0) {
            $scope.pagingOptions.currentPage = Math.min(page + 1, $scope.maxPages());
        } else {
            $scope.pagingOptions.currentPage++;
        }
    };

    $scope.pageBackward = function() {
        var page = $scope.pagingOptions.currentPage;
        $scope.pagingOptions.currentPage = Math.max(page - 1, 1);
    };

    $scope.pageToFirst = function() {
        $scope.pagingOptions.currentPage = 1;
    };

    $scope.pageToLast = function() {
        var maxPages = $scope.maxPages();
        $scope.pagingOptions.currentPage = maxPages;
    };

    $scope.cantPageForward = function() {
        var curPage = $scope.pagingOptions.currentPage;
        var maxPages = $scope.maxPages();
        if ($scope.totalServerItems > 0) {
            return curPage >= maxPages;
        } else {
            return grid.data.length < 1;
        }

    };
    $scope.cantPageToLast = function() {
        if ($scope.totalServerItems > 0) {
            return $scope.cantPageForward();
        } else {
            return true;
        }
    };
    
    $scope.cantPageBackward = function() {
        var curPage = $scope.pagingOptions.currentPage;
        return curPage <= 1;
    };
};

/**
 * @ngdoc controller
 * @name chembiohubAssayApp.controller:BatchesCtrl
 * @description
 * # BatchesCtrl
 * Controller of the chembiohubAssayApp
 */
angular.module('chembiohubAssayApp')

  .controller('BatchesCtrl',['$scope', '$modal', '$timeout', '$q', '$state', '$stateParams','$location', 'gridconfig', 'projectKey', 'MessageFactory', 'CBHCompoundBatch', 'paramsAndForm', function ($scope, $modal, $timeout, $q, $state, $stateParams, $location, gridconfig, projectKey, MessageFactory, CBHCompoundBatch, paramsAndForm) {

    var filters = { };
    $scope.chemadder = false;
    var compadder = function(){
        $scope.chemadder = true;
    }
    $timeout(compadder, 1000);
    var multiple_batch_id = $stateParams.multiple_batch_id;
    //..
    $scope.state = $state.current;
    $scope.params = $stateParams; 
    $scope.legends = MessageFactory.getLegends();

    if($scope.state.name!=="cbh.search"){
        if(multiple_batch_id) {
          filters = { 'multiple_batch_id' : multiple_batch_id,
                      'project__project_key' : projectKey}
        }

        else if($scope.validatedData) {
          filters = { 'multiple_batch_id' : $scope.validatedData.currentBatch,
                            'project__project_key' : projectKey}
        }
        else{
    filters = {
                 'project__project_key' : projectKey}
        }
      }else{
        filters = paramsAndForm.params;
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

      

    // projectFactory.get().$promise.then(function(res) {
                $scope.projects = $scope.cbh.projects.objects;
                angular.forEach($scope.projects, function(proj) {
                  if(proj.project_key == projectKey) {
                    $scope.proj = proj;
                  }
                });
              // });


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
    if($scope.state.name==="cbh.search"){
        $scope.gridconfig.configObject.paramsUrl = paramsAndForm.paramsUrl;

    }else{
        $scope.gridconfig.configObject.paramsUrl = projkey_frag + batch_frag;

    }
    $scope.gridconfig.footerController = new ngFooter($scope, $scope.gridconfig.configObject);

    //$scope.gridconfig.configObject.pagingOptions
    // if($scope.state.name!=="cbh.search"){
     $timeout(function() {
        $scope.gridconfig.initializeGridParams( ).then(function(result) {
        $scope.gridconfig.configObject.totalServerItems = result.meta.totalCount;
        $scope.gridconfig.configObject.compounds = result.objects;
       }, 10);
       }
     );
    //watches the paging buttons to pull in new results for the window
    $scope.$watch('gridconfig.configObject.pagingOptions', function (newVal, oldVal) {
      if (newVal !== oldVal && (newVal.currentPage !== oldVal.currentPage || newVal.pageSize !== oldVal.pageSize)) {
        $scope.gridconfig.initializeGridParams().then(function(result) {
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

          projectsWithCustomFieldData: ['ProjectFactory', function(ProjectFactory){
                var p;
                angular.forEach($scope.cbh.projects.objects, function(proj){
                    if (proj.id==$scope.mol.project_id){
                      p = proj;
                    }
                });  
                return p
          }],



        }, 
        controller: function($scope, $modalInstance, mol, projectsWithCustomFieldData, $timeout) {
          $scope.mol = mol;
          $scope.myform = projectsWithCustomFieldData.objects[0].schemaform.form;
          var myform = projectsWithCustomFieldData.objects[0].schemaform.form;
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
          $scope.myschema = projectsWithCustomFieldData.objects[0].schemaform.schema;
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
