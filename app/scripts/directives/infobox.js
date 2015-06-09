'use strict';

/**
 * @ngdoc directive
 * @name ngChemApp.directive:infoBox
 * @description
 * # infoBox
 */
angular.module('ngChemApp')
  .directive('infoBox', function () {
    return {
      templateUrl: 'views/templates/info-template.html',
      restrict: 'AEC',
      transclude: true,
      /*link: function postLink(scope, element, attrs) {
        element.text('this is the infoBox directive');
      }*/
      controller: ['$scope', 'MessageFactory', function($scope, MessageFactory) {
      	//$scope.tooltext = "test here";
      	

        $('[data-toggle="popover"]').popover( {trigger: 'focus'} );
      	if($scope.freetext) {
      		$scope.displaytext = $scope.freetext;
      	}
      	else {
      		$scope.displaytext = MessageFactory.getMessage($scope.lookup);
      	}

        
      	
      }],
      scope: {
      	//use lookup if you are using the MessageFactory service
        lookup:'@',
        //use direct if you want to enter ad hoc text
        freetext:'@',
        left:'@',

      },
      /*link: function(scope, element, attr, $compile) {
        var html = element.html();
        //debugger;
        html = html.replace(/\[\[(\w+)\]\]/g, function(_, text) {
          return '<span translate="' + text + '"></span>';
        });
        element.html(html);
        $compile(element.contents())(scope); //<---- recompilation 
      }*/
    };
  });
