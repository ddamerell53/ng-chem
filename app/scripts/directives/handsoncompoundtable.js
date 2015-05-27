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
      template: '<div style="width:100%, overflow:hidden;"></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
                function redraw(){
                  var pids = [];
                  var columnNames = [];
                  angular.forEach(scope.compounds, function(comp){
                    var split = comp.project.split("/");
                    var projid = parseInt(split[split.length-1]); 
                    if (pids.indexOf(projid)< 0){
                      pids.push(projid);
                    }
                  });

                  var projects = angular.copy(scope.cbh.projects.objects);

                  angular.forEach(projects,function(proj){
                    if ( $.inArray(pids,proj.id)){
                        angular.forEach(proj.schemaform.form, function(item){
                          if(columnNames.indexOf(item.key) < 0){
                            columnNames.push(item.key);
                          }
                        }
                      );
                        
                      }
                      
                  });
                var customCols = columnNames.map(function(cn){
                  return {data: "customFields." + cn, readOnly:true, className: "htCenter htMiddle "}
                })
                var allCols = [
                      {data: "imageSrc", renderer: coverRenderer, readOnly: true,  className: "htCenter htMiddle "},
                      {data: "chemblId", renderer: modalLinkRenderer, readOnly: true, className: "htCenter htMiddle "},
                      {data: "createdBy", readOnly: true, className: "htCenter htMiddle "},
                      {data: "timestamp", readOnly: true,className: "htCenter htMiddle "},
                      {data: "molecularWeight", readOnly: true, className: "htCenter htMiddle "},


                    ].concat(customCols);
                var widths = customCols.map(function(){return 100});
                var allWidths = [75, 120, ].concat(widths);
                var columnHeaders = [ "Image","ID","Added By", "Date", "Mol Weight" ].concat(columnNames);
                var container1,
                    hot1;
                var container = document.createElement('DIV');
                container.style.overflow = 'hidden';
                container.style.width = '100%';
                while (element[0].firstChild) {
                    element[0].removeChild(element[0].firstChild);
                }
               
                element[0].appendChild(container);
                
                  scope.hot1 = new Handsontable(container, {
                    width: '100%',
                    data: scope.compounds,
                   // colWidths: widths,
                    colHeaders: columnHeaders,
                    columns: allCols
                  });

              }
              
              scope.$watch("compounds", function(){
                if (scope.compounds.length >0){
                    if (angular.isDefined(scope.compounds[0].imageSrc)){
                      redraw();
                    }
                }
              }, true);

                            // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
              function strip_tags(input, allowed) {
                var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
                  commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
              
                // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
                allowed = (((allowed || "") + "").toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join('');
              
                return input.replace(commentsAndPhpTags, '').replace(tags, function ($0, $1) {
                  return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
                });
              }
              function customFieldRenderer(instance, td, row, col, prop, value, cellProperties) {
                var mol = instance.getSourceDataAtRow(row);


                var escaped = Handsontable.helper.stringify(mol.customFields[prop]);
                value = mol.customFields[prop];
                escaped = strip_tags(escaped, '<em><b><strong><a><big>'); //be sure you only allow certain HTML tags to avoid XSS threats (you should also remove unwanted HTML attributes)
                td.innerHTML = escaped;
          
                return td;
              }
              function safeHtmlRenderer(instance, td, row, col, prop, value, cellProperties) {
                var escaped = Handsontable.helper.stringify(value);
                escaped = strip_tags(escaped, '<em><b><strong><a><big>'); //be sure you only allow certain HTML tags to avoid XSS threats (you should also remove unwanted HTML attributes)
                td.innerHTML = escaped;
              
                return td;
              }

              function modalLinkRenderer(instance, td, row, col, prop, value, cellProperties) {
                var escaped = Handsontable.helper.stringify(value);
                escaped = strip_tags(escaped, ''); //be sure you only allow certain HTML tags to avoid XSS threats (you should also remove unwanted HTML attributes)
                var a = document.createElement('a');
                a.innerHTML = escaped;
                Handsontable.Dom.addEvent(td, 'mousedown', function (e){
                    // e.preventDefault(); // prevent selection quirk
                    var mol = instance.getSourceDataAtRow(row);
                    scope.cbh.openSingleMol(mol);
                });
                Handsontable.Dom.empty(td);
                td.className  += "htCenter htMiddle ";
                td.appendChild(a);
              
                return td;
              }
  
             
              function coverRenderer (instance, td, row, col, prop, value, cellProperties) {
                var escaped = Handsontable.helper.stringify(value),
                  img;
              
                  img = document.createElement('IMG');
                  img.src = value;
              
                  Handsontable.Dom.addEvent(img, 'mousedown', function (e){
                    // e.preventDefault(); // prevent selection quirk
                    var mol = instance.getSourceDataAtRow(row);
                    scope.cbh.openSingleMol(mol);
                  });
              
                  Handsontable.Dom.empty(td);
                  td.className  += "htCenter htMiddle ";

                  td.appendChild(img);
                
                return td;
              }

      },
      scope: {
        "compounds" : "=",
        "cbh" : "=",
      }
    };
  }]);
