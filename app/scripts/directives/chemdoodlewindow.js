'use strict';

/**
 * @ngdoc directive
 * @name ngChemApp.directive:chemdoodleWindow
 * @description
 * # chemdoodleWindow
 */
angular.module('ngChemApp')
  .directive('chemdoodleWindow', function () {
    return {
      template: '<div class="col-xs-12" id="chemdoodle-holder"><canvas id="chemdoodle"></canvas></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
      	var cd_width = jQuery('#chemdoodle-holder').width();
        element = new ChemDoodle.SketcherCanvas('chemdoodle', cd_width, 300, {oneMolecule:true});
        
        element.repaint();
      }
    };
  });
