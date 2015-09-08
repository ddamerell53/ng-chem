'use strict';

/**
 * @ngdoc function
 * @name ngChemApp.controller:DataoverviewCtrl
 * @description
 * # DataoverviewCtrl
 * Controller of the ngChemApp
 */
angular.module('chembiohubAssayApp')
  .controller('DataOverviewCtrl', ['$scope', 'AddDataFactory', '$modal', '$resource', '$stateParams', '$state' , '$timeout', 
    function ($scope, AddDataFactory, $modal, $resource, $stateParams, $state, $timeout) {
	var dataoverviewctrl = this;
  var classes = {
    'l1': "l1",
    'l2' : "l2"
  }
  $scope.iamloading = false;
	$scope.modalInstance = {};
    $scope.popup_data = {};
    $scope.getAnnotations = function(dpc){

          dpc.dfc_full = $scope.assayctrl.dfc_lookup[dpc.data_form_config];
          dpc.main_cfc = dpc.dfc_full[dpc.level_from];
          dpc.main_data = dpc[dpc.level_from];
          dpc.htmlClassName = classes[dpc.level_from];
        
          dpc.next_level_cfc = dpc.dfc_full[dpc.next_level];
          dpc.addingChild = false;
          dpc.default_data = {'project_data': {} ,'custom_field_config' : dpc.next_level_cfc.resource_uri};

          dpc.setForm = function(defaults){
            $timeout(function(){
              dpc.new_next_level_model = angular.copy(defaults);
              dpc.new_next_level_model.id = null;
              dpc.resource_uri = null;
              dpc.next_level_edit_form = [];
              dpc.next_level_edit_schema = { "type": "object", 'properties' : {}, 'required': [] };
              angular.forEach(dpc.next_level_cfc.project_data_fields, function(proj_data){
                  //pull out the edit_form.form and edit_schema.schema
                  var form = angular.copy(proj_data.edit_form.form[0]);
                  form.htmlClass = "col-xs-3";
                  dpc.next_level_edit_form.push(form);
                  angular.extend(dpc.next_level_edit_schema.properties, angular.copy(proj_data.edit_schema.properties));
                });
            });
            
            
          }

          dpc.cancel = function(){
            dpc.setForm(dpc.default_data);
            dpc.addingChild = false;
          }
          dpc.addDataToForm = function(data){
            dpc.addingChild = true;
            dpc.setForm(data);
            
          }
          dpc.setForm(dpc.default_data);

          dpc.addChild = function(){
              var AddDF = AddDataFactory.dataClassification;
           
              var adfresult = AddDF.get({'dc': dpc.id});
                  adfresult.$promise.then(function(clone){

                        clone.children = [];
                        clone.id = null;
                        clone.resource_uri = null;
                        clone[dpc.next_level] = dpc.new_next_level_model;
                        clone.$save(function(data){
                            $state.go($state.current, $stateParams, {reload: true});
                        });
                  });
          };

          dpc.updateChild = function(child_dpc_id){
              var AddDF = AddDataFactory.dataClassification;
              var adfresult = AddDF.get({'dc': child_dpc_id});
                  adfresult.$promise.then(function(clone){
                        clone[dpc.next_level] = dpc.new_next_level_model;
                        clone.$update({'dc': child_dpc_id} ,function(data){
                            $state.go($state.current, $stateParams, {reload: true});
                        });
                  });
          }

          

          if(  dpc.next_level == dpc.dfc_full.last_level){
            dpc.childrenTemplate = "views/templates/overview-children-table.html";
          }else{
            dpc.childrenTemplate = "views/templates/overview-children.html";
          }
        
        
    };
    $scope.iterate_children = function(obj){
        angular.forEach(obj.children, function(child, index){
          if( angular.isDefined(child.id)){
            child.parentObj = obj;
            
            $scope.getAnnotations(child);
            $scope.iterate_children(child);
            if (index == (obj.children.length - 1)){
                $scope.iamloading = false;
              }
            }
       
          });
    }

    dataoverviewctrl.fetchData = function(){
      $scope.iamloading = true;
      console.log('iamloading', $scope.iamloading);
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

      $scope.popup_data = input_popup_data;
      $scope.modalInstance = $modal.open({
        templateUrl: 'views/modal-template.html',
        size: 'lg',
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
