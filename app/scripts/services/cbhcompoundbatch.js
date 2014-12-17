'use strict';

/**
 * @ngdoc service
 * @name ngChemApp.CBHCompoundBatch
 * @description
 * # CBHCompoundBatch
 * Factory in the ngChemApp.
 */
angular.module('ngChemApp')
  .factory('CBHCompoundBatch', ['$http', function ($http) {
    // Service logic
    // ...

    var urlBase = "/chemblws/cbh_compound_batches/";
    var CBHCompoundBatch = {};

    CBHCompoundBatch.validate = function(molfile) {
        console.log("picking up")
      var arr = window.location.href.split("/");
      var baseUrl = arr[0] + "//" + arr[2] + urlBase
      return $http.post(baseUrl + "validate", {ctab:molfile});
    };

    return CBHCompoundBatch;

  }]);
