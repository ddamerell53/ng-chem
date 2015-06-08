'use strict';

/**
 * @ngdoc function
 * @name ngChemApp.controller:AddcompoundsCtrl
 * @description
 * # AddcompoundsCtrl
 * Controller of the ngChemApp
 */
angular.module('ngChemApp')
  .controller('AddCompoundsCtrl',['$scope', 
    '$state', 
    '$stateParams', 
    '$cookies', 
    '$timeout', 

    'projectKey', 
    'prefix', 
    'urlConfig', 
    'CBHCompoundBatch', 
    function ($scope, $state, $stateParams,$cookies, $timeout, projectKey, prefix, urlConfig, CBHCompoundBatch) {
        $scope.csrftoken = $cookies[prefix.split("/")[0] + "csrftoken"];
       $scope.flowinit = {
                target: urlConfig.instance_path.url_frag + 'flow/upload/',
                headers: {
                    'X-CSRFToken': $scope.csrftoken
                }
            };
        //build an object to hold all of the changed information each time the user does something
        $scope.datasets = {};
        $scope.filedata = {};
        $scope.filesUploading = false;

        $scope.assignFile = function(id, ext, file) {

            $scope.current_dataset_id = id;
            $scope.datasets[$scope.current_dataset_id] = {
                "config": {
                    "file_name": id,
                    "multipleBatch": null,
                    "type": "file",
                    "file_extension" : ext,
                    "filesInProcessing" : true,
                    "projectKey" : projectKey,
                    "struc_col" : ""
                }
                
            }
            $timeout($scope.createMultiBatch,100);
        };
        
        $scope.createMultiBatch = function(){
            CBHCompoundBatch.createMultiBatch(
                $scope.datasets[$scope.current_dataset_id]).then(
                    function(data){
                        console.log(data);
                        //returns a multiple batch id and a status
                        //Run a second get request to get a list of compounds
                    },
                    function(error){

             }); 
        }



  }]);
