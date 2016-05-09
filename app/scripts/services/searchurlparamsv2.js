'use strict';

/**
 * @ngdoc service
 * @name chembiohubAssayApp.SearchUrlParamsV2
 * @description
 * # SearchUrlParamsV2
 * Factory for providing URL compatible search parameters from a supplied elasticsearch query object or from current state parameters.
 * @returns {object} searchUrlParamsV2 An object containing an elasticsearch formatted query object.
 */
angular.module('chembiohubAssayApp')
    .factory('SearchUrlParamsV2', ['$filter', '$state', 'skinConfig', '$rootScope', 'CBHCompoundBatch', 'urlConfig', 'chemicalSearch', function($filter, $state, skinConfig, $rootScope, CBHCompoundBatch, urlConfig, chemicalSearch) {

        // Private variables

        // Private constructor

        var searchUrlParamsV2 = { "params": { "query": [] } };

        /**
         * @ngdoc property
         * @name chembiohubAssayApp.SearchUrlParamsV2#searchUrlParamsV2.generate_form
         * @propertyOf chembiohubAssayApp.SearchUrlParamsV2
         * @description
         * Create a form model object based on the current state parameters and other supplied parameters if appropriate. This method fires off 
         * an number of broadcast events relating to page redraws, chemical search initialisation etc.
         * @param {object} stateParams The current URL search parameters of the current state in a JSON object
         * @param {object} cbh The top-level global cbh controller object
         */
        searchUrlParamsV2.generate_form = function(stateParams, cbh) {
            skinConfig.objects[0].refresh_tabular_schema();


            var schema = skinConfig.objects[0].tabular_data_schema.copied_schema;
            var filteredColumns = [];
            var filterObjects = [];
            if (stateParams.encoded_query) {
                var qs = JSON.parse(atob(stateParams.encoded_query));
                angular.forEach(qs, function(q) {
                    schema[q.field_path].filters = q;
                    filterObjects.push(schema[q.field_path]);
                    filteredColumns.push(q.field_path);
                });
                skinConfig.objects[0].filters_applied = filteredColumns;
                skinConfig.objects[0].filter_objects = filterObjects;
            } else {
                skinConfig.objects[0].filters_applied = [];
                skinConfig.objects[0].filter_objects = [];
            }
            if (stateParams.encoded_hides) {
                var hides = JSON.parse(atob(stateParams.encoded_hides));
                var hideObjs = [];
                angular.forEach(hides, function(hide) {
                    schema[hide].hide = "hide";
                    hideObjs.push(schema[hide]);
                });
                skinConfig.objects[0].hides_applied = hides;
                skinConfig.objects[0].hide_objects = hideObjs;
            } else {
                skinConfig.objects[0].hides_applied = [];
                skinConfig.objects[0].hide_objects = [];
            }

            if (stateParams.encoded_sorts) {
                var sorts = JSON.parse(atob(stateParams.encoded_sorts));
                var sort_objects = [];
                var sorts_applied = [];
                angular.forEach(sorts, function(sort) {
                    schema[sort.field_path].sort_direction = sort.sort_direction;
                    sort_objects.push(schema[sort.field_path]);
                    sorts_applied.push(sort.field_path);
                });
                skinConfig.objects[0].sorts_applied = sorts_applied;
                skinConfig.objects[0].sort_objects = sort_objects;
            } else {
                skinConfig.objects[0].sorts_applied = [];
                skinConfig.objects[0].sort_objects = [];
            }

            var projids = [];
            var projforChemSearch = [];
            if (stateParams.pids) {
                projids = stateParams.pids.split(",");
            }


            cbh.selected_projects = [];

            angular.forEach(cbh.projects.objects, function(p) {
                if (projids.indexOf(p.id.toString()) > -1) {
                    p.filtered = true;
                    cbh.selected_projects.push(p);
                } else {
                    p.filtered = false;
                }
            });


            if (stateParams.textsearch) {
                cbh.textsearch = atob(stateParams.textsearch);
            } else {
                cbh.textsearch = '';
            }

            if (stateParams.chemical_search_id) {
                //get it



                chemicalSearch.get({ "id": stateParams.chemical_search_id }, function(data) {
                    skinConfig.objects[0].chemicalSearch = data;
                    skinConfig.objects[0].chemicalSearch.pids = stateParams.pids;


                    if (cbh.cameFromSavedSearch == true) {
                        $rootScope.$broadcast("chemicalSearch");
                    } else {
                        $rootScope.$broadcast("chemicalFilterApplied");
                        $rootScope.$broadcast("searchParamsChanged");
                    }
                }, function(error) {

                });

            } else {
                skinConfig.objects[0].chemicalSearch = { "pids": stateParams.pids };
            }




        };

        /**
         * @ngdoc function
         * @name chembiohubAssayApp.SearchUrlParamsV2#ngParamSerializer
         * @methodOf chembiohubAssayApp.SearchUrlParamsV2
         * @description
         * Serializer for the current search parameters, pperfomrs encodeURIComponent on each in turn and returns a concatenated string.
         * @param {object} params object containing key value pairs representing the current search query.
         * @returns {string} parts the URI encoded concatenated string.
         */
        function ngParamSerializer(params) {
            if (!params) return '';
            var parts = [];
            angular.forEach(params, function(value, key) {
                if (value === null || angular.isUndefined(value)) return;
                if (angular.isArray(value)) {
                    angular.forEach(value, function(v) {
                        parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(v));
                    });
                } else {
                    parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
                }
            });

            return parts.join('&');
        };

        /**
         * @ngdoc method
         * @name chembiohubAssayApp.SearchUrlParamsV2#searchUrlParamsV2.setBaseDownloadUrl
         * @methodOf chembiohubAssayApp.SearchUrlParamsV2
         * @description
         * Creates a fully resolved URL do use as a starting point for building a download URL for the current installation, 
         * with parameters and limits to be added later.
         * @param {object} cbh The top-level global cbh controller object
         * @param {object} params Object containing search parameters in JSON format
         */
        searchUrlParamsV2.setBaseDownloadUrl = function(cbh, params) {
            cbh.baseDownloadUrl = urlConfig.cbh_compound_batches_v2.list_endpoint + "?";
            cbh.baseDownloadUrl += ngParamSerializer(params);
        }

        /**
         * @ngdoc method
         * @name chembiohubAssayApp.SearchUrlParamsV2#searchUrlParamsV2.generate_chemical_params
         * @methodOf chembiohubAssayApp.SearchUrlParamsV2
         * @description
         * Concatenates chemical search parameters, which may not be in an expected format, into the existing specified params object. 
         * Also alters the skinConfig object to signal that a chemical search has been added.
         * @param {object} params Object containing search parameters in JSON format.
         * @returns {object} params The altered params object.
         */
        searchUrlParamsV2.generate_chemical_params = function(params) {
            params.chemical_search_id = skinConfig.objects[0].chemicalSearch.id;

            skinConfig.objects[0].chemicalSearch.filter_is_applied = true;
            return params;
        }

        /**
         * @ngdoc method
         * @name chembiohubAssayApp.SearchUrlParamsV2#searchUrlParamsV2.generate_filter_params
         * @methodOf chembiohubAssayApp.SearchUrlParamsV2
         * @description
         * Concatenates search filter parameters, including appropriate subqueries, into the existing specified params object. 
         * Also alters the skinConfig object to signal that a filter has been added, and broadcasts a {@link chembiohubAssayApp.SearchUrlParamsV2#properties_searchUrlParamsV2.generate_form searchParamsChanged} searchParamsChanged event.
         * @param {object} params Object containing search parameters in JSON format.
         * @returns {object} params The altered params object.
         */
        searchUrlParamsV2.generate_filter_params = function(params) {
            var schema = skinConfig.objects[0].tabular_data_schema.copied_schema;
            var filteredColumns = [];

            var query = skinConfig.objects[0].filters_applied.map(function(item) {
                var subQ = {};
                //Select only the filters that have a value - note that the data has been validated already

                angular.forEach(schema[item].filters, function(v, k) {
                    if (v) {
                        subQ[k] = v;
                    }
                });

                subQ["field_path"] = schema[item].data;
                filteredColumns.push(schema[item]);
                return subQ;
            });
            params.encoded_query = btoa(JSON.stringify(query));

            skinConfig.objects[0].filter_objects = filteredColumns;
            $rootScope.$broadcast("searchParamsChanged");
            return params

        };

        /**
         * @ngdoc method
         * @name chembiohubAssayApp.SearchUrlParamsV2#searchUrlParamsV2.generate_hide_params
         * @methodOf chembiohubAssayApp.SearchUrlParamsV2
         * @description
         * Explanation here
         * @param {object} params Object containing search parameters in JSON format.
         * @returns {object} params The altered params object.
         */
        searchUrlParamsV2.generate_hide_params = function(params) {
            var schema = skinConfig.objects[0].tabular_data_schema.copied_schema;
            var hides = skinConfig.objects[0].hides_applied;

            var hideObjs = [];
            angular.forEach(hides, function(field_path) {
                hideObjs.push(schema[field_path]);
            });
            skinConfig.objects[0].hide_objects = hideObjs;
            params.encoded_hides = btoa(JSON.stringify(hides));

            $rootScope.$broadcast("searchParamsChanged");
            return params;
        }

        /**
         * @ngdoc method
         * @name chembiohubAssayApp.SearchUrlParamsV2#searchUrlParamsV2.generate_sort_params
         * @methodOf chembiohubAssayApp.SearchUrlParamsV2
         * @description
         * Explanation here
         * @param {object} params Object containing search parameters in JSON format.
         * @returns {object} params The altered params object.
         */
        searchUrlParamsV2.generate_sort_params = function(params) {
            var schema = skinConfig.objects[0].tabular_data_schema.copied_schema;
            var sorts = [];
            var sortsapp = skinConfig.objects[0].sorts_applied;
            var sortObjs = [];
            angular.forEach(sortsapp, function(field_path) {
                var sort = { "field_path": field_path, "sort_direction": schema[field_path].sort_direction };
                sorts.push(sort);
                sortObjs.push(schema[field_path]);
            })
            skinConfig.objects[0].sort_objects = sortObjs;

            params.encoded_sorts = btoa(JSON.stringify(sorts));

            $rootScope.$broadcast("searchParamsChanged");
            return params;
        }

        /**
         * @ngdoc method
         * @name chembiohubAssayApp.SearchUrlParamsV2#searchUrlParamsV2.get_textsearch_params
         * @methodOf chembiohubAssayApp.SearchUrlParamsV2
         * @description
         * Explanation here
         * @param {object} params The top-level global cbh controller object
         */
        searchUrlParamsV2.get_textsearch_params = function(stateParams, textsearch) {
            //Adding a function here so everything is in one place that affects the search params
            stateParams.textsearch = btoa(textsearch);
            return stateParams;
        }

        /**
         * @ngdoc method
         * @name chembiohubAssayApp.SearchUrlParamsV2#searchUrlParamsV2.get_project_params
         * @methodOf chembiohubAssayApp.SearchUrlParamsV2
         * @description
         * Explanation here
         * @param {object} params The top-level global cbh controller object
         */
        searchUrlParamsV2.get_project_params = function(stateParams, selected_projects) {
            var pids = selected_projects.map(function(p) {
                return p.id });
            stateParams.pids = pids.join(",");
            skinConfig.objects[0].chemicalSearch.pids = stateParams.pids;
            return stateParams
        }

        /* For saved search, we are limiting the set of returned items to provide a snapshot 
           of that search at the time specified.
           To do this, we need to get the result returned by the search with the highest batch ID */
        /**
         * @ngdoc method
         * @name chembiohubAssayApp.SearchUrlParamsV2#searchUrlParamsV2.generate_capped_saved_search
         * @methodOf chembiohubAssayApp.SearchUrlParamsV2
         * @description
         * Explanation here
         * @param {object} params The top-level global cbh controller object
         */
        searchUrlParamsV2.generate_capped_saved_search = function(params, selected_projects) {
            //get the params as JSON

            var paramsObj = []
            if (params.encoded_query) {
                paramsObj = JSON.parse(atob(params.encoded_query));
            }
            var backend_query = { 'limit': 1, 'offset': 0 };
            var importantParams = ['pids', 'archived', 'encoded_query'];
            angular.forEach(importantParams, function(p) {
                    backend_query[p] = params[p];

                })
                //TODO hanlde error from this call
            var promise = CBHCompoundBatch.queryv2(backend_query).then(function(result) {

                //get the single result, and add this as a parameter to encoded_query

                if (result.objects.length > 0) {
                    var cap_batch_id = result.objects[0].id
                    var capping_query = {
                        "query_type": "less_than",
                        "less_than": cap_batch_id,
                        "field_path": "id"
                    }
                    paramsObj.push(capping_query);
                }

                params.encoded_query = btoa(JSON.stringify(paramsObj));
                //we haven't changed the search parameters - we're just getting what they would be if capped so no need to notify about parameter changes
                return params


            });

            return promise;


        }


        return searchUrlParamsV2;

        // Public API for configuration


    }]);