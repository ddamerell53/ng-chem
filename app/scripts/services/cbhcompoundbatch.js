'use strict';

/**
 * @ngdoc service
 * @name ngChemApp.CBHCompoundBatch
 * @description
 * # CBHCompoundBatch
 * Factory in the ngChemApp.
 */
angular.module('ngChemApp')
  .factory('CBHCompoundBatch', ['$http', '$q' ,function ($http) {
    // Service logic
    // ...

    var urlBase = "/chemblws/cbh_compound_batches/";
    var CBHCompoundBatch = {};

    var arr = window.location.href.split("/");
    var myUrl = arr[0] + "//" + arr[2] + urlBase;

    CBHCompoundBatch.validate = function(molfile) {

      return $http.post( myUrl + "validate/", {ctab:molfile});
    };

    CBHCompoundBatch.saveSingleCompound = function(molfile, config) {

        return $http.post( myUrl + "compound_batches/", {ctab:molfile, config:config });
    };

    CBHCompoundBatch.saveBatch = function(molfile, config) {

        return $http.post( myUrl + "compound_batches/bulk/save/", {ctab:molfile, config:config });
    };

    CBHCompoundBatch.validateBatch = function(molfiles) {

        return $http.post( myUrl + "compound_batches/bulk/validate", {ctab:molfile });
    };

    CBHCompoundBatch.uploadBatch = function(molfiles) {

        return $http.post( myUrl + "compound_batches/bulk/upload", {ctab:molfile });
    };

    return CBHCompoundBatch;

  }]);
