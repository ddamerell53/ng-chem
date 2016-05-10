'use strict';

/**
 * @ngdoc service
 * @name chembiohubAssayApp.SavedSearchFactory
 * @description
 * # SavedSearchFactory
 * Factory for providing convenient, parameterised access to the saved search related API endpoints ({@link https://github.com/thesgc/chembiohub_ws/wiki/Saved-Search-API cbh_saved_search}).
 * @param {object} $resource angular library for constructing webservice calls from URLs.
 * @param {object} urlConfig app config object containing aliases for all available web service endpoints.
 * @returns {object} $resource angular service containing access to the project list endpoint.
 */
angular.module('chembiohubAssayApp')
  .factory('SavedSearchFactory', ['$resource', 'urlConfig', function ($resource, urlConfig) {

    var list = $resource(urlConfig.cbh_saved_search.list_endpoint, {}, {});

    return {
      "list":list,
    }

    
  }]);
