'use strict';

/**
 * @ngdoc directive
 * @name ngChemApp.directive:projectList
 * @description
 * # projectList
 */
angular.module('ngChemApp')
  .directive('projectList', [ "ProjectFactory", function (ProjectFactory) {
    return {
      templateUrl: 'views/templates/project-list.html',
      restrict: 'E',
      /*link: function postLink(scope, element, attrs) {
        element.text('this is the projectList directive');
      },*/
      controller: ['$scope', function($scope) {

      	$scope.projects = []
      	ProjectFactory.get().$promise.then(function(res) {
      		$scope.projects = res.objects;
      	});
      	
      }]
    };
  } ]);
