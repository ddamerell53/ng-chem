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
            if (scope.localMolfile !== "Molecule from ChemDoodle Web Components\n\nhttp://www.ichemlabs.com\n  1  0  0  0  0  0            999 V2000\n    0.0000    0.0000    0.0000 C   0  0  0  0  0  0\nM  END"){
              //Check if the molecule is the standard methane and ignore
              scope.molecule.molfile = scope.localMolfile;
              scope.molecule.molfileChanged();
            }
            
          },
          'keyup' : function() {
            scope.localMolfile = ChemDoodle.writeMOL(element.getMolecule());
            //Check if the molecule is the standard methane and ignore
            if (scope.localMolfile !== "Molecule from ChemDoodle Web Components\n\nhttp://www.ichemlabs.com\n  1  0  0  0  0  0            999 V2000\n    0.0000    0.0000    0.0000 C   0  0  0  0  0  0\nM  END"){
              scope.molecule.molfile = scope.localMolfile;
              scope.molecule.molfileChanged();
            }
          }
        });        

        var cd_width = jQuery('#chemdoodle-holder').width();
        element = new ChemDoodle.SketcherCanvas('chemdoodle', cd_width, 300, {isMobile: true,oneMolecule:true});
        
        //if we have a retained molecule, load that into the canvas
        //otherwise let the Canvas initialise with its default methane molecule
        if(scope.localMolfile != '') {
          element.loadMolecule(ChemDoodle.readMOL(scope.localMolfile));
        }
        if (scope.molecule.molfile != '' && scope.molecule.molfile !== undefined){
          element.loadMolecule(ChemDoodle.readMOL(scope.molecule.molfile ));
        }
        //call repaint to display either the retained or default molecule
        element.repaint();
        
      },
      controller: ['$scope', '$rootScope', function($scope, $rootScope) {
        //initialise the root scope variable, from empty if not present
      	if ($scope.localMolfile == undefined) {
          $scope.localMolfile = "";
        }

        //set the local variable to match the root scope
        // $scope.localMolfile = $rootScope.sketchMolfile;

      }]
    };
  }]);