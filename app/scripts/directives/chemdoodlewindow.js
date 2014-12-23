'use strict';

/**
 * @ngdoc directive
 * @name ngChemApp.directive:chemdoodleWindow
 * @description An angular directive to house ChemDoodle chemical sketcher and retain information from a rootScope variable.
 * # chemdoodleWindow
 */
angular.module('ngChemApp')
  .directive('chemdoodleWindow', [ '$rootScope', function ($rootScope) {
    return {
      template: '<div class="col-xs-12" id="chemdoodle-holder"><canvas id="chemdoodle" tabindex="1"></canvas></div>',
      restrict: 'E',
      scope:{'sketchMolfile':'=sketchMolfile', 'fetchData' : '&', 'molecule' : '=' },
      link: function postLink(scope, element, attrs) {
      	
        //jquery watching for a click event to trigger the change in scope value.
        //also bind a button press for the canvas - keyup
        element.bind({
          'click': function() {
            scope.localMolfile = ChemDoodle.writeMOL(element.getMolecule());
            scope.molecule.molfile = scope.localMolfile;
            scope.molecule.molfileChanged();
          },
          'keyup' : function() {
            scope.localMolfile = ChemDoodle.writeMOL(element.getMolecule());
            scope.molecule.molfile = scope.localMolfile;
            scope.molecule.molfileChanged();
          }
        });        

        var cd_width = jQuery('#chemdoodle-holder').width();
        element = new ChemDoodle.SketcherCanvas('chemdoodle', cd_width, 300, {oneMolecule:false});
        
        //if we have a retained molecule, load that into the canvas
        //otherwise let the Canvas initialise with its default methane molecule
        if(scope.localMolfile != '') {
          element.loadMolecule(ChemDoodle.readMOL(scope.localMolfile));
        }
        //call repaint to display either the retained or default molecule
        element.repaint();
        
      },
      controller: ['$scope', '$rootScope', function($scope, $rootScope) {
        //initialise the root scope variable, from empty if not present
      	if ($rootScope.sketchMolfile == undefined) {
          $rootScope.sketchMolfile = "";
        }

        //set the local variable to match the root scope
        $scope.localMolfile = $rootScope.sketchMolfile;

      }]
    };
  }]);