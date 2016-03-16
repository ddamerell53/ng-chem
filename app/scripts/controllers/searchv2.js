'use strict';

/**
 * @ngdoc function
 * @name chembiohubAssayApp.controller:SearchCtrl
 * @description
 * # SearchCtrl
 * Controller of the chembiohubAssayApp
 */


angular.module('chembiohubAssayApp')
    .controller('Searchv2Ctrl', ['$scope', '$http', '$rootScope', '$filter', '$stateParams', '$location', '$state', '$timeout', 'projectFactory', 'gridconfig', 'CBHCompoundBatch', 'urlConfig', 'SearchUrlParamsV2', '$modal', 'loggedInUser', 'ProjectTypeFactory', 'SavedSearchFactory',
        function($scope, $http, $rootScope, $filter, $stateParams, $location, $state, $timeout, projectFactory, gridconfig, CBHCompoundBatch, urlConfig, SearchUrlParamsV2, $modal, loggedInUser, ProjectTypeFactory, SavedSearchFactory) {
            


            $scope.cbh.appName = "ChemiReg";
            $scope.searchFormSchema = angular.copy($scope.cbh.projects.searchform);
           $scope.cbh.statename = $state.current.name;
            

           
            $scope.projectObj = {}


            if($stateParams.project__project_key__in  && $stateParams.justAdded){
                $scope.justAdded = $stateParams.justAdded;
                //convert the comma separated list to array
                $scope.selected_projects = $stateParams.project__project_key__in.split(',');
                if($scope.selected_projects.length == 1){
                    angular.forEach($rootScope.projects, function(myproj) {
                        if (myproj.project_key == $scope.selected_projects[0]) {
                            $scope.projectObj = myproj;
                        }
                    });
                }
                
            }
            




           



            $scope.cancel = function() {
                $state.params = {};
                $stateParams = {};
                var pf = searchUrlParams.setup({}, {
                    molecule: {}
                });
                $scope.cbh.searchForm = angular.copy(pf.searchForm);
                $state.transitionTo('cbh.search', {
                    location: true,
                    inherit: false,
                    relative: null,
                    notify: true,
                    reload: true
                });
                $state.go($state.current.name, $state.params, {
                    reload: true
                });
            }

            
       

            /* SAVED SEARCH STUFF */
            $scope.hasSearchBeenPerformed = function(){
                if($state.params == {}){
                    return false;
                }
                return true;
            }

            $scope.openNewSavedSearchPopup = function(){
                //get the current search
                //setup a model for the entry form
                $scope.newSavedSearchModel = { }
                $scope.modalInstance = $modal.open({
                  templateUrl: 'views/templates/new-saved-search-modal.html',
                  size: 'md',
                  resolve: {
                    newSavedSearchModel: function () {
                      return $scope.newSavedSearchModel;
                    },
                    searchFormSchema: function(){
                        return $scope.searchFormSchema;
                    },
                    saveSearch: function(){
                        return $scope.saveSearch;
                    },
                    projectFactory: function(){
                        return projectFactory;
                    }

                  }, 
                  controller: function($scope, $modalInstance, newSavedSearchModel, searchFormSchema, ProjectTypeFactory, projectFactory, SavedSearchFactory, saveSearch) {
                    $scope.newSavedSearchModel = newSavedSearchModel;
                    $scope.searchFormSchema = searchFormSchema;

                    $scope.saveSearch = saveSearch;
                    
                    $scope.modalInstance = $modalInstance;
                    $scope.errormess = "";

                    $scope.cancel = function () {
                      $modalInstance.dismiss('cancel');
                    };
                    $scope.doValidation = function(myForm){
                        console.log('doValidation being called', myForm)
                        if(myForm.$valid && $scope.newSavedSearchModel.alias != "" && !myForm.$pristine){
                            $scope.saveSearch();
                            $modalInstance.dismiss('cancel');
                        }
                        else if(myForm.$pristine){
                            $scope.errormess = "You must add a title";
                    
                        }

                    };

                  }
                });
            }

            $scope.openMySavedSearchPopup = function(){
                //Test data looks like:
                $scope.links = [];
                var params = {'creator_uri': loggedInUser.resource_uri};

                $http.get( urlConfig.cbh_saved_search.list_endpoint  + "/get_list_elasticsearch/", {'params': params}).then(function(data){
                    
                    $scope.links = data.data.objects;
                    $scope.modalInstance = $modal.open({
                      templateUrl: 'views/templates/my-searches-modal.html',
                      size: 'md',
                      resolve: {
                        links: function () {
                          //console.log('links',$scope.links);
                          return $scope.links;
                        }

                      }, 
                      controller: function($scope, $modalInstance, links, loggedInUser) {
                        $scope.links = links;
                        $scope.loggedInUser = loggedInUser;
                        $scope.modalInstance = $modalInstance;

                        $scope.cancel = function () {
                          $modalInstance.dismiss('cancel');
                        };

                        //more functions here

                        //determine the permissions on the link and send back and appropriate string: 
                        //user, group, project etc 
                        $scope.personalOrGroup = function(item){
                            //this maight not be useful now since the permissions have changed
                            return "personal"
                        }

                      }
                    });
                })

            }

            $scope.saveSearch = function(){
                //$scope.errormess = ""
                //from the project type service get saved_search_project_template (specify project_type.saved_search == true)
                //from what is returned, set the name and the name on the custom field config to (alias + timestamp) for uniqueness
                //set compound_batch.customFields.Url to be search url
                //set compound_batch.customFields.Alias to be alias
                //post to the create project resource
                //from what is returned get the resource_uri and project_key
                //set blinded_batch_id = "EMPTY_STRING"
                //send back to the savedsearch service

                //if(myForm.$valid){
                     
                    console.log('still being found');
                    ProjectTypeFactory.get({"saved_search_project_type": true}, function(data){
                      
                      $scope.savedSearchType = data.objects[0];
                      //var template = $scope.savedSearchType.project_template;
                      var d = new Date();
                      $scope.savedSearchType.project_template.name = $scope.newSavedSearchModel.alias + d.getTime().toString();
                      $scope.savedSearchType.project_template.custom_field_config.name = $scope.newSavedSearchModel.alias + d.getTime().toString();

                        projectFactory.save($scope.savedSearchType.project_template, function(data){
                            var resource_uri = data.resource_uri;
                            var savedSearchObj = {
                                "project": data.resource_uri,
                                "projectKey": data.project_key,
                                "blindedBatchId": "EMPTY_STRING",
                                "customFields": {
                                    alias: $scope.newSavedSearchModel.alias,
                                    url: window.location.href,
                                },
                                "uncuratedFields":{},
                                "warnings" :{}, 
                                "properties" :{},  
                                "errors" :{}
                            }
                            console.log(savedSearchObj)
                            var ssf = SavedSearchFactory.list;
                            ssf.save(savedSearchObj, function(data){
                                //search is now saved - close the modal
                                //make sure reindex is called on the correct thing within data
                                console.log('inside save');
                                var params = {"id": data.id}
                                $http.post( urlConfig.cbh_saved_search.list_endpoint  + "/reindex_compound/" , params)
                            });   
                        });
                      });
            }

			$scope.cbh.column = {}
            $rootScope.$on("columnSelection", function(event, col){
            	$scope.cbh.column = col
            })


        }
    ]);