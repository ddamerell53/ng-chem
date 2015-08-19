'use strict';

/**
 * @ngdoc directive
 * @name chembiohubAssayApp.directive:projectList
 * @description
 * # projectList
 */
angular.module('chembiohubAssayApp')
  .directive('projectList',  function () {
    return {
      templateUrl: 'views/templates/project-list.html',
      restrict: 'E',
      /*link: function postLink(scope, element, attrs) {
        element.text('this is the projectList directive');
      },*/
      controller: ['$scope', function($scope) {

      	
      		$scope.projects = $scope.cbh.projects.objects;
      	
      	
      }]
    };
  } );
