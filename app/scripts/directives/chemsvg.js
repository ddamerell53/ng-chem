'use strict';

/**
 * @ngdoc directive
 * @name chembiohubAssayApp.directive:chemsvg
 * @restrict 'E'
 * 
 * @description
 * # chemsvg
 * Renders a chemical structure provided in SMILES format as a 2D SVG format image.
 * @param {string} size Dimensions of the generated image in pixels.
 * @param {string} smiles String representation of chemicasl structure in SMILES format
 * @param {string} dataType Not used
 * @param {string} baseUrl If the smiles input is from ChemDraw, store that in the scope
 * @param {object} properties  Contains extra configuration parameters from the app or work out correct SMILES from a supplied SMARTS format structure.
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
