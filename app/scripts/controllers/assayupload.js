'use strict';

/**
 * @ngdoc function
 * @name ngChemApp.controller:AssayUploadCtrl
 * @description
 * # AssayUploadCtrl
 * Controller of the chembiohubAssayApp
 */
angular.module('chembiohubAssayApp')
  .controller('AssayUploadCtrl', ['$scope', 'prefix', 'urlConfig', '$cookies', 'FlowFileFactory', function ($scope, prefix, urlConfig, $cookies, FlowFileFactory) {
		$scope.inputData = {inputstring : ""};
        $scope.filedata = {};
        $scope.filesUploading = false;
        $scope.dataReady = false;
		$scope.csrftoken = $cookies[prefix.split("/")[0] + "csrftoken"];
		$scope.flowinit = {
			//need to change target to the new WS path provided by Andy
		    target: urlConfig.instance_path.url_frag + 'flow/upload/',
		    headers: {
		        'X-CSRFToken': $scope.csrftoken
		    }
		};

		//object containing user config, selected options and flowfile metadata returned from ws callls

		$scope.uploadData = {
			'sheetNames': [],
			'sheetName': '',

		}

		$scope.getSheetsForFile = function(fileId) {
			//perform get request to get list of sheets
			//probably best to create a resource here - we will need it for other types of upload (img etc)
			//FlowFileFactory.cbhFlowfile.
			var FlowDF = FlowFileFactory.cbhFlowfile;

	  		var fdfresult = FlowDF.get({'fileId': fileId});
	  		fdfresult.$promise.then(function(result){
	  			console.log(result.objects);
	  			//put the sheet names into $scope.uploadData.sheetNames

	  		});

	  		//also need to get the possible levels and datapoint classifications to select from

		}

		$scope.getPreviewData = function() {

		}



  }]);
