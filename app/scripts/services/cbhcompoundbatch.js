'use strict';

/**
 * @ngdoc service
 * @name ngChemApp.CBHCompoundBatch
 * @description
 * # CBHCompoundBatch
 * Factory in the ngChemApp.
 */
angular.module('ngChemApp')
  .factory('CBHCompoundBatch', ['$http', '$q'  ,function ($http) {
    // Service logic
    // ...

    var urlBase = "/chemblws/cbh_compound_batches/";
    var urlBaseForFiles = "/chemblws/cbh_batch_upload/";
    var CBHCompoundBatch = {};

    var arr = window.location.href.split("/");
    var myUrl = arr[0] + "//" + arr[2] + urlBase;
    var myUrlForFiles = arr[0] + "//" + arr[2] + urlBaseForFiles;


    CBHCompoundBatch.getSingleMol = function(){
        return { acdAcidicPka: null,
                         acdBasicPka: null,
                         acdLogd: null,
                         acdLogp: null,
                         alogp: null,
                         chemblId: "",
                         created: "",
                         ctab: "",
                         customFields: {},
                         editableBy: {},
                         id: null,
                         knownDrug: 0,
                         medChemFriendly: null,
                         modified: "",
                         molecularFormula: "",
                         molecularWeight: null,
                         numRo5Violations: null,
                         passesRuleOfThree: null,
                         preferredCompoundName: null,
                         rotatableBonds: 0,
                         smiles: "",
                         species: null,
                         stdCtab: "",
                         stdInChiKey: "",
                     };
    }

    CBHCompoundBatch.validateList = function(projectKey, values){
        values.projectKey = projectKey;
        var promise = $http.post( urlBase + "validate_list/" , values).then(
            function(data){
                return data.data;
            }
        );
        return promise;
    }
    CBHCompoundBatch.validate = function(projectKey, data) {
      return $http.post( myUrl + "validate/", {"ctab":data, "projectKey": projectKey});
    };



    CBHCompoundBatch.saveSingleCompound = function(projectKey, molfile, customFields, stereoSelected) {
        var arr = window.location.href.split("/");
        var myUrl = arr[0] + "//" + arr[2] + urlBase;
        /*var obj = {};
        var fields = customFields.map(function(d){
            if (d.name && d.value){
                obj[d.name] = d.value;
            }
        })*/
        return $http.post( myUrl , {"projectKey": projectKey ,ctab:molfile, "customFields":prepCustomFields(customFields) });
    };

    CBHCompoundBatch.saveMultiBatchMolecules = function(projectKey, currentBatch, customFields) {

        return $http.post( myUrl + "multi_batch_save/", {"projectKey": projectKey, "currentBatch":currentBatch, "customFields": customFields,});
    };

    CBHCompoundBatch.validateBatch = function(projectKey,molfiles) {

        return $http.post( myUrl + "bulk/validate", {"projectKey": projectKey, ctab:molfile });
    };

    CBHCompoundBatch.uploadBatch = function(projectKey, molfiles) {

        return $http.post( myUrl + "bulk/upload", {"projectKey": projectKey,ctab:molfile });
    };

    CBHCompoundBatch.fetchHeaders = function(projectKey, file_name) {

        return $http.post( myUrlForFiles + "headers/", {"projectKey" :projectKey, file_name:file_name });
    };

    CBHCompoundBatch.fetchExistingFields = function(projectKey) {
        return $http.post ( myUrl + "existing/", {"projectKey" :projectKey});
    };
    CBHCompoundBatch.query = function(projectKey,filters) {
        filters.projectKey = projectKey;
        filters.project__project_key = projectKey;
         var promise = $http( 
            {
                url: myUrl,
                method: 'GET',
                params: filters
            }
            ).then(
            function(data){
                return data.data;
            }
        );
        return promise;
    };
    CBHCompoundBatch.paginate = function(page_url) {
        /*filters.projectKey = projectKey;
        filters.project__project_key = projectKey;*/
         var promise = $http( 
            {
                url: page_url,
                method: 'GET',
                //params: filters
            }
            ).then(
            function(data){
                return data.data;
            }
        );
        return promise;
    };
    /*CBHCompoundBatch.downloadURL = function(filters) {
        return myUrl + 
    };*/

    CBHCompoundBatch.saveBatchCustomFields = function(projectKey,currentBatch, customFields, mapping ) {

        return $http.post( myUrl + "multi_batch_custom_fields/", {"projectKey": projectKey, "currentBatch":currentBatch, "customFields": prepCustomFields(customFields), "mapping":mapping });
    }

    CBHCompoundBatch.validateFiles = function(projectKey,file_name, struc_col) {
        var promise = $http.post( myUrl + "validate_files/" , {"projectKey": projectKey, "file_name":file_name, "struc_col":struc_col}).then(
            function(data){
                return data.data;
            }
        );
        return promise;
    };
    CBHCompoundBatch.export = function(fileType, currentBatch) {
        return $http.get( myUrl, { "fileType":fileType, "currentBatch": currentBatch } );
    }

    return CBHCompoundBatch;

  }]);
