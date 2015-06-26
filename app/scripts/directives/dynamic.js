'use strict';

/**
 * @ngdoc directive
 * @name ngChemApp.directive:dynamic
 * @description
 * # dynamic
 */
angular.module('ngChemApp')
app.directive('dynamic', function ($compile) {
  return {
    restrict: 'A',
    replace: true,
    link: function (scope, ele, attrs) {
      scope.$watch(attrs.dynamic, function(html) {
        ele.html(html);
        $compile(ele.contents())(scope);
      });
    },
    
  };
});
