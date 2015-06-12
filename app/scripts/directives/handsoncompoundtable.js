'use strict';

/**
 * @ngdoc directive
 * @name ngChemApp.directive:HandsOnCompoundTable
 * @description
 * # HandsOnCompoundTable
 */
angular.module('ngChemApp')
  .directive('handsoncompoundtable',["$timeout","renderers", function ($timeout, renderers) {
    return {
      template: '<div style="width:100%, overflow:hidden;"></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
 

                function redraw(){
                  var pids = {};
                  var cNames = [];
                  var count = 0;

                  angular.forEach(scope.compounds, function(comp){
                    var split = comp.project.split("/");
                    var projid = split[split.length-1]; 
                    pids[projid] = true;
                    
                    
                  });

                  var projects = scope.cbh.projects.objects;

                  angular.forEach(projects,function(myproj){

                    
                    if ( pids.hasOwnProperty(myproj.id.toString())){
                        angular.forEach(myproj.schemaform.form, function(i){
                          if(cNames.indexOf( i.key) < 0){

                            cNames.push(i.key);
                          }
                        }
                      );
                        
                      }
                      
                  });
                
                var customCols = cNames.map(function(cn){
                  return {data: "customFields." + cn, readOnly:true, className: "htCenter htMiddle ", renderer: "linkRenderer"}
                })
                var allCols = [
                      {data: "properties.imageSrc", renderer: "coverRenderer", readOnly: true,  className: "htCenter htMiddle "},
                      {data: "chemblId", renderer: "modalLinkRenderer", readOnly: true, className: " htCenter htMiddle "},
                      {data: "createdBy", readOnly: true, className: "htCenter htMiddle "},
                      {data: "timestamp", readOnly: true,className: "htCenter htMiddle "},
                      {data: "molecularWeight", readOnly: true, className: "htCenter htMiddle "},
                      {data: "multipleBatchId", readOnly: true, className: "htCenter htMiddle "},
                      {data: "project", readOnly: true, className: "htCenter htMiddle ", renderer: "projectRenderer"},



                    ].concat(customCols);
                var widths = customCols.map(function(){return 100});
                var allWidths = [75, 120, ].concat(widths);
                var columnHeaders = [ "Image","ID","Added By", "Date", "Mol Weight", "Batch ID", "Project", ].concat(cNames);
                
                var hotObj = {
                    width: '100%',
                    data: scope.compounds,
                    colHeaders: columnHeaders,
                    columns: allCols
                  }

                renderers.renderHandsOnTable(scope, hotObj, element );




              }
              
              scope.$watch("compounds", function(){
                if (scope.compounds.length >0){
                    if (angular.isDefined(scope.compounds[0].properties.imageSrc)){
                      redraw();
                    }
                }
              }, true);

                            // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)


             
              

      },
      scope: {
        "compounds" : "=",
        "cbh" : "="
      }
    };
  }]);
