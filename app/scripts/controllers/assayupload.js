'use strict';

/**
 * @ngdoc function
 * @name ngChemApp.controller:AssayUploadCtrl
 * @description
 * # AssayUploadCtrl
 * Controller of the chembiohubAssayApp
 */
angular.module('chembiohubAssayApp')
  .controller('AssayUploadCtrl', ['$scope', 'prefix', 'urlConfig', function ($scope, prefix, urlConfig) {
		$scope.csrftoken = $cookies[prefix.split("/")[0] + "csrftoken"];
		$scope.flowinit = {
		    target: urlConfig.instance_path.url_frag + 'flow/upload/',
		    headers: {
		        'X-CSRFToken': $scope.csrftoken
		    }
		};
  }]);
