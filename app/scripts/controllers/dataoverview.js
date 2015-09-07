'use strict';

/**
 * @ngdoc function
 * @name ngChemApp.controller:DataoverviewCtrl
 * @description
 * # DataoverviewCtrl
 * Controller of the ngChemApp
 */
angular.module('chembiohubAssayApp')
  .controller('DataOverviewCtrl', ['$scope', 'AddDataFactory', '$modal', '$resource', '$stateParams' , function ($scope, AddDataFactory, $modal, $resource, $stateParams) {
	var dataoverviewctrl = this;
  var classes = {
    'l1': "l1",
    'l2' : "l2"
  }
	$scope.modalInstance = {};
    $scope.popup_data = {};
    $scope.getAnnotations = function(dpc){
        dpc.dfc_full = $scope.assayctrl.dfc_lookup[dpc.data_form_config];
        dpc.main_cfc = dpc.dfc_full[dpc.level_from];
        dpc.main_data = dpc[dpc.level_from];
        dpc.htmlClassName = classes[dpc.level_from];
        // if( dpc.dfc_full[dpc.level_from] != -1 && dpc.level_from != dpc.dfc_full.last_level){
        //   dpc.requiresAddChildren = true;
        // }else{
        //   dpc.requiresAddChildren = false;
        // }
        //here we assume bottom 2 levels will have the same form
        dpc.next_level_cfc = dpc.dfc_full[dpc.next_level];
        if(  dpc.next_level == dpc.dfc_full.last_level){
          dpc.childrenTemplate = "views/templates/overview-children-table.html";
        }else{
          dpc.childrenTemplate = "views/templates/overview-children.html";
        }
    };
    $scope.iterate_children = function(obj){
        angular.forEach(obj.children, function(child){
              $scope.getAnnotations(child);
              $scope.iterate_children(child);
          });
    }
    dataoverviewctrl.fetchData = function(){
       AddDataFactory.nestedDataClassification.get({
        "l0_permitteded_projects__project_key": $stateParams.projectKey, 
        "parent_id": "None", 
        "full": "true" 
      },
        function(data){
          dataoverviewctrl.l0_object = data.objects[0];
          $scope.iterate_children(dataoverviewctrl.l0_object);    
        }
      );
    }
    dataoverviewctrl.openDetail = function(input_popup_data) {
      console.log(input_popup_data);
      $scope.popup_data = input_popup_data;
      $scope.modalInstance = $modal.open({
        templateUrl: 'views/modal-template.html',
        size: 'md',
        resolve: {
          popup_data: function () {
            return $scope.popup_data;
          },

        }, 
        controller: function($scope, $modalInstance, popup_data, $timeout) {
          console.log("popup_data", popup_data);
          $scope.popup_data = popup_data;
          
          $scope.modalInstance = $modalInstance;

		  $scope.cancel = function () {
		    $modalInstance.dismiss('cancel');
		  };

        }
      });
    };
    dataoverviewctrl.fetchData();





  }]);
