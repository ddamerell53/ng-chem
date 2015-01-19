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
                         stdInChiKey: ""
                     };
    }

    CBHCompoundBatch.validateList = function(values){
        var promise = $http.post( urlBase + "validate_list/" , values).then(
            function(data){
                return data.data;
            }
        );
        return promise;
    }
    CBHCompoundBatch.validate = function(molfile) {

      return $http.post( myUrl + "validate/", {ctab:molfile});
    };



    CBHCompoundBatch.saveSingleCompound = function(molfile, customFields) {
        var arr = window.location.href.split("/");
        var myUrl = arr[0] + "//" + arr[2] + urlBase;
        /*var obj = {};
        var fields = customFields.map(function(d){
            if (d.name && d.value){
                obj[d.name] = d.value;
            }
        })*/
        return $http.post( myUrl , {ctab:molfile, "customFields":prepCustomFields(customFields) });
    };

    CBHCompoundBatch.saveMultiBatchMolecules = function(currentBatch, customFields) {

        return $http.post( myUrl + "multi_batch_save/", {"currentBatch":currentBatch, "customFields": customFields});
    };

    CBHCompoundBatch.validateBatch = function(molfiles) {

        return $http.post( myUrl + "bulk/validate", {ctab:molfile });
    };

    CBHCompoundBatch.uploadBatch = function(molfiles) {

        return $http.post( myUrl + "bulk/upload", {ctab:molfile });
    };

    CBHCompoundBatch.fetchHeaders = function(file_name) {

        return $http.post( myUrlForFiles + "headers/", { file_name:file_name });
    };

    CBHCompoundBatch.fetchExistingFields = function() {
        return $http.post ( myUrl + "existing/");
    };
    CBHCompoundBatch.query = function(filters) {
        console.log(myUrl);
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
    CBHCompoundBatch.saveBatchCustomFields = function(currentBatch, customFields) {

        return $http.post( myUrl + "multi_batch_custom_fields/", {"currentBatch":currentBatch, "customFields": prepCustomFields(customFields)});
    };
    CBHCompoundBatch.validateFiles = function(file_name, struc_col, mapping) {
        console.log(file_name);
        console.log(struc_col);
        var promise = $http.post( myUrl + "validate_files/" , { "file_name":file_name, "struc_col":struc_col, "mapping":mapping }).then(
            function(data){
                return data.data;
            }
        );
        return promise;
    };
    CBHCompoundBatch.export = function(fileType, currentBatch) {
        return $http.post( myUrl + "export_file/", { "fileType":fileType, "currentBatch": currentBatch } );
    }

    return CBHCompoundBatch;

  }]);
