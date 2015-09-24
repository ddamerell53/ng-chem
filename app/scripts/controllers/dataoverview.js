'use strict';

/**
 * @ngdoc function
 * @name ngChemApp.controller:DataoverviewCtrl
 * @description
 * # DataoverviewCtrl
 * Controller of the ngChemApp
 */
angular.module('chembiohubAssayApp')
  .controller('DataOverviewCtrl', ['$scope', 'AddDataFactory', '$modal', '$resource', '$stateParams', '$state' , '$timeout', 'prefix', 'urlConfig', '$cookies', 'FlowFileFactory', 
    function ($scope, AddDataFactory, $modal, $resource, $stateParams, $state, $timeout, prefix, urlConfig, $cookies, FlowFileFactory) {
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
          console.log(dpc.dfc_full);
          dpc.main_cfc = dpc.dfc_full[dpc.level_from];
          dpc.main_data = dpc[dpc.level_from];
          dpc.htmlClassName = classes[dpc.level_from];


        
          dpc.setChosenDataFormConfig = function(dfc_uri, adding, templateData){
            
            dpc.addingChild = adding;
            dpc.next_level_dfc = $scope.assayctrl.dfc_lookup[dfc_uri];
            dpc.next_level_cfc = dpc.next_level_dfc[dpc.next_level_dfc.last_level];
            if (!angular.isDefined(templateData)){
              templateData =  {'project_data': {} ,'custom_field_config' : dpc.next_level_cfc.resource_uri};
            }else{
              templateData.id = null;
              templateData.resource_uri = null;
            }
            dpc.default_data =templateData;
            dpc.next_level_edit_form = dpc.next_level_dfc.get_main_form();
            dpc.next_level_edit_schema = dpc.next_level_dfc.get_main_schema();
            dpc.new_next_level_model = angular.copy(dpc.default_data );
            dpc.next_data_type_name = dpc.next_level_dfc[dpc.next_level_dfc.last_level].data_type.name;
            dpc.next_level_searchnames = dpc.next_level_cfc.project_data_fields.map(function(field){
              console.log(field.field_type);
              return dpc.next_level_dfc.last_level + ".project_data." + field.elasticsearch_fieldname;
            })
          }

          //setting up a method for setting up dfc for file upload
          //don't know what I do and don't need from this
          dpc.setChosenDataFormConfigMultiple = function(dfc_uri, adding, templateData) {
            dpc.addingMultiple = adding;
            dpc.next_level_dfc = $scope.assayctrl.dfc_lookup[dfc_uri];
            dpc.next_level_cfc = dpc.next_level_dfc[dpc.next_level_dfc.last_level];
            if (!angular.isDefined(templateData)){
              templateData =  {'project_data': {} ,'custom_field_config' : dpc.next_level_cfc.resource_uri};
            }else{
              templateData.id = null;
              templateData.resource_uri = null;
            }
            dpc.default_data =templateData;
            dpc.next_level_edit_form = dpc.next_level_dfc.get_main_form();
            dpc.next_level_edit_schema = dpc.next_level_dfc.get_main_schema();
            dpc.new_next_level_model = angular.copy(dpc.default_data );
            dpc.next_data_type_name = dpc.next_level_dfc[dpc.next_level_dfc.last_level].data_type.name;
            dpc.next_level_searchnames = dpc.next_level_cfc.project_data_fields.map(function(field){
              console.log(field.field_type);
              return dpc.next_level_dfc.last_level + ".project_data." + field.elasticsearch_fieldname;
            })
          }

          dpc.cancel = function(){
            if (dpc.dfc_full.permitted_children.length > 0){
              //Default to the first in the list for thios but reset it every time that someone 
              dpc.setChosenDataFormConfig(dpc.dfc_full.permitted_children[0]);
            }
            dpc.addingChild = false

          }

          if (dpc.dfc_full.permitted_children.length > 0){
            //Default to the first in the list for thios but reset it every time that someone 
            dpc.setChosenDataFormConfig(dpc.dfc_full.permitted_children[0], false);
            dpc.addingChild = false;
            if (dpc.dfc_full.permitted_children.length == 1){
              if (dpc.children.length ==0){
                dpc.addingChild = true;
              }
            }
          }


          
          // dpc.setForm = function(defaults){
          //   $timeout(function(){
          //     dpc.new_next_level_model = angular.copy(defaults);
          //     dpc.new_next_level_model.id = null;
          //     dpc.resource_uri = null;
          //     dpc.next_level_edit_form = [];
          //     dpc.next_level_edit_schema = { "type": "object", 'properties' : {}, 'required': [] };
          //     angular.forEach(dpc.next_level_cfc.project_data_fields, function(proj_data){
          //         //pull out the edit_form.form and edit_schema.schema
          //         var form = angular.copy(proj_data.edit_form.form[0]);
          //         form.htmlClass = "col-xs-3";
          //         dpc.next_level_edit_form.push(form);
          //         angular.extend(dpc.next_level_edit_schema.properties, angular.copy(proj_data.edit_schema.properties));
          //       });
          //   }); 
          // }

          
          dpc.addDataToForm = function(data){
            dpc.addingChild = true;
            dpc.setForm(data);
            
          }/*
          dpc.editData = function(data){
            dpc.addingChild = false;
            dpc.setForm(data);
          }*/
          // dpc.setForm(dpc.default_data);
          dpc.addChild = function(){
              dataoverviewctrl.setLoadingMessageHeight();
      dataoverviewctrl.currentlyLoading = true;
              var AddDF = AddDataFactory.dataClassification;
           
              var adfresult = AddDF.get({'dc': dpc.id});
                  adfresult.$promise.then(function(clone){

                        clone.children = [];
                        clone.id = null;
                        clone.resource_uri = null;
                        clone.parent_id = dpc.id;
                        clone[dpc.next_level] = dpc.new_next_level_model;
                        clone.data_form_config = dpc.next_level_dfc.resource_uri;
                        console.log(dpc.next_level_dfc.resource_uri);
                        clone.$save(function(data){
                            $state.go($state.current, $stateParams, {reload: true});
                        });
                  });
          };

          dpc.updateChild = function(child_dpc_id){
            dataoverviewctrl.setLoadingMessageHeight();
      dataoverviewctrl.currentlyLoading = true;
              var AddDF = AddDataFactory.dataClassification;
              var adfresult = AddDF.get({'dc': child_dpc_id});
                  adfresult.$promise.then(function(clone){
                        clone[dpc.next_level] = dpc.new_next_level_model;
                        clone.$update({'dc': child_dpc_id} ,function(data){
                            $state.go($state.current, $stateParams, {reload: true});
                        });
                  });
          }
/*
          dpc.saveEdits = function(child_dpc_id){
              var AddDF = AddDataFactory.dataClassification;
              var adfresult = AddDF.get({'dc': child_dpc_id});
              adfresult.$promise.then(function(clone){
                    //clone[dpc.next_level] = dpc.new_next_level_model;
                    clone.$update({'dc': child_dpc_id} ,function(data){
                        $state.go($state.current, $stateParams, {reload: true});
                    });
              });
          }*/

          

          if(   dpc.next_level_dfc.human_added){
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
            
       
          }});
    }
    $scope.no_l0 = false;
    dataoverviewctrl.fetchData = function(){
      $scope.iamloading = true;
       AddDataFactory.nestedDataClassification.get({
        "l0_permitted_projects__project_key": $stateParams.projectKey, 
        "parent_id": "None", 
        "full": "true" 
      },
        function(data){
          if(data.objects.length >= 1){
            $scope.no_l0 = false;
            dataoverviewctrl.l0_object = data.objects[0];

            $scope.getAnnotations(dataoverviewctrl.l0_object);
            $scope.iterate_children(dataoverviewctrl.l0_object);
          }else{
            $scope.no_l0 = true;
            dataoverviewctrl.l0_object = angular.copy($scope.assayctrl.l0_dfc.template_data_point_classification);
          }
          
        }
      );
    }
    dataoverviewctrl.openDetail = function(input_popup_data) {

      $scope.popup_data = angular.copy(input_popup_data);
      $scope.modalInstance = $modal.open({
        templateUrl: 'views/modal-template.html',
        size: 'lg',
        resolve: {
          popup_data: function () {
            return $scope.popup_data;
          },

        }, 
        controller: function($scope, $modalInstance, popup_data, $timeout) {
          $scope.popup_data = popup_data;
          
          $scope.modalInstance = $modalInstance;

      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };

        }
      });
    };
    dataoverviewctrl.openEditDetail = function(input_popup_data) {

      $scope.popup_data = angular.copy(input_popup_data);
      $scope.modalInstance = $modal.open({
        templateUrl: 'views/modal-edit-template.html',
        size: 'lg',
        resolve: {
          popup_data: function () {
            return $scope.popup_data;
          },

        }, 
        controller: function($scope, $modalInstance, popup_data, $timeout) {
          $scope.popup_data = popup_data;
          $scope.popup_data.this_level_edit_form = [];
          $scope.popup_data.this_level_edit_schema = { "type": "object", 'properties' : {}, 'required': [] };
          
          angular.forEach(popup_data.main_cfc.project_data_fields, function(proj_data){
            //pull out the edit_form.form and edit_schema.schema
            var form = angular.copy(proj_data.edit_form.form[0]);
            form.htmlClass = "col-xs-6";
            $scope.popup_data.this_level_edit_form.push(form);
            angular.extend($scope.popup_data.this_level_edit_schema.properties, angular.copy(proj_data.edit_schema.properties));
          });
          $scope.modalInstance = $modalInstance;

		  $scope.cancel = function () {
		    $modalInstance.dismiss('cancel');
		  };
      $scope.saveEdits = function() {
        //do the update
        dataoverviewctrl.setLoadingMessageHeight();
      dataoverviewctrl.currentlyLoading = true;
        var AddDF = AddDataFactory.dataClassification;
        var adfresult = AddDF.get({'dc': $scope.popup_data.id});
            adfresult.$promise.then(function(clone){
                  clone[$scope.popup_data.level_from] = $scope.popup_data.main_data;
                  clone.$update({'dc': $scope.popup_data.id} ,function(data){
                    $modalInstance.dismiss('saved');
                      $state.go($state.current, $stateParams, {reload: true});
                  });
            });
          }
        }
      });
    };
    dataoverviewctrl.fetchData();
