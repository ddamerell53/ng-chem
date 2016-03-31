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
            
           
            $scope.projectObj = {};


            $scope.cancel = function() {
                $state.params = {};
                $stateParams = {};
                var pf = searchUrlParams.setup({}, {
                    molecule: {}
                });
                $scope.cbh.searchForm = angular.copy(pf.searchForm);
                $state.transitionTo('cbh.searchv2', {
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
                        //TODO: account for string being too long for text field length (1028 chars)

                    };

                  }
                });
            }

            $scope.openMySavedSearchPopup = function(){
                //Test data looks like:
                $scope.links = [];
                var encoded_username= $filter("encodeParamForSearch")({"field_path": "created_by", "value": loggedInUser.display_name});

                var params = {'encoded_query': encoded_username};

                //TODO - error handling for unreachable server or other back end error
                $http.get( urlConfig.cbh_saved_search.list_endpoint  + "/", {'params': params}).then(function(data){
                    
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

                    //TODO: handle unreachable query or server side error
                    ProjectTypeFactory.get({"saved_search_project_type": true}, function(data){
                      
                      $scope.savedSearchType = data.objects[0];
                      
                      var d = new Date();
                      $scope.savedSearchType.project_template.name = $scope.newSavedSearchModel.alias + d.getTime().toString();
                      $scope.savedSearchType.project_template.custom_field_config.name = $scope.newSavedSearchModel.alias + d.getTime().toString();
                      SearchUrlParamsV2.generate_capped_saved_search($stateParams).then(function(new_state_params){
                        //create a new URL string with the newly generated state params
                      var new_capped_url = $state.href($state.current.name, new_state_params);
                        //TODO: handle unreachable query or server side error
                        projectFactory.save($scope.savedSearchType.project_template, function(data){
                            var resource_uri = data.resource_uri;
                            //change capped_url to the newly retrieved capped url
                            var savedSearchObj = {
                                "project": {"pk" :data.id},
                                "blinded_batch_id": "EMPTY_ID",
                                "custom_fields": {
                                    alias: $scope.newSavedSearchModel.alias,
                                    url: window.location.href,
                                    capped_url: new_capped_url
                                },
                            }
                            var ssf = SavedSearchFactory.list;
                            //TODO: handle unreachable query or server side error
                            ssf.save(savedSearchObj, function(data){
                                //search is now saved - close the modal
                                //make sure reindex is called on the correct thing within data
                              
                            });   
                        });
                      });
                    });
                      
            }

			$scope.cbh.column = {}
            $scope.$on("columnSelection", function(event, col){
            	$scope.cbh.column = col
            })


        }
    ]);