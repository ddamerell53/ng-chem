'use strict';

/**
 * @ngdoc function
 * @name ngChemApp.controller:AssayUploadCtrl
 * @description
 * # AssayUploadCtrl
 * Controller of the chembiohubAssayApp
 */
angular.module('chembiohubAssayApp')
  .controller('AssayUploadCtrl', ['$scope', 'prefix', 'urlConfig', '$cookies', function ($scope, prefix, urlConfig, $cookies) {
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

  }]);
