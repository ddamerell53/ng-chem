'use strict';

/**
 * @ngdoc controller
 * @name chembiohubAssayApp.controller:ProjectlistCtrl
 * @description
 * # ProjectlistCtrl
 * Retrieves lists of projects for the project list page, as well as controlling the Add Project modal window.
 */
angular.module('chembiohubAssayApp')
  .controller('ProjectlistCtrl',function($rootScope, 
    $state, 
    $stateParams, 
    $scope, 
    $modal, 
    $timeout, 
    ProjectFactory, 
    ProjectTypeFactory, 
    Projectpermissions, 
    userList,
    urlConfig,
    loggedInUser,
    ProjectPermissionAllRoles) {
      $scope.default_project_type = undefined;
      $scope.links = [];

        /**
         * @ngdoc method
         * @name chembiohubAssayApp.controller:ProjectlistCtrl#refreshProjectTypes
         * @methodOf chembiohubAssayApp.controller:ProjectlistCtrl
         * @description
         * Retrieves non-saved-search project types and maps the default fields for that project so the can be used within the Add Project modal.
         * 
         */
        var refreshProjectTypes = function(){
          //TODO handle error here
                ProjectTypeFactory.get({"saved_search_project_type": false}, function(data){
                  var ptypeSet = false;
                  $scope.projectTypes = data.objects.map(function(pType){
                      
                      if(pType.set_as_default){
                        $scope.default_project_type = pType;
                        ptypeSet = true;
                      }
                      return {"name": pType.name, "value" : pType};
                    });
                  $timeout(function(){
                    if(!ptypeSet){
                      $scope.default_project_type = data.objects[0];
                    }
                  });
                    
                 
                  
                  });
                
              }


        
        refreshProjectTypes();

        /**
         * @ngdoc method
         * @name chembiohubAssayApp.controller:ProjectlistCtrl#$scope.openProjectWindow
         * @methodOf chembiohubAssayApp.controller:ProjectlistCtrl
         * @description
         * Opens and controls the Add Project modal window in the Project List page.
         * @param {integer} projectId The next sequential project ID to use for this newly created project.
         * 
         */
        $scope.openProjectWindow = function(projectId){

            $scope.projectId = projectId
            $scope.modalInstance = $modal.open({
            templateUrl: 'views/modal-edit-project.html',
            size: 'lg',
            resolve: {
                projectId: function () {
                  return $scope.projectId;
                },
                default_project_type: function(){
                    return $scope.default_project_type;
                },
                projectTypes: function(){
                    return $scope.projectTypes;
                }
            }, 
            controller: "ProjectfieldsCtrl"
          });
   
        }

        /**
         * @ngdoc method
         * @name chembiohubAssayApp.controller:ProjectlistCtrl#$scope.openEditPermissions
         * @methodOf chembiohubAssayApp.controller:ProjectlistCtrl
         * @description
         * Opens and controls the Edit Project modal window in the Project List page.
         * @param {integer} projectId The next sequential project ID to use for this newly created project.
         * 
         */
        $scope.openEditPermissions = function(proj){
            //Note same template because we are using angular schema form
            $scope.projectId = proj.id;
            $scope.proj = proj;
            $scope.modalInstance = $modal.open({
            templateUrl: 'views/modal-project-permissions.html',
            size: 'md',
            resolve: {
                proj: function(){
                  return $scope.proj;
                },
                permissions:function(){
                  return  ProjectPermissionAllRoles.get_for_project($scope.projectId);
                }
            }, 
            controller: "ProjectpermissionsCtrl"
          });
   
        }




        $scope.cbh.appName = "Platform";

        $rootScope.headline = $scope.cbh.skinning.project_alias + " List";
        $rootScope.subheading = "A list of all of the projects you have access to.";
        $rootScope.help_lookup = "";
        $rootScope.project_key = $scope.cbh.skinning.project_alias + "s";
        $rootScope.projName = $scope.cbh.skinning.project_alias + "s";
        $rootScope.glyphicon = "folder-open";


        $scope.toggleDataSummary = {
          showFlag: false,
        }
        $scope.toggleSingleForm = {
          showFlag: false,
        };

        /*
        $timeout(function(){
          svgify();
        })*/
        //$timeout(function(){ $scope.loadSavedSearches();});
        $scope.search = {
          'name':''
        }/*
        $scope.$watch('search.name', function(){
          $timeout(function(){
            svgify();
          })
        })*/

      } );
