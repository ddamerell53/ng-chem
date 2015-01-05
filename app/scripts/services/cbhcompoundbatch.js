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


    CBHCompoundBatch.saveSingleCompound = function(molfile, customFields) {
        var arr = window.location.href.split("/");
        var myUrl = arr[0] + "//" + arr[2] + urlBase;
        return $http.post( myUrl , {ctab:molfile, "customFields":customFields });
    };

    CBHCompoundBatch.saveBatch = function(molfile, config) {

        return $http.post( myUrl + "bulk/save/", {ctab:molfile, config:config });
    };

    CBHCompoundBatch.validateBatch = function(molfiles) {

        return $http.post( myUrl + "bulk/validate", {ctab:molfile });
    };

    CBHCompoundBatch.uploadBatch = function(molfiles) {

        return $http.post( myUrl + "bulk/upload", {ctab:molfile });
    };

    return CBHCompoundBatch;

  }]);
