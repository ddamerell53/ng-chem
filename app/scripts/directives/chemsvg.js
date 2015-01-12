'use strict';

/**
 * @ngdoc directive
 * @name ngChemApp.directive:chemsvg
 Creates a data point
 * @description
 * # chemsvg
 */
angular.module('ngChemApp')
  .directive('chemsvg', function ($compile) {
    return {
      template: '<img ng-show="encSmiles" ng-src="{{finalUrl}}/{{encSmiles}}/{{size}}"></img>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        //element.html('this is the chemsvg directive');
        scope.getSmiles();
        scope.checkLocal();
        scope.$watch('smiles', function(){
               scope.getSmiles();
          });
      },
      controller: ['$scope', function($scope) {
            $scope.getSmiles = function() {
                $scope.encSmiles = btoa($scope.smiles);

            };
            $scope.checkLocal = function() {
                if (window.location.hostname == "localhost"){
                  $scope.finalUrl = "http://localhost:2201/utils/smiles2svg";
                }else{
                  $scope.finalUrl = $scope.baseUrl;
                }
            };

        }],
      scope: {
        size:'=',
        smiles: '=',
        dataType: '=',
        baseUrl: '=',

      }
    };
  });
