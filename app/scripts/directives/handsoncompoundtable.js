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
      template: '<div  ></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
 
              var redraw;
              redraw = function(){
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
                  
                  return {knownBy: cn, data: "customFields." + cn, readOnly:true, className: "htCenter htMiddle ", renderer: "linkRenderer"}
                });


                var allCols;

                if(angular.isDefined(scope.uncuratedHeaders)){
                  var uncuratedColumns = scope.uncuratedHeaders.map(function(un, index, array){
                      var optList = angular.copy(cNames).map(function(cName){
                          var weird = array.map(function(uncur){
                            if(uncur.name != un.name){
                                if(cName.toLowerCase()==uncur.copyTo){
                                    return "<option disabled value='" + cName + "'>" +  cname + "</option>";
                                }
                            }else{
                                if(cName.toLowerCase()==uncur.copyTo){
                                    return "<option selected value='" + cName + "'>" +  cname + "</option>";
                                }
                            }
                          });
                          if(weird.length == 1){
                            return weird[0]
                          }else{
                            return "<option value='" + cName + "'>" +  cName + "</option>";
                          }

                      });

                      var extraHtml = "<br><div class='form-group'><select class='form-control'><option value=''>Map column to:</option>" + optList.join("") + "</select></div>";
                      return {extra: extraHtml, knownBy: un.name, data: "uncuratedFields." + un.name, readOnly:true, className: "htCenter htMiddle ", renderer: "linkRenderer"}
                  });

                  allCols = [
                      { knownBy: "Original Row",data: "id",  readOnly: true,  className: "htCenter htMiddle "} ,
                      {noSort:true, knownBy: "Image",data: "properties.imageSrc", renderer: "coverRenderer", readOnly: true,  className: "htCenter htMiddle "} ,
                      { knownBy: "Action",data: "properties.action", type:"dropdown", source: ["New batch","Ignore"], className: "htCenter htMiddle "} ,
                      {knownBy:"No Struc", data: "warnings.noStructure", type:"checkbox", readonly:true},
                      {knownBy:"Error", data: "warnings.parseError", type:"checkbox", readonly:true},
                      {knownBy:"New", data: "warnings.new", type:"checkbox", readonly:true},
                      {knownBy:"Overlap", data: "warnings.overlap", type:"checkbox", readonly:true},
                      {knownBy:"Duplicated", data: "warnings.duplicate", type:"checkbox", readonly:true},
                      {knownBy:"Inchi Key", data: "standardInchiKey",  readonly:true, renderer: "linkRenderer"}

                    ].concat(uncuratedColumns).concat(customCols);
                }else{
                  allCols = [
                      {noSort:true, knownBy: "Image",data: "properties.imageSrc", renderer: "coverRenderer", readOnly: true,  className: "htCenter htMiddle "},
                      {noSort:true, knownBy: "UOx ID",data: "chemblId", renderer: "modalLinkRenderer", readOnly: true, className: " htCenter htMiddle "},
                      {knownBy: "Added By",data: "createdBy", readOnly: true, className: "htCenter htMiddle "},
                      {knownBy: "Date",data: "timestamp", readOnly: true,className: "htCenter htMiddle "},
                      {knownBy: "Mol Weight",data: "molecularWeight", readOnly: true, className: "htCenter htMiddle "},
                      {knownBy: "Batch ID",data: "multipleBatchId", readOnly: true, className: "htCenter htMiddle "},
                      {knownBy: "Project",data: "project", readOnly: true, className: "htCenter htMiddle ", renderer: "projectRenderer"},
                    ].concat(customCols);
                }
                if(angular.isDefined(scope.excluded)){
                  var theCols = [];
                  angular.forEach(allCols, function(c){
                    var keep = true;
                    angular.forEach(scope.excluded, function(ex){
                      console.log(ex);
                      console.log(c);
                      if(ex == c.data){
                        keep = false;
                      }
                    });
                    if(keep){
                      theCols.push(c);
                    }
                  });
                  allCols = theCols;
                }


                var columnHeaders = allCols.map(function(c){
                    if(c.noSort){
                        return c.knownBy;
                    }else{
                      //Return a piece of html including an onclick event that
                      //will pass to the appropriate function that mujst be implemented in the above controller
                      var className = "glyphicon glyphicon-sort";
                      angular.forEach(scope.sorts, function(item){
                        if(angular.isDefined(item[c.data])){
                          //If an item is in the sorted columns list
                            if(item[c.data].order == "asc"){
                              className += '-by-alphabet';
                            }else{
                             className += '-by-alphabet-alt';
                            }
                        };

                      });
                      var html = "<label><a onclick='angular.element(this).scope().cbh.addSort(\""  + c.data + "\")'>" + c.knownBy + "<span class='" + className + "'></span></a></label>";
                      if(angular.isDefined(c.extra)){
                        html += c.extra;
                      }
                      return html
                    }
                });
                var hotObj = {
                    width: '100%',
                    data: scope.compounds,
                    colHeaders: columnHeaders,
                    columns: allCols
                  }

                renderers.renderHandsOnTable(scope, hotObj, element );
                var index=0;
                angular.forEach(allCols,function(item){
                  item.foundWidth = scope.hot1.getColWidth(index);
                  index += 1;
                });





              }
              window.redraw = redraw;
              
              scope.$watch("compounds", function(newValue, oldValue){
                if (scope.compounds.length >0){
                    if (angular.isDefined(scope.compounds[0].properties.imageSrc)){
                      redraw();
                    }
                }else{
                    if(newValue.length < oldValue.length){
                      //check for emptying
                      redraw();
                    }
                }
              }, true);

                            // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)


             
              

      },
      scope: {
        "compounds" : "=",
        "cbh" : "=",
        "sorts" : "=",
        "uncuratedHeaders" : "=",
        "columns" : "=",
        "excluded" : "="
      }
    };
  }]);
