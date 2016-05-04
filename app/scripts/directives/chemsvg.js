'use strict';

/**
 * @ngdoc directive
 * @name chembiohubAssayApp.directive:chemsvg
 * @restrict 'E'
 * 
 * @description
 * # chemsvg
 * Creates a data point
 * 
 */
angular.module('chembiohubAssayApp')
  .directive('chemsvg', function ($compile) {
    return {
      //template: '<img ng-if="encSmiles" ng-show="encSmiles" ng-src="{{finalUrl}}/{{encSmiles}}/{{size}}"></img>',
      templateUrl: 'views/templates/chemsvg.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        //element.html('this is the chemsvg directive');
        scope.checkLocal();

        scope.getSmiles();
        scope.$watch('smiles', function(){
               scope.getSmiles();
          });
      },
      controller: ['$scope','$http', function($scope) {
            $scope.getSmiles = function() {
                $scope.src="";
                // $scope.encSmiles = btoa($scope.smiles.replace("Molecule from ChemDoodle Web Components", ""));
                // //console.log($scope.encSmiles);
                var params = {
                  size: $scope.size,
                  ctab: $scope.smiles,
                }

                params.smarts = $scope.properties.substructureMatch;
                
                $http.post($scope.finalUrl, params).then(function(data){
                  $scope.src=data.data;
                });

            };
            $scope.checkLocal = function() {
                // if (window.location.hostname == "localhost"){
                //   $scope.finalUrl = "http://localhost:2201/utils/smiles2svg";
                // }else{
                  $scope.finalUrl = $scope.baseUrl;
                  if($scope.properties) {
                    $scope.cdxml = $scope.properties.cdxml;
                  }
                  else {
                    $scope.cdxml = "";
                  }
                //}
            };

        }],
      scope: {
        size:'=',
        smiles: '=',
        dataType: '=',
        baseUrl: '=',
        properties: '=',
     }
    };
  });
