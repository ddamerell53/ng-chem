'use strict';

/**
 * @ngdoc directive
 * @name chembiohubAssayApp.directive:projectList
 * @restrict 'E'
 * @description
 * # projectList
 */
angular.module('chembiohubAssayApp')
  .directive('projectList',  function () {
    return {
      templateUrl: 'views/templates/project-list.html',
      restrict: 'E',
      /*link: function postLink(scope, element, attrs) {
        element.text('this is the projectList directive');
      },*/
      controller: ['$scope', '$timeout', function($scope, $timeout) {

      	
      		$scope.projects = $scope.cbh.projects.objects;
      	
      	
      }],
      link: function(scope, element, attrs){
        scope.svgify = function(){
            jQuery('img.svg').each(function(){
                var $img = jQuery(this);
                var imgID = $img.attr('id');
                var imgClass = $img.attr('class');
                var imgURL = $img.attr('src');

                jQuery.get(imgURL, function(data) {
                    // Get the SVG tag, ignore the rest
                    var $svg = jQuery(data).find('svg');

                    // Add replaced image's ID to the new SVG
                    if(typeof imgID !== 'undefined') {
                        $svg = $svg.attr('id', imgID);
                    }
                    // Add replaced image's classes to the new SVG
                    if(typeof imgClass !== 'undefined') {
                        $svg = $svg.attr('class', imgClass+' replaced-svg');
                    }

                    // Remove any invalid XML tags as per http://validator.w3.org
                    $svg = $svg.removeAttr('xmlns:a');
                    //$svg = $svg.attr('width', '32px');

                    // Replace image with new SVG
                    $img.replaceWith($svg);

                }, 'xml');

            });
        }
        $timeout(function(){
          scope.svgify();
        })

      }
    };
  } );
