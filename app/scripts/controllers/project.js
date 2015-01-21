'use strict';

/**
 * @ngdoc function
 * @name ngChemApp.controller:ProjectCtrl
 * @description
 * # ProjectCtrl
 * Controller of the ngChemApp
 */
angular.module('ngChemApp')
  .controller('ProjectCtrl', [ '$scope', '$state', 'ProjectFactory', 'MessageFactory', function ($scope, $state, ProjectFactory, MessageFactory) {
    //stuff
    $scope.currentProjectKey = "";

    $scope.getMessage = function(lookup_str){
        return MessageFactory.getMessage(lookup_str);

    }
    
  ]);