dataoverviewctrl.setLoadingMessageHeight = function(){
            var scrollTop = $(window).scrollTop();
            $("#loading-message").css("top", (scrollTop +200) + "px")
        }
    dataoverviewctrl.save_dpc = function(new_dpc){
      dataoverviewctrl.setLoadingMessageHeight();
      dataoverviewctrl.currentlyLoading = true;
        var AddDF = AddDataFactory.dataClassification;
        AddDF.save(new_dpc,
            function(data){
              $state.go($state.current, $stateParams, {reload: true});
            }
          );
      }

      /*
      ************************ 
      STUFF FOR FILE UPLOAD UI
      ************************ 
      */

      $scope.inputData = {inputstring : ""};
        $scope.filedata = {};
        $scope.filesUploading = false;
        $scope.dataReady = false;
    $scope.csrftoken = $cookies[prefix.split("/")[0] + "csrftoken"];
    $scope.flowinit = {
      //need to change target to the new WS path provided by Andy
        target: urlConfig.instance_path.url_frag + 'flow/upload/',
        headers: {
            'X-CSRFToken': $scope.csrftoken
        }
    };

    //object containing user config, selected options and flowfile metadata returned from ws callls

    $scope.uploadData = {
      'sheetNames': [],
      'sheetName': '',
      'uploaded': false,

    }

    $scope.getSheetsForFile = function(fileId) {
      //perform get request to get list of sheets
      //probably best to create a resource here - we will need it for other types of upload (img etc)
      //FlowFileFactory.cbhFlowfile.
      var FlowDF = FlowFileFactory.cbhFlowfile;

        var fdfresult = FlowDF.get({'fileId': fileId});
        fdfresult.$promise.then(function(result){
          
          //put the sheet names into $scope.uploadData.sheetNames
          //$scope.uploadData.sheet_names = result.sheet_names;
          angular.forEach(result.sheet_names, function(sheet_name) {
            /*newobj = {}
            newobj.name = sheet_name*/
            $scope.uploadData.sheetNames.push({'name': sheet_name});
          })
          $scope.uploadData.uploaded = true;

        });

        //also need to get the possible levels and datapoint classifications to select from

    }

    $scope.getPreviewData = function() {

    }



  }]);
