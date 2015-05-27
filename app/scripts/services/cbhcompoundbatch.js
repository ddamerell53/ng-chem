'use strict';

/**
 * @ngdoc service
 * @name ngChemApp.CBHCompoundBatch
 * @description
 * # CBHCompoundBatch
 * Factory in the ngChemApp.
 */
angular.module('ngChemApp')
  .factory('CBHCompoundBatch', ['$http', '$q','urlConfig'  ,function ($http, $q  ,urlConfig, cbh_compound_batches) {

    // Service logic
    // ...

    var CBHCompoundBatch = {};


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
        var promise = $http.post( urlConfig.cbh_compound_batches.list_endpoint  + "/validate_list/" , values).then(
            function(data){
                return data.data;
            }
        );
        return promise;
    }
    CBHCompoundBatch.validate = function(projectKey, data) {
      return $http.post( urlConfig.cbh_compound_batches.list_endpoint + "/validate/", {"ctab":data, "projectKey": projectKey});

    };



    CBHCompoundBatch.saveSingleCompound = function(projectKey, molfile, customFields, stereoSelected) {
        //Add a property to the molfile to say that this molecule has been hand drawn
        molfile += '\n>  <_drawingBondsWedged>\nTrue\n\n$$$$';
        return $http.post( urlConfig.cbh_compound_batches.list_endpoint +"/" , {"projectKey": projectKey ,ctab:molfile, "customFields":customFields , "stereoSelected" : "As Drawn"});

    };

    CBHCompoundBatch.saveMultiBatchMolecules = function(projectKey, currentBatch, customFields) {

        return $http.post( urlConfig.cbh_compound_batches.list_endpoint + "/multi_batch_save/", {"projectKey": projectKey, "currentBatch":currentBatch, "customFields": customFields,});
    };

    CBHCompoundBatch.validateBatch = function(projectKey,molfiles) {

        return $http.post( urlConfig.cbh_compound_batches.list_endpoint + "/bulk/validate", {"projectKey": projectKey, ctab:molfile });
    };

    CBHCompoundBatch.uploadBatch = function(projectKey, molfiles) {

        return $http.post( urlConfig.cbh_compound_batches.list_endpoint + "/bulk/upload", {"projectKey": projectKey,ctab:molfile });
    };

    CBHCompoundBatch.fetchHeaders = function(projectKey, file_name) {

        return $http.post( urlConfig.cbh_batch_upload.list_endpoint + "/headers/", {"projectKey" :projectKey, file_name:file_name });
    };

    CBHCompoundBatch.fetchExistingFields = function(projectKey) {
        return $http.post ( urlConfig.cbh_compound_batches.list_endpoint + "/existing/", {"projectKey" :projectKey});
    };
    CBHCompoundBatch.query = function(filters) {
         var promise = $http( 
            {
                url: urlConfig.cbh_compound_batches.list_endpoint,
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

    CBHCompoundBatch.patch = function(data, projectKey){
        var promise = $http.patch(  urlConfig.cbh_compound_batches.list_endpoint + '/' + data.id + '/' ,       
                data
            ).then(
            function(data){
                return data.data;
            }
        );
        return promise;
    }

    CBHCompoundBatch.search = function(searchForm) {
        var promise = $http({
            url:urlConfig.cbh_compound_batches.list_endpoint,
            method:'GET',
            params: searchForm,
            /*headers: {
               'Content-Type': 'application/json'
             }*/
        }).then(function(data){
            return data.data;
        });
        return promise;
    }

    CBHCompoundBatch.multiBatchForUser = function(username) {
        var promise = $http({
            url:urlConfig.cbh_multiple_batches.list_endpoint,
            method:'GET',
            params: {
                'created_by': username,
                'limit': 1000,
            },
        }).then(function(data){
            return data.data;
        });
        return promise;
    }

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
        return urlConfig.cbh_compound_batches.list_endpoint + 
    };*/

    CBHCompoundBatch.saveBatchCustomFields = function(projectKey,currentBatch, customFields, mapping ) {

        return $http.post( urlConfig.cbh_compound_batches.list_endpoint + "/multi_batch_custom_fields/", {"projectKey": projectKey, "currentBatch":currentBatch, "customFields": customFields, "mapping":mapping });
    }

    CBHCompoundBatch.validateFiles = function(projectKey,file_name, struc_col) {
        var promise = $http.post( urlConfig.cbh_compound_batches.list_endpoint + "/validate_files/" , {"projectKey": projectKey, "file_name":file_name, "struc_col":struc_col}).then(
            function(data){
                return data.data;
            }
        );
        return promise;
    };

//     CBHCompoundBatch.export = function(format, filters) {
//         var defer = $q.defer();
//         $http.get( urlConfig.cbh_compound_batches.list_endpoint, { params: filters } )
//           .then(function(result) {
//             // this callback will be called asynchronously
//             // when the response is available
//             /*var blob = new Blob([data], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
//             var objectUrl = URL.createObjectURL(blob);
//             window.location = objectUrl;*/
//             defer.resolve(result);
//           },
//           function() {
//             // called asynchronously if an error occurs
//             // or server returns response with an error status.
//             defer.reject();
//           });
//           return defer.promise;

//     }

//     CBHCompoundBatch.export = function(searchForm) {
//         var promise = $http({
//             url:myUrl,
//             method:'GET',
//             params: searchForm,
//             responseType: 'arraybuffer',
//             /*headers: {
//                'Content-Type': 'application/json'
//              }*/
//         }).then(function(data){
//             var blob = new Blob([data.data], {type: data.headers("Content-Type")});
//             return blob;
//         });
//         return promise;
// =======
//     CBHCompoundBatch.export = function(fileType, currentBatch) {
//         return $http.get( urlConfig.cbh_compound_batches.list_endpoint, { "fileType":fileType, "currentBatch": currentBatch } );
// >>>>>>> 4b81ee6b3e4fad06d378def1b1c42363caa9882c
//     }

    return CBHCompoundBatch;

  }]);
