'use strict';

/**
 * @ngdoc directive
 * @name ngChemApp.directive:HandsOnCompoundTable
 * @description
 * # HandsOnCompoundTable
 */
angular.module('ngChemApp')
  .directive('handsoncompoundtable',["$timeout", function ($timeout) {
    return {
      template: '<div style=""></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
                function redraw(){

                var container1,
                    hot1;
                var container = document.createElement('DIV');
                while (element[0].firstChild) {
                    element[0].removeChild(element[0].firstChild);
                }

                element[0].appendChild(container);
                
                  scope.hot1 = new Handsontable(container, {
                    data: scope.compounds,
                    colWidths: [100, 200, 200, 80],
                    colHeaders: [ "Image", ],
                    columns: [

                      {data: "imageSrc", renderer: coverRenderer}
                    ]
                  });

              }
              
              scope.$watch("compounds", function(){
                if (scope.compounds.length >0){
                    if (angular.isDefined(scope.compounds[0].imageSrc)){
                      redraw();
                    }
                }
                console.log("test");
              }, true);

             
              function coverRenderer (instance, td, row, col, prop, value, cellProperties) {
                var escaped = Handsontable.helper.stringify(value),
                  img;
              
                  img = document.createElement('IMG');
                  img.src = value;
              
                  Handsontable.Dom.addEvent(img, 'mousedown', function (e){
                    e.preventDefault(); // prevent selection quirk
                  });
              
                  Handsontable.Dom.empty(td);
                  td.appendChild(img);
                
                return td;
              }

      },
      scope: {
        "compounds" : "="
      }
    };
  }]);
