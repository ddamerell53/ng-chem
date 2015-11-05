'use strict';

/**
 * @ngdoc service
 * @name chembiohubAssayApp.CBHCompoundBatch
 * @description
 * # CBHCompoundBatch
 * Factory in the chembiohubAssayApp.
 */
angular.module('chembiohubAssayApp')
  .factory('CBHCompoundBatch', ['$compile', '$http', '$q','$timeout','$cookies','urlConfig'  ,function ($compile, $http, $q ,$timeout, $cookies ,urlConfig, cbh_compound_batches) {

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
    };

    CBHCompoundBatch.delete_index = function(config){
        config.objects =[];
       var promise = $http.post( urlConfig.cbh_compound_batches.list_endpoint  + "/delete_index/" , config).then(
            function(data){
                return data.data;
            }
        );
        return promise;
    }

    CBHCompoundBatch.reindexModifiedCompound = function(id) {
      var params = {"id": id}
      return $http.post( urlConfig.cbh_compound_batches.list_endpoint  + "/reindex_compound/" , params)
    }


    CBHCompoundBatch.markAsArchived = function(batch_id){
        return $http.post( urlConfig.cbh_compound_batches.list_endpoint  + "/archive/" , {id: batch_id})
    }





    CBHCompoundBatch.getSearchResults = function(mb_id, limit, offset, filter, sorts){
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
        
        return  promise;
                  
  
    }


    CBHCompoundBatch.saveSingleCompound = function(projectKey, molfile, customFields, stereoSelected) {
        //Add a property to the molfile to say that this molecule has been hand drawn
        if(molfile !=''){
          molfile += '\n>  <_drawingBondsWedged>\nTrue\n\n$$$$';
        }
        
        return $http.post( urlConfig.cbh_compound_batches.list_endpoint +"/" , {"projectKey": projectKey ,ctab:molfile, "customFields":customFields , "stereoSelected" : "As Drawn"});

    };

    CBHCompoundBatch.saveMultiBatchMolecules = function(config) {
        
        return $http.post( urlConfig.cbh_compound_batches.list_endpoint + "/multi_batch_save/", config);
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

    CBHCompoundBatch.query = function(filters) {
      
         var promise = $http( 
            {
                url: urlConfig.cbh_compound_batches.list_endpoint + "/get_list_elasticsearch/",
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


    CBHCompoundBatch.getImages = function(objects, imageSize, name, callback){
         var defer = $q.defer();
        var promises = [];


        angular.forEach(objects, function(obj){
            var siz = imageSize;
            if(name=="bigImageSrc"){
              if(obj.molecularWeight< 300){
                siz = 200;
              }
            }
            if(angular.isDefined(obj.ctab)){
              var params = {
                  size: siz,
                  ctab: obj.ctab,
                }
              }else{
                var params = {
                  size: siz,
                  ctab: "",
                }
              }
            
            if(angular.isDefined(obj.properties)){
              if(angular.isDefined(obj.properties.substructureMatch)){
                params.smarts = obj.properties.substructureMatch;
              }
            }
            
            promises.push($http({method:"POST", 
                url: "https://chembiohub.ox.ac.uk/utils/ctab2image",
                data: params, 
                headers: {'X-CSRFToken': undefined}}));

        });
        $q.all(promises).then(function(data){
          var index = 0;
          angular.forEach(data, function(d){
            if(d.data.toString()){
              objects[index].properties[name] = "data:image/png;base64," + d.data;
            }else{
              objects[index].properties[name] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEsAAABLCAYAAAA4TnrqAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wYBDScCJFPWhQAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAS3SURBVHja7Zrbb1RVFIe/PVPaTgUsTFt6myIBRHvhEgQkakgMBEiNICA3G1IJRHyQF/8OXzAGYmqChIgJJiRiEIsCocFUoJZOO05bWgotBAsNbSkzZdopy4dtGWunnaMihHT9kpOcs88+a6/5cvbaa68zRkQElSO5FIHCUlgKS2EpLIWlCBSWwlJYCkthKSxFoLAUlsJSWApLYSkChaWwFNYzpKQnOZj4G6CmFvJyoa4e+vqgwAdvrcVkz4j1i0bhbBU0BOB+CPLzYPVKTE72xIEFYIJNSHIy7NwBaWnQ0gpfHEI+2oOZOgURgYOHYVo6lG2D59KgtQ0OHkbe24Ip8E2caShTJsPmDRjvdIwnFVNSBAvnw6Ua26E+ACKwYR0mw4vxeDDFhbDpHTh2fILFrJxszKRJI9uys6Dzjj1vuwaFL2OMGdln9izo6kIikQkEKynOzHe5YGjIng8NgcvEmb/GHg8f6mr4SAU+aG4Z3d7eAVOnYjwehfVIixZA333ku5NITy8yMIA0XYEjR2Fd6cRaDROulm43srscKk/D/goIh2yqsWUjZtYLT9c3/cuRZvAKS2EpLIWlsP7V/q4+gBw5+mT3lE9hzMfzZkWjse3Jk9LTGNNpniW1dVB1Hu52Q3o6FBfCitdh337ovQeDg7Z8ArD7fei8DbV1kOEFfwDcLljxBnhS4bIfs2P7SPs1tdB0BbN9s72ORODHM9DYDA8ewMwCWLMSk5GBfLJv7DET2BZ/Q1y/zLJXkKEhqPoZ/PUQCoMvH9auwni9zjN4aWm1xbdN6yEr0xbgzp6DGzcxH++1IANBTNnW2DOdtzGBILJ8KezdA8YF/WG4eSvxFItG4UAFvDTP1rlSkiHYBN+eQMrLxh3T0RsRzy+Ar7+B5ElQthVSPdB6FSq+RHaVY7zTHW53uu7aUoov316npMDG9Yl/9LR0eLsU43bbhjQP4gAW1RchNwezemWsbfEiezyOeBfPr8Zm6OmFD3dhXH9Go5IiW3ys/Am2veswZs0vgt57yKf7keMnkMZmZGAgsVczsmIO/RNdb4d5L/5/wSaeX03NsLAkBmpYc2bDjZvOp6FJS4MPdiI9vdaovwGOHUc2rcPMnTPOcuEav1Y1ImD/pU0k/rMJlycHtsfyq7sHLtQgladH3xuOi45iVigESUmY9Odh2RJYtgQJNsG58zB3DrjddnVyoswMuNOFiIysfnbcGF3DKi4c2068MZ3YHku5OZCXi1n15n9MHc6cgwMVSHsHMjiI9PXBb412RRl2svO2vdfdPf4UzcoE73T4vhIJhZD+B0j1RcyFS7E+y5fC9XbkbBUS7rd26wPIoa+Q4cpovDGd2B5Lr70KtXVI9QUkHEYiEaTtGvLZ58jVNuepg0SjNm0INMKt3yE1BRaUwJpVmORk2+fkKfjlIky2HyDo7oFfL2PKy0a/qf39cPIUBIJ2isyeBfm5cKszljqE++GHUxBshkgEfHlQumbE56+/j2l8+Qlti79hbL9679lnr7TYtCQvD5YuhgUlo78BaD1L94YKS2EpLIWlUlgKS2EpLIWlsFQKS2EpLIWlsBSWSmEpLIWlsBSWwlIpLIWlsBTWM6Y/ABTkAj8U37PQAAAAAElFTkSuQmCC";
            }

            index ++;
          });
          if(angular.isDefined(callback)) {
                callback();                        
          }
          callback();
          return data

          
        });
        return defer.promise;
    }

    var patch = function(data, projectKey){
        var promise = $http.patch(  urlConfig.cbh_compound_batches.list_endpoint + '/' + data.id + '/' ,       
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
