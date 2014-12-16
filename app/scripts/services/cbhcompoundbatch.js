'use strict';

/**
 * @ngdoc service
 * @name ngChemApp.CBHCompoundBatch
 * @description
 * # CBHCompoundBatch
 * Factory in the ngChemApp.
 */
angular.module('ngChemApp')
  .factory('CBHCompoundBatch', function ($resource) {
    // Service logic
    // ...

    return $resource(
        "/chemblws/cbh_compound_batches/:Id",
        {Id: "@Id" },
        {
            "update": {method: "PUT"},
        }
    );
  });
