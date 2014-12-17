'use strict';

/**
 * @ngdoc service
 * @name ngChemApp.CBHCompoundBatch
 * @description
 * # CBHCompoundBatch
 * Factory in the ngChemApp.
 */
angular.module('ngChemApp')
  .factory('CBHCompoundBatch', [$http, function ($http) {
    // Service logic
    // ...

    var urlBase = "/chemblws/cbh_compound_batches/";
    var CBHCompoundBatch = {};

    CBHCompoundBatch.validate(function(molfile) {
      return $http.post({ctab:molfile}, urlBase + "validate");
    });

  }]);
