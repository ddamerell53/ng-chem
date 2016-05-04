'use strict';

/**
 * @ngdoc directive
 * @name chembiohubAssayApp.directive:dynamic
 * @restrict 'A'
 * @description
 * # dynamic
 * not used
 * @deprecated
 */
angular.module('chembiohubAssayApp')
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
