'use strict';

/**
 * @ngdoc function
 * @name ngChemApp.controller:ProjectCtrl
 * @description
 * # ProjectCtrl
 * Controller of the ngChemApp
 */
angular.module('ngChemApp')
  .controller('ProjectCtrl', [ '$scope', '$state', 'ProjectFactory', 'MessageFactory', '$stateParams', function ($scope, $state, ProjectFactory, MessageFactory, $stateParams) {
    //stuff
    $scope.currentProjectKey = $stateParams.projectKey;

    $scope.getMessage = function(lookup_str){
        return MessageFactory.getMessage(lookup_str);

    }

    
    
  }]);
