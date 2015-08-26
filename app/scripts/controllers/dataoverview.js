'use strict';

/**
 * @ngdoc function
 * @name ngChemApp.controller:DataoverviewCtrl
 * @description
 * # DataoverviewCtrl
 * Controller of the ngChemApp
 */
angular.module('chembiohubAssayApp')
  .controller('DataOverviewCtrl', ['$scope', 'AddDataFactory', '$modal', function ($scope, AddDataFactory, $modal) {
	var dataoverviewctrl = this;

	$scope.modalInstance = {};
    $scope.popup_data = {}; 

    dataoverviewctrl.openDetail = function() {
      
      $scope.modalInstance = $modal.open({
        templateUrl: 'views/modal-template.html',
        size: 'md',
        resolve: {
          popup_data: function () {
            return $scope.popup_data;
          },

        }, 
        controller: function($scope, $modalInstance, popup_data, $timeout) {
          $scope.popup_data = popup_data;
          
          $scope.modalInstance = $modalInstance;

		  $scope.cancel = function () {
		    $modalInstance.dismiss('cancel');
		  };

        }
      });
    };




  }]);
