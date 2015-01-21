'use strict';

/**
 * @ngdoc function
 * @name ngChemApp.controller:ProjectCtrl
 * @description
 * # ProjectCtrl
 * Controller of the ngChemApp
 */
angular.module('ngChemApp')
  .controller('ProjectCtrl', [ '$scope', '$state', 'ProjectFactory', function ($scope, $state, ProjectFactory) {
    //stuff
    $scope.currentProjectKey = "";
    
  } ]);
