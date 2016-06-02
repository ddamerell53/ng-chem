'use strict';

/**
 * @ngdoc controller
 * @name chembiohubAssayApp.controller:Searchv2Ctrl
 * @description
 * # Searchv2Ctrl
 * This controller is responsible for fetching data to construct the search form for ChemiReg. It initialises the search and handles all of the search form changes - calls to update the results are broadcast around the application. It also handles the saved search functionality within the search page.
 */
angular.module('chembiohubAssayApp')
    .controller('Searchv2Ctrl', ['$scope', '$http', '$rootScope', '$filter', '$stateParams', '$location', '$state', '$timeout', 'projectFactory', 'CBHCompoundBatch', 'urlConfig', 'SearchUrlParamsV2', '$modal', 'loggedInUser', 'ProjectTypeFactory', 'SavedSearchFactory', 
        function($scope, $http, $rootScope, $filter, $stateParams, $location, $state, $timeout, projectFactory, CBHCompoundBatch, urlConfig, SearchUrlParamsV2, $modal, loggedInUser, ProjectTypeFactory, SavedSearchFactory) {
            


            $scope.cbh.appName = "ChemiReg";
            $scope.searchFormSchema = angular.copy($scope.cbh.projects.searchform);
            $scope.cbh.statename = $state.current.name;
            
           
            $scope.projectObj = {};

            /**
             * @ngdoc method
             * @name $scope.cancel
             * @methodOf chembiohubAssayApp.controller:Searchv2Ctrl
             * @description
             * Cancel the current search and reset the form
             *
             */
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
            /**
             * @ngdoc method
             * @name $scope.hasSearchBeenPerformed
             * @methodOf chembiohubAssayApp.controller:Searchv2Ctrl
             * @description
             * 
             * 
             * @returns {boolean} true/false are any current search parameters in the URL
             */
            $scope.hasSearchBeenPerformed = function(){
                if($state.params == {}){
                    return false;
                }
                return true;
            }

            /**
             * @ngdoc method
             * @name $scope.openNewSavedSearchPopup
             * @methodOf chembiohubAssayApp.controller:Searchv2Ctrl
             * @description
             * Opens a ui-bootstrap modal window containing the form for saving a new saved search.
             * 
             */
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
                    saveSearch: function(){
                        return $scope.saveSearch;
                    },
                    projectFactory: function(){
                        return projectFactory;
                    }

                  }, 
                  controller: function($scope, $modalInstance, newSavedSearchModel,  ProjectTypeFactory, projectFactory, SavedSearchFactory, saveSearch, skinConfig) {
                    $scope.newSavedSearchModel = newSavedSearchModel;
                    $scope.savedSearchSchemaForm = skinConfig.objects[0].savedsearch_schemaform;
                    
                    $scope.modalInstance = $modalInstance;

                    $scope.cancel = function () {
                      $modalInstance.dismiss('cancel');
                    };
                    $scope.saveSearch = function(){
                      $scope.cancel();
                      saveSearch();
                    };
                    
                    
                    $scope.errormess = "";

                    
                    $scope.doValidation = function(myForm){
                        if(myForm.$valid && $scope.newSavedSearchModel.alias != "" && !myForm.$pristine){
                            $scope.saveSearch(); //make this a promise? and also delay closing of modal buy 1 sec so message can be displayed.
                        }
                        else if(myForm.$pristine){
                            $scope.errormess = "You must add a title";
                    
                        }
                        //TODO: account for string being too long for text field length (1028 chars)

                    };

                  }
                });
            }

            /**
             * @ngdoc method
             * @name $scope.openMySavedSearchPopup
             * @methodOf chembiohubAssayApp.controller:Searchv2Ctrl
             * @description
             * Opens a ui-bootstrap modal window containing the current user saved searches
             * 
             */
            $scope.openMySavedSearchPopup = function(){
                //Test data looks like:
                $scope.links = [];
                var encoded_username= $filter("encodeParamForSearch")({"field_path": "userfull.display_name", "value": loggedInUser.display_name});

                var params = {'encoded_query': encoded_username};

                //TODO - error handling for unreachable server or other back end error
                $http.get( urlConfig.cbh_saved_search.list_endpoint  + "/", {'params': params}).then(function(data){
                    
                    $scope.links = data.data.objects;
                    $scope.modalInstance = $modal.open({
                      templateUrl: 'views/templates/my-searches-modal.html',
                      size: 'md',
                      resolve: {
                        links: function () {
                          return $scope.links;
                        },
                        doFreshSearch: function(){
                          return $scope.doFreshSearch;
                        }
                      }, 
                      controller: function($scope, $modalInstance, links, loggedInUser, doFreshSearch) {
                        $scope.links = links;
                        $scope.loggedInUser = loggedInUser;
                        $scope.modalInstance = $modalInstance;
                        $scope.doFreshSearch = doFreshSearch;

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

            /**
             * @ngdoc method
             * @name chembiohubAssayApp.controller:Searchv2Ctrl#$scope.$on
             * @methodOf chembiohubAssayApp.controller:Searchv2Ctrl
             * @description
             * This function listens for an event generated by a user performing a chemical search which has come from a saved search.
             * This ensures that the chemical search parameters are not stale. No action is performed if this is not a saved chemical search.
             * @param {string} chemicalSearchReady  the name of the broadcast to act on
             * @param {function} callback  the callback function to trigger functionality
             *
             */
            $scope.$on('chemicalSearchReady', function(){
              if($scope.cbh.cameFromSavedSearch == true){
                //Called during the loading of the page if
                //the page has been loaded from a saved search in order
                //to ensure the chemical search is up to date
                $scope.cbh.cameFromSavedSearch = false;
                $rootScope.$broadcast("chemicalFilterApplied");
                $timeout(function(){
                  
                  $rootScope.$broadcast("searchParamsChanged");
                },50);
                

              }
            })

            /**
             * @ngdoc method
             * @name $scope.doFreshSearch
             * @methodOf chembiohubAssayApp.controller:Searchv2Ctrl
             * @description
             * Method for conducting a saved search based on saved parameters.
             * This method enusers that any parameters indicating a set of results, or a capping ID,
             * are removed from the search. It also ensures the correct processes for URL building and 
             * filter breadcrumb building are carried out.
             * 
             */
            $scope.doFreshSearch = function(searchObj){

              //trigger the new search as though structure has been changed.
              $scope.cbh.cameFromSavedSearch = true;

            }

            /**
             * @ngdoc method
             * @name $scope.saveSearch
             * @methodOf chembiohubAssayApp.controller:Searchv2Ctrl
             * @description
             * Mechanism for creating a new SavedSearch project and batch for storing information.
             * Fetches a new project of type saved_search_project_type, generates 2 searches to save:
             * - a capped search as a snapshot of how the search returns at the present moment;
             * - a reusable search which just contains the parameters searched for, which will show updated results if used in the future 
             * 
             */
            $scope.saveSearch = function(){
                //$scope.errormess = ""
                //from the project type service get saved_search_project_template (specify project_type.saved_search == true)
                //from what is returned, set the name and the name on the custom field config to (alias + timestamp) for uniqueness
                //set compound_batch.custom_fields.Url to be search url
                //set compound_batch.custom_fields.Alias to be alias
                //post to the create project resource
                //from what is returned get the resource_uri and project_key
                //set blinded_batch_id = "EMPTY_STRING"
                //send back to the savedsearch service

                    //TODO: handle unreachable query or server side error
                    $scope.currentlyLoading = true;
                    ProjectTypeFactory.get({"saved_search_project_type": true}, function(data){
                      
                      $scope.savedSearchType = data.objects[0];
                      
                      var d = new Date();
                      $scope.savedSearchType.project_template.name = $scope.newSavedSearchModel.alias + d.getTime().toString();
                      $scope.savedSearchType.project_template.custom_field_config.name = $scope.newSavedSearchModel.alias + d.getTime().toString();
                      SearchUrlParamsV2.generate_capped_saved_search($stateParams, $scope.cbh.selected_projects).then(function(new_state_params){
                        //create a new URL string with the newly generated state params
                      //is this a structural search? Indicate if so
                      var chemSearch = ""
                      if($stateParams.chemical_search_id){
                        chemSearch = $stateParams.chemical_search_id;
                      }
                      var new_capped_url = $state.href($state.current.name, new_state_params);
                        //TODO: handle unreachable query or server side error
                        projectFactory.save($scope.savedSearchType.project_template, function(data, chemSearch){
                            var resource_uri = data.resource_uri;
                            //change capped_url to the newly retrieved capped url
                            var savedSearchObj = {
                                "project": {"pk" :data.id},
                                "blinded_batch_id": "EMPTY_ID",
                                "custom_fields": {
                                    alias: $scope.newSavedSearchModel.alias,
                                    url: window.location.href,
                                    capped_url: new_capped_url,
                                    chem_search: chemSearch
                                },
                            }
                            var ssf = SavedSearchFactory.list;
                            //TODO: handle unreachable query or server side error
                            ssf.save(savedSearchObj, function(data){
                                //search is now saved - close the modal
                                //make sure reindex is called on the correct thing within data
                                
                                $scope.currentlyLoading = false;
                            });   
                        });
                      });
                    });
                      
            }

			$scope.cbh.column = {}

            /**
             * @ngdoc method
             * @name chembiohubAssayApp.controller:Searchv2Ctrl#$scope.$on
             * @methodOf chembiohubAssayApp.controller:Searchv2Ctrl
             * @description
             * This function listens for a user selecting a column to filter on in handsontable or on a search breadcrumb.
             * Sets this col object as the current col to be used for filtering and sorting changes to the search parameters.
             * @param {string} columnSelection  the name of the broadcast to act on
             * @param {function} callback  the callback function to trigger functionality
             *
             */
            $scope.$on("columnSelection", function(event, col){
            	$scope.cbh.column = col
            })


        }
    ]);