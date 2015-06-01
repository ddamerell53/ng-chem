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

                    console.log(myproj.id.toString())
                    
                    if ( pids.hasOwnProperty(myproj.id.toString())){
                        angular.forEach(myproj.schemaform.form, function(i){
                          console.log(i)
                          if(cNames.indexOf( i.key) < 0){

                            cNames.push(i.key);
                          }
                        }
                      );
                        
                      }
                      
                  });
                
                var customCols = cNames.map(function(cn){
                  return {data: "customFields." + cn, readOnly:true, className: "htCenter htMiddle ", renderer: linkRenderer}
                })
                var allCols = [
                      {data: "properties.imageSrc", renderer: coverRenderer, readOnly: true,  className: "htCenter htMiddle "},
                      {data: "chemblId", renderer: modalLinkRenderer, readOnly: true, className: "htCenter htMiddle "},
                      {data: "createdBy", readOnly: true, className: "htCenter htMiddle "},
                      {data: "timestamp", readOnly: true,className: "htCenter htMiddle "},
                      {data: "molecularWeight", readOnly: true, className: "htCenter htMiddle "},


                    ].concat(customCols);
                var widths = customCols.map(function(){return 100});
                var allWidths = [75, 120, ].concat(widths);
                var columnHeaders = [ "Image","ID","Added By", "Date", "Mol Weight" ].concat(cNames);
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
                    if (angular.isDefined(scope.compounds[0].properties.imageSrc)){
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
  
              function linkRenderer(instance, td, row, col, prop, value, cellProperties) {
               var escaped = Handsontable.helper.stringify(value);
                escaped = strip_tags(escaped, '');
                if (escaped.indexOf("http") == 0 && escaped.indexOf("//") > 0){

                  var a = document.createElement('a');
                  var afterHttp = escaped.split("//")[1];
                  a.innerHTML = afterHttp;
                  if (afterHttp.length>30){
                      a.innerHTML = afterHttp.substring(0,29) +"...";
                  }
                  a.href = escaped;
                  a.target = "_blank";
                  Handsontable.Dom.empty(td);
                  td.className  += "htCenter htMiddle ";
                  td.appendChild(a);
                }else{
                  td.innerHTML = escaped;
                }
              
                return td;
              }
  
             
              function coverRenderer (instance, td, row, col, prop, value, cellProperties) {
                var escaped = Handsontable.helper.stringify(value),
                  img;
                  console.log("I am getting here");
                  img = document.createElement('IMG');
                  if(value != "") {
                    img.src = value;  
                  }
                  else {
                    img.src = "images/no-structure.png";
                  }
                  //img.src = value;
              
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
