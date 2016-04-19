'use strict';

/**
 * @ngdoc function
 * @name ngChemApp.controller:ProjectlistCtrl
 * @description
 * # ProjectlistCtrl
 * Controller of the ngChemApp
 */
angular.module('chembiohubAssayApp')
  .controller('ProjectlistCtrl',function($rootScope, 
    $state, 
    $stateParams, 
    $scope, 
    AddDataFactory, 
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
        $rootScope.projectKey = $scope.cbh.skinning.project_alias + "s";
        $rootScope.projName = $scope.cbh.skinning.project_alias + "s";
        $rootScope.glyphicon = "folder-open";

        //if a new user has no projects associated, refdirect them to a default view with supplementary info
        // if(angular.equals({}, $rootScope.projects)) {
        //   $state.go('cbh.projects.empty');
        // }
        $scope.isDefault = true;
        $scope.toggleDataSummary = {
          showFlag: false,
        }
        $scope.toggleSingleForm = {
          showFlag: false,
        };

        /* Provide a link from the project list page to the assayreg page for items in this project which have been added by this user */
        $scope.cbh.searchForUserWithProjectKey = function(projKey){
          //TODO handle error here
          AddDataFactory.nestedDataClassification.get({
                        "project_key": projKey,
                    },
                    function(data) {
                        if (data.objects.length >= 1) {
                          //forward to the assayreg search with this project and this user prepopulated
                            $state.go('cbh.search_assays', {
                              'useruris': [ $scope.cbh.logged_in_user.resource_uri ],
                              'l0': [ data.objects[0].l0.resource_uri ],
                            })

                        } else {
                          //there's no data for that assayreg project - just let them search their name
                            $state.go('cbh.search_assays', {
                              'useruris': [ $scope.cbh.logged_in_user.resource_uri ]
                            })
                        }
                    }
                );
        };/*
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
