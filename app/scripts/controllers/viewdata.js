'use strict';

/**
 * @ngdoc function
 * @name chembiohubAssayApp.controller:ViewDataCtrl
 * @description
 * # ViewdataCtrl
 * Controller of the chembiohubAssayApp
 */
angular.module('chembiohubAssayApp')
  .controller('ViewDataCtrl', ['$scope', 'ViewDataFactory', '$resource', '$stateParams','$timeout', function ($scope, ViewDataFactory, $resource, $stateParams, $timeout) {
    //we need:
  	var viewctrl = this;
  	//method to generate the form for a given level of a given datapoint classification


    viewctrl.dc = $stateParams.dc;

    $resource("")


  }]);
