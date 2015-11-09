'use strict';

/**
 * @ngdoc directive
 * @name chembiohubAssayApp.directive:chemdoodleWindow
 * @description An angular directive to house ChemDoodle chemical sketcher and retain information from a rootScope variable.
 * # chemdoodleWindow
 */
angular.module('chembiohubAssayApp')
  .directive('chemdoodleWindow', [ '$rootScope','$window','$timeout', function ($rootScope, $window, $timeout) {
    return {
      template: '<div class="col-xs-12" id="chemdoodle-holder"><canvas  id="chemdoodle" tabindex="1"></canvas></div>',
      restrict: 'E',
      scope:{'sketchMolfile':'=sketchMolfile', 'fetchData' : '&', 'molecule' : '=' },
      link: function postLink(scope, element, attrs) {
      	
        // jquery watching for a click event to trigger the change in scope value.
        // also bind a button press for the canvas - keyup
        var w = angular.element($window);
        scope.$watch(function () {
            return {
                'h': w.height(), 
                'w': w.width()
            };
        }, function (newValue, oldValue) {
            scope.windowHeight = newValue.h;
            scope.windowWidth = newValue.w;
        }, true);

        w.bind('resize', function () {
            redraw();
        });
        scope.mols = [];

        element.bind({
          'click': function() {              
                 
            //Check if the molecule is the standard methane and ignore
            if (scope.localMolfile !== "Molecule from ChemDoodle Web Components\n\nhttp://www.ichemlabs.com\n  1  0  0  0  0  0            999 V2000\n    0.0000    0.0000    0.0000 C   0  0  0  0  0  0\nM  END"){
                 var mol = ChemDoodle.writeMOL(element.getMolecule()).valueOf();
              if (scope.localMolfile.valueOf() != mol || scope.molecule.molfile != mol){
                
                scope.localMolfile = ChemDoodle.writeMOL(element.getMolecule()).valueOf();
                scope.molecule.molfile = ChemDoodle.writeMOL(element.getMolecule()).valueOf();
              } else{
                   console.log("test", ChemDoodle.writeMOL(element.getMolecule()).valueOf())
              }           
              
              
            }else{
              scope.localMolfile = "";
              scope.molecule.molfile = "";

            }

          },
          // 'keyup' : function() {              
                 
          //   //Check if the molecule is the standard methane and ignore
          //   if (scope.localMolfile !== "Molecule from ChemDoodle Web Components\n\nhttp://www.ichemlabs.com\n  1  0  0  0  0  0            999 V2000\n    0.0000    0.0000    0.0000 C   0  0  0  0  0  0\nM  END"){
          //     var mol = ChemDoodle.writeMOL(element.getMolecule()).valueOf();
          //     if (scope.localMolfile.valueOf() != mol || scope.molecule.molfile != mol){
          //       console.log("set3")
          //       scope.localMolfile = ChemDoodle.writeMOL(element.getMolecule()).valueOf();
          //      scope.molecule.molfile = ChemDoodle.writeMOL(element.getMolecule()).valueOf();

          //     } 
             
          //   }else{
          //     console.log("set4")
          //     scope.localMolfile = "";
          //     scope.molecule.molfile = "";

          //   }
           
          // }
        }); 

        $timeout(function(){redraw(500)});  
        function redraw(doIt){
          console.log("red")
            var noredraw = false;
            if(angular.isDefined(element.molecules)){
                var mol = ChemDoodle.writeMOL(element.getMolecule()).valueOf();
                if (scope.molecule.molfile == mol && scope.localMolfile == mol){
                    noredraw = true;
                }
            }
           if (jQuery('#chemdoodle-holder').is(":visible") && !noredraw ){

              var cd_width = jQuery('#chemdoodle-holder').width();
              if(doIt && !cd_width){
                cd_width = doIt;
              }
              jQuery('#chemdoodle-holder').html('<canvas id="chemdoodle" tabindex="1"></canvas>');
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
          }else{
            console.log("notredraw");
          }
        }
        

        
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