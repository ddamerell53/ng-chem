'use strict';

/**
 * @ngdoc service
 * @name chembiohubAssayApp.CBHCompoundBatch
 * @description
 * # CBHCompoundBatch
 * Service to provide interface to web API for adding and saving new data records into the system as well as validation of input, editing existing records, performing archiving. This service also provides the interface to the search APIs.
 */
angular.module('chembiohubAssayApp')
  .factory('CBHCompoundBatch', ['$compile', '$http', '$q','$timeout','$cookies','urlConfig'  ,function ($compile, $http, $q ,$timeout, $cookies ,urlConfig, cbh_compound_batches) {

    var CBHCompoundBatch = {};
    
    /**
     * @ngdoc method
     * @name getSingleMol
     * @methodOf chembiohubAssayApp.CBHCompoundBatch
     * @description
     * Set up defaults for a blank molecule object
     * @returns {Object} molecule object containing default values
     *
     */
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
    };

    /**
     * @ngdoc method
     * @name delete_index
     * @methodOf chembiohubAssayApp.CBHCompoundBatch
     * @description
     * Removes a specified index via an API call.
     * @params {string} The name of the index to remove
     * @returns {Object} promise from API call to delete the specified index containing data object
     *
     */
    CBHCompoundBatch.delete_index = function(config){
        config.objects =[];
       var promise = $http.post( urlConfig.cbh_compound_batches.list_endpoint  + "/delete_index/" , config).then(
            function(data){
                return data.data;
            }
        );
        return promise;
    }

    /**
     * @ngdoc method
     * @name reindexModifiedCompound
     * @methodOf chembiohubAssayApp.CBHCompoundBatch
     * @description
     * Calls the  cbh_compound_batches webservice to trigger a reindexing of a given batch.
     * @params {string} The id of the batch to reindex
     * @returns {Object} promise from API call to reindex the specified batch
     *
     */
    CBHCompoundBatch.reindexModifiedCompound = function(id) {
      var params = {"id": id}
      return $http.post( urlConfig.cbh_compound_batches.list_endpoint  + "/reindex_compound/" , params)
    }

    /**
     * @ngdoc method
     * @name markAsArchived
     * @methodOf chembiohubAssayApp.CBHCompoundBatch
     * @description
     * Calls the cbh_compound_batches webservice to archive a given batch.
     * @params {string} The id of the batch to archive
     * @returns {Object} promise from API call to archive the specified batch
     *
     */
    CBHCompoundBatch.markAsArchived = function(batch_id){
        return $http.post( urlConfig.cbh_compound_batches.list_endpoint  + "/archive/" , {id: batch_id})
    }

    /**
     * @ngdoc method
     * @name getAddCompoundsResults
     * @methodOf chembiohubAssayApp.CBHCompoundBatch
     * @description
     * Calls the cbh_compound_batches webservice to retrieve the set of batches for preview before confirming saving.
     * @params {int} mb_id - The id of the multiple batch to fetch results for
     * @params {string} limit - The number of batches to return
     * @params {string} offset - The amount to offest for paging
     * @params {string} filter - Any filtering (search) parameters which have been applied via the search interface
     * @params {string} sorts - Any sorting (search) parameters which have been applied via the search interface
     * @returns {Object} promise from API call to retrieve the specified batch set
     *
     */
    CBHCompoundBatch.getAddCompoundsResults = function(mb_id, limit, offset, filter, sorts){
        var params = {
                                "limit" : limit,
                                "offset" : offset,
                                "current_batch" : mb_id, 
                                "sorts" : sorts}
        if((filter.bool.must.length + filter.bool.must_not.length + filter.bool.should.length ) > 0){
          params.query = JSON.stringify(filter);
        }else{
          console.log(filter.bool);
        }
        var promise = $http.get(urlConfig.cbh_compound_batches.list_endpoint + "/get_part_processed_multiple_batch/"
                            ,{ params:params }  //JSON sorts string
                            );
        return  promise;  
    }
    
    /**
     * @ngdoc method
     * @name validateList
     * @methodOf chembiohubAssayApp.CBHCompoundBatch
     * @description
     * Calls the cbh_compound_batches webservice to validate a set of batches.
     * @params {string} projectKey - specifies the project which the batches will belong to
     * @params {Object} values - The set of batches to archive
     * @returns {Object} promise from API call to validate the specified batch list
     *
     */   
    CBHCompoundBatch.validateList = function(projectKey, values){
        values.projectKey = projectKey;
        var promise = $http.post( urlConfig.cbh_compound_batches.list_endpoint  + "/validate_list/" , values).then(
            function(data){
                return data.data;
            }
        );
        return promise;
    }

    /**
     * @ngdoc method
     * @name validate
     * @methodOf chembiohubAssayApp.CBHCompoundBatch
     * @description
     * Calls the cbh_compound_batches webservice to validate a drawn chemical element in ctab format.
     * @params {string} projectKey - specifies the project which the batches will belong to
     * @params {Object} values - The moleculaar daata in ctab (mol) format
     * @returns {Object} promise from API call to validate the given molecule
     *
     */
    CBHCompoundBatch.validate = function(projectKey, data) {
      return $http.post( urlConfig.cbh_compound_batches.list_endpoint + "/validate/", {"ctab":data, "projectKey": projectKey});

    };

    /**
     * @ngdoc method
     * @name createMultiBatch
     * @methodOf chembiohubAssayApp.CBHCompoundBatch
     * @description
     * Calls the cbh_compound_batches webservice to validate lists of data that are of varying types. Allowed types are file, smilesdata and sketch. Function diverts to the appropriate webservice call. 
     * @params {Object} currentDataset - The data to be validated
     * @returns {Object} promise from API call to validate the given dataset
     *
     */
    CBHCompoundBatch.createMultiBatch = function(currentDataset) {
        var canceller = $q.defer();
        var cancel = function(reason){
            canceller.resolve(reason);
        };
        currentDataset.cancellers.push(cancel);
        var promise;
        console.log("gothere");
        if(currentDataset.config.type == "file"){
          promise = $http.post(urlConfig.cbh_compound_batches.list_endpoint + "/validate_files/"
                            ,currentDataset.config  ,
                            {
                              
                              timeout: canceller.promise,
                                         
                            });
        }
        if(currentDataset.config.type == "smilesdata"){
          promise = $http.post(urlConfig.cbh_compound_batches.list_endpoint + "/validate_list/"
                            ,currentDataset.config  ,
                            {
                              
                              timeout: canceller.promise,
                                         
                            });
        }
        if(currentDataset.config.type == "sketch"){
          promise = $http.post(urlConfig.cbh_compound_batches.list_endpoint + "/validate_drawn/"
                            ,currentDataset.config  ,
                            {
                              
                              timeout: canceller.promise,
                                         
                            });
        }
        
        return  promise;
                  
  
    }

    /**
     * @ngdoc method
     * @name saveSingleCompound
     * @methodOf chembiohubAssayApp.CBHCompoundBatch
     * @description
     * Calls the cbh_compound_batches webservice to save one chemical batch object.
     * @params {Object} post_data - The chemical data to be saved
     * @returns {Object} promise from API call to save the given dataset
     *
     */
    CBHCompoundBatch.saveSingleCompound = function(post_data) {
        //Add a property to the molfile to say that this molecule has been hand drawn
          //Set the batch as blinded by using a placeholder id - see save method of CBHCompoundBatch on other end
        post_data.blinded_batch_id = "EMPTY_ID";
        return $http.post( urlConfig.cbh_compound_batches_v2.list_endpoint +"/" ,post_data);

    };

    /**
     * @ngdoc method
     * @name saveMultiBatchMolecules
     * @methodOf chembiohubAssayApp.CBHCompoundBatch
     * @description
     * Calls the cbh_compound_batches webservice to save more than one chemical batch object.
     * @params {Object} config - The chemical data items to be saved
     * @returns {Object} promise from API call to save the given batches
     *
     */
    CBHCompoundBatch.saveMultiBatchMolecules = function(config) {
        
        return $http.post( urlConfig.cbh_compound_batches.list_endpoint + "/multi_batch_save/", config);
    };

    /**
     * @ngdoc method
     * @name validateBatch
     * @methodOf chembiohubAssayApp.CBHCompoundBatch
     * @deprecated
     */
    CBHCompoundBatch.validateBatch = function(projectKey,molfiles) {

        return $http.post( urlConfig.cbh_compound_batches.list_endpoint + "/bulk/validate", {"projectKey": projectKey, ctab:molfile });
    };

    /**
     * @ngdoc method
     * @name uploadBatch
     * @methodOf chembiohubAssayApp.CBHCompoundBatch
     * @deprecated
     */
    CBHCompoundBatch.uploadBatch = function(projectKey, molfiles) {

        return $http.post( urlConfig.cbh_compound_batches.list_endpoint + "/bulk/upload", {"projectKey": projectKey,ctab:molfile });
    };
    /**
     * @ngdoc method
     * @name fetchHeaders
     * @methodOf chembiohubAssayApp.CBHCompoundBatch
     * @deprecated
     */
    CBHCompoundBatch.fetchHeaders = function(projectKey, file_name) {

        return $http.post( urlConfig.cbh_batch_upload.list_endpoint + "/headers/", {"projectKey" :projectKey, file_name:file_name });
    };

    // CBHCompoundBatch.query = function(filters) {
        
    //      var promise = $http( 
    //         {
    //             url: urlConfig.cbh_compound_batches.list_endpoint + "/get_list_elasticsearch/",
    //             method: 'GET',
    //             params: filters
    //         }
    //         ).then(
    //         function(data){
    //             return data.data;
    //         }
    //     );
    //     return promise;
    // };

  /**
   * @ngdoc method
   * @name queryv2
   * @methodOf chembiohubAssayApp.CBHCompoundBatch
   * @description
   * Calls the cbh_compound_batches webservice endpoint to get a list of batch items. This is modified by currently applied filters and sorts in the search interface.
   * @params {Object} filters - elasticsearch format query object containing currently applied filters, sorts and paging parammeters.
   * @returns {Object} promise from API call to retrieve batches matching the search filters
   *
   */
  CBHCompoundBatch.queryv2 = function(filters) {
        
         var promise = $http( 
            {
                url: urlConfig.cbh_compound_batches_v2.list_endpoint ,
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

    /**
   * @ngdoc method
   * @name get
   * @methodOf chembiohubAssayApp.CBHCompoundBatch
   * @description
   * Calls the cbh_compound_batches webservice endpoint to get a batch item. It is a convenience function for the default GET request.
   * @params {int} id - id of batch to retrieve.
   * @returns {Object} promise from API call to retrieve the specified batch.
   *
   */
    CBHCompoundBatch.get = function(id) {
      
         var promise = $http( 
            {
                url: urlConfig.cbh_compound_batches_v2.list_endpoint + "/" + id,
                method: 'GET',
            }
            ).then(
            function(data){
                return data.data;
            }
        );
        return promise;
    };


    var patch = function(data){
        var promise = $http.patch(  urlConfig.cbh_compound_batches_v2.list_endpoint + '/' + data.id + '/' ,       
                data
            ).then(
            function(data){
                return data.data;
            }
        );
        return promise;
    }

    CBHCompoundBatch.patch = patch;

    CBHCompoundBatch.patchList = function(data, projects){
        var defer = $q.defer();
        var promises = [];
        angular.forEach(data.objects, function(obj){
          var split = obj.project.split("/");
          var projid = split[split.length-1]; 
          angular.forEach(projects,function(myproj){
              if(myproj.id == projid){
                  obj.project_key = myproj.project_key;

              }
          });
          promises.push(patch(obj));
        });
        return $q.all(promises);
    }


    CBHCompoundBatch.getListByVersion = function(data, projects){
        var defer = $q.defer();
        var promises = [];
        angular.forEach(data, function(change){
             var split = obj.project.split("/");
          var projid = split[split.length-1]; 
          angular.forEach(projects,function(myproj){
              if(myproj.id == projid){
                  obj.project_key = myproj.project_key;

              }
          });
        });
    }

    CBHCompoundBatch.patchTempList = function(data){
        var promise = $http.post(  urlConfig.cbh_compound_batches.list_endpoint + '/update_temp_batches/' ,       
                data
            ).then(
            function(data){
                return data;
            }
        );
        return promise;
    }



    /**
     * @ngdoc method
     * @name search
     * @methodOf chembiohubAssayApp.CBHCompoundBatch
     * @deprecated
     */
    CBHCompoundBatch.search = function(searchForm, archived) {
        if(archived){
          searchForm.properties__archived = "true";

          
        }
        var promise = $http({
            url:urlConfig.cbh_compound_batches.list_endpoint,
            method:'GET',
            params: searchForm,
            
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

    /**
     * @ngdoc method
     * @name paginate
     * @methodOf chembiohubAssayApp.CBHCompoundBatch
     * @deprecated
     */
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

    CBHCompoundBatch.saveBatchCustomFields = function(config) {

        return $http.post( urlConfig.cbh_compound_batches.list_endpoint + "/multi_batch_custom_fields/", config );
    }

    /**
     * @ngdoc method
     * @name validateFiles
     * @methodOf chembiohubAssayApp.CBHCompoundBatch
     * @deprecated
     */
    CBHCompoundBatch.validateFiles = function(projectKey,file_name, struccol) {
        var promise = $http.post( urlConfig.cbh_compound_batches.list_endpoint + "/validate_files/" , {"projectKey": projectKey, "file_name":file_name, "struccol":struccol}).then(
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
