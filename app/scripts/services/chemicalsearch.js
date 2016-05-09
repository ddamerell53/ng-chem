'use strict';

/**
 * @ngdoc service
 * @name chembiohubAssayApp.service:chemicalSearch
 * @description
 * # chemicalSearch
 * Factory in the chembiohubAssayApp.Provides a service convenience class for the cbh_chemical_search webservice.
 * @param {object} $resource angular library for constructing webservice calls from URLs.
 * @param {object} urlConfig app config object containing aliases for all available web service endpoints.
 */
angular.module('chembiohubAssayApp')
  .factory('chemicalSearch', function ($resource, urlConfig) {
    // Service logic
    // ...


    // Public API here
    return $resource(urlConfig.cbh_chemical_search.list_endpoint + '/:id', {id: '@id'});
  });
