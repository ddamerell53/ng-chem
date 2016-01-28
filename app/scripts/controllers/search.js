'use strict';

/**
 * @ngdoc function
 * @name chembiohubAssayApp.controller:SearchCtrl
 * @description
 * # SearchCtrl
 * Controller of the chembiohubAssayApp
 */


angular.module('chembiohubAssayApp')
    .controller('SearchCtrl', ['$scope', '$http', '$rootScope', '$filter', '$stateParams', '$location', '$state', '$timeout', 'projectFactory', 'gridconfig', 'CBHCompoundBatch', 'urlConfig', 'searchUrlParams', '$modal', 'loggedInUser', 'ProjectTypeFactory', 'SavedSearchFactory',
        function($scope, $http, $rootScope, $filter, $stateParams, $location, $state, $timeout, projectFactory, gridconfig, CBHCompoundBatch, urlConfig, searchUrlParams, $modal, loggedInUser, ProjectTypeFactory, SavedSearchFactory) {
            $scope.cbh.appName = "ChemReg";
            $scope.searchFormSchema = angular.copy($scope.cbh.projects.searchform);
            $scope.cbh.textsearch = $stateParams.textsearch;
            $scope.refresh = function(schema, options, search) {
                return $http.get(options.async.url + "?chembl_id__chembl_id__startswith=" + search);
            }
            $scope.refreshCustFields = function(schema, options, search) {
                var urlToSearch = $scope.cbh.withoutCustomFieldsUrl + "&custom__field__startswith=" + search;
                return $http.get(options.async.url + "?" + urlToSearch );
            }
            var pf = searchUrlParams.setup($stateParams, {
                molecule: {}
            });
            $scope.cbh.pf = pf;
            $scope.cbh.searchForm = angular.copy(pf.searchForm);
            
            $scope.cbh.setupParams = function(paramsAndForm){
                
                $scope.cbh.baseDownloadUrl = paramsAndForm.paramsUrl;
                $scope.cbh.withoutCustomFieldsUrl = paramsAndForm.paramsUrlWithoutCF;
            }
            $scope.cbh.setupParams(pf);
            //$scope.searchFormSchema.form[0].options.async.call = $scope.refresh;
            //refactor this to use a filter
            $scope.uoxFormItem = $filter('filter')($scope.searchFormSchema.form, {
                key: 'related_molregno__chembl__chembl_id__in'
            }, true);
            $scope.uoxFormItem[0].options.async.call = $scope.refresh;
            // need to repeat this for the custom field lookup
            // $scope.searchFormSchema.form[2].$validators = {
            //     notEnough: function(value) {
            //         if (!angular.isDefined(value)) {
            //             return false;
            //         }
            //         if (value.length == 0) {
            //             return false;
            //         }
            //         return true
            //     }
            // }
            $scope.custFieldFormItem = $filter('filter')($scope.searchFormSchema.simple_form, {
                key: 'search_custom_fields__kv_any'
            }, true);
            $scope.custFieldFormItem[0].options.async.call = $scope.refreshCustFields;
            $scope.projectFrom = $stateParams.projectFrom;
            $scope.projectObj = {}
            //we need the project pbject for this key
            angular.forEach($rootScope.projects, function(myproj) {
                if (myproj.project_key == $scope.projectFrom) {
                    $scope.projectObj = myproj;
                }
            });

            function updateFields() {
                if ($scope.cbh.searchForm.related_molregno__chembl__chembl_id__in) {
                    $scope.searchFormSchema.schema.properties.related_molregno__chembl__chembl_id__in.items = $scope.cbh.searchForm.related_molregno__chembl__chembl_id__in.map(function(i) {
                        return {
                            value: i,
                            label: i
                        }
                    });
                }

                if ($scope.cbh.searchForm.search_custom_fields__kv_any) {
                    $scope.searchFormSchema.schema.properties.search_custom_fields__kv_any.items = $scope.cbh.searchForm.search_custom_fields__kv_any.map(function(i) {
                        return {
                            value: i,
                            label: i.replace("|", ": ")
                        }
                    });
                }
            }
            updateFields();



            $scope.$on("sf-render-finished", function() {
                $timeout(function() {
                    // $rootScope.$broadcast("schemaFormValidate");
                    $scope.cbh.watcher = $scope.$watch(
                        function($scope) {
                            return $scope.cbh.textsearch;
                        },
                        function(newValue, oldvalue) {

                            if (newValue != oldvalue) {

                                $scope.cbh.runSearch();
                            }

                        },
                        true
                    );


                    $scope.cbh.watcher2 = $scope.$watch(
                        function($scope) {
                            var newObj = {};
                            var array = Object.keys($scope.cbh.searchForm).map(function(value, index) {
                                if (value != "molecule") {
                                    newObj[value] = $scope.cbh.searchForm[value];
                                }
                            });
                            return newObj;
                        },
                        function(newValue, oldvalue) {

                            if (JSON.stringify(newValue) != JSON.stringify(oldvalue)) {
                                if ((newValue.project__project_key__in.length != 1) && $scope.cbh.editMode) {
                                    $scope.cbh.toggleEditMode();
                                }
                                $scope.cbh.runSearch();
                            }

                        },
                        true
                    );

                });

                $scope.cbh.searchForm.molecule.molfileChanged = function() {
                    $stateParams[$scope.cbh.searchForm.substruc] = $scope.cbh.searchForm.molecule.molfile;
                    $state.params[$scope.cbh.searchForm.substruc] = $scope.cbh.searchForm.molecule.molfile;
                    $location.search($stateParams).replace();
                };

            })



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

            $scope.cbh.runSearch = function(doScroll) {
                $rootScope.$broadcast("fetchMolecule");
                $timeout (function(){
                    var newParams = searchUrlParams.fromForm($scope.cbh.searchForm, $scope.cbh.textsearch);
                    newParams.params.doScroll = doScroll;
                    newParams.params.sorts = $stateParams.sorts;
                    newParams.params.showNonBlanks = $stateParams.showNonBlanks;
                    newParams.params.showBlanks = $stateParams.showBlanks;
                    $scope.cbh.changeSearchParams(newParams.params, true);
                },10);
                
            }

            $scope.cbh.isCustomFieldFiltered = function(knownBy) {
                if (angular.isDefined($stateParams.search_custom_fields__kv_any)) {
                    if ($stateParams.search_custom_fields__kv_any.indexOf(knownBy) > -1) {
                        return true;
                    }
                }

                return false;
            }

            $scope.cbh.repaintUiselect = function() {
                updateFields();
                $rootScope.$broadcast('schemaFormRedraw');
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

                    $scope.cancel = function () {
                      $modalInstance.dismiss('cancel');
                    };

                  }
                });
            }

            $scope.openMySavedSearchPopup = function(){
                //$scope.popup_data = angular.copy(input_popup_data);
                //Test data looks like:
                $scope.links = [];
                //This is what the SavedSearchFactory get links method will look like
                /*var ssf = SavedSearchFactory.list_es;


                ssf.get(function(data){
                    //search is now saved - close the modal
                    //make sure reindex is called on the correct thing within data
                    
                    $scope.links = data.objects;

                });*/
                $http.get( urlConfig.cbh_saved_search.list_endpoint  + "/get_list_elasticsearch/").then(function(data){
                    
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
                        
                //from the project type service get saved_search_project_template (specify project_type.saved_search == true)
                //from what is returned, set the name and the name on the custom field config to (alias + timestamp) for uniqueness
                //set compound_batch.customFields.Url to be search url
                //set compound_batch.customFields.Alias to be alias
                //post to the create project resource
                //from what is returned get the resource_uri and project_key
                //set blinded_batch_id = "EMPTY_STRING"
                //send back to the savedsearch service
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

        }
    ]);