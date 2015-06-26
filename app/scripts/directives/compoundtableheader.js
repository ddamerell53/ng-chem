'use strict';

/**
 * @ngdoc directive
 * @name ngChemApp.directive:compoundTableHeader
 * @description
 * # compoundTableHeader
 */
angular.module('ngChemApp')
  .directive('compoundtableheader', function () {
    return {
      templateUrl: 'views/templates/compound-table-header.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
      },
      scope: {
        "compounds" : "="
      }
    };
  });
