'use strict';

/**
 * @ngdoc directive
 * @name chembiohubAssayApp.directive:compoundTableHeader
 * @description
 * # compoundTableHeader
 */
angular.module('chembiohubAssayApp')
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
