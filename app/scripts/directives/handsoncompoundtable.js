'use strict';

/**
 * @ngdoc directive
 * @name ngChemApp.directive:HandsOnCompoundTable
 * @description
 * # HandsOnCompoundTable
 */
angular.module('ngChemApp')
  .directive('handsoncompoundtable',["$timeout","$compile","renderers", function ($timeout,$compile, renderers) {
    return {
      template: '<div  ></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
              var redraw;

              scope.cbh.setMappedFieldInDirective = function(newFieldName, unCuratedFieldName){
                angular.forEach(scope.uncuratedHeaders,
                function(hdr){
                    if(hdr.name == unCuratedFieldName){
                        hdr.copyTo = newFieldName;
                        
                    }
                });
                if(newFieldName != "SMILES for chemical structures"){
                  //Smiles will get redrawn anyway as there is a call to the backend
                  redraw();
                }
                scope.cbh.setMappedFieldInController(newFieldName, unCuratedFieldName);
              }

              redraw = function(){
                  var pids = {};
                  var cNames = [];       //DO  NOT CHANGE SMILES TITLE without checking in addcompounds controller and the compounds.py file
                  var jsonSchemaColDefs = [{"title": "SMILES for chemical structures", "type": "chemical"}];
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
                            jsonSchemaColDefs.push(angular.copy(myproj.schemaform.schema.properties[i.key]));
                          }
                        }
                      );
                        
                      }
                      
                  });
                
                var customCols = cNames.map(function(cn){
                  
                  return {noSort:true,
                    knownBy: cn, 
                    data: "customFields." + cn, readOnly:true, 
                    className: "htCenter htMiddle ", 
                    renderer: "linkRenderer"}
                });

                var allCols;

                if(angular.isDefined(scope.uncuratedHeaders)){
                  var uncuratedColumns = scope.uncuratedHeaders.map(function(un, index, array){
                      var disableSel = "";
                      var optList = angular.copy(jsonSchemaColDefs).map(function(cName){
                          var errorName = cName.type;
                            if(cName.format == "date"){
                              errorName = "stringdate";
                              
                            }
                            if(un.fieldErrors[errorName] === true){
                                return "<option disabled value='" + cName.title + "'>" +  cName.title + " (Invalid data for " + cName.friendly_field_type + ")</option>";
                            }  
                            var disabledOrSelected = "";
                          var weird = array.map(function(uncur){
                            
                            if(uncur.name != un.name){
                              
                                if(cName.title.toLowerCase()==uncur.copyTo.toLowerCase()){
                                    disabledOrSelected = "<option disabled value='" + cName.title + "'>" +  cName.title + " <br>(Already mapped for " + uncur.name + ")</option>";
                                }
                            }else{
                                if(cName.title.toLowerCase()==uncur.copyTo.toLowerCase()){
                                    disabledOrSelected = "<option selected value='" + cName.title + "'>" +  cName.title + "</option>";
                                    if(cName.title == "SMILES for chemical structures"){
                                      disableSel = "disabled"
                                    }
                                }
                            }
                          });
                          if(disabledOrSelected){
                            return disabledOrSelected;
                          }else{
                            return "<option value='" + cName.title + "'>" +  cName.title + "</option>";
                          }

                      });

                      var extraHtml = "<div class='form-group '  style='margin-top:10px'><select onchange='angular.element(this).scope().cbh.setMappedFieldInDirective(this.value, &quot;" + un.name + "&quot;)' class='form-control input-small '  " +  disableSel +" ><option value=''>Map column to:</option>" + optList.join("") + "</select>";
                      return {extra: extraHtml, knownBy: un.name, data: "uncuratedFields." + un.name, readOnly:true, className: "htCenter htMiddle ", renderer: "linkRenderer"}
                  });

                  allCols = [
                      {noSort:true, knownBy: "Image",data: "properties.imageSrc", renderer: "coverRenderer", readOnly: true,  className: "htCenter htMiddle "} ,

                      { knownBy: "Row",data: "id",  readOnly: true,  className: "htCenter htMiddle "} ,
                      { knownBy: "Action",data: "properties.action", type:"dropdown", source: ["New Batch","Ignore"], className: "htCenter htMiddle "} ,
                      { warningsFilter : true, knownBy:"Without Structure", data: "warnings.noStructure", renderer:"bulletRenderer", readonly:true},
                      { warningsFilter : true, knownBy:"Can't Process", data: "warnings.parseError", renderer:"bulletRenderer", readonly:true},
                      {warningsFilter : true, knownBy:"New to ChemReg", data: "warnings.new", renderer:"bulletRenderer", readonly:true},
                      {warningsFilter : true, knownBy:"Overlap", data: "warnings.overlap", renderer:"bulletRenderer", readonly:true},
                      {warningsFilter : true, knownBy:"Duplicated", data: "warnings.duplicate", renderer:"bulletRenderer", readonly:true},
                      {knownBy:"Inchi Key", data: "standardInchiKey",  readonly:true, renderer: "linkRenderer"}
                    ].concat(uncuratedColumns);
                }else{
                  allCols = [
                      {noSort:true, knownBy: "Image",data: "properties.imageSrc", renderer: "coverRenderer", readOnly: true,  className: "htCenter htMiddle "},
                      {noSort:true, knownBy: "UOx ID",data: "chemblId", renderer: "modalLinkRenderer", readOnly: true, className: " htCenter htMiddle "},
                      {noSort:true,knownBy: "Added By",data: "createdBy", readOnly: true, className: "htCenter htMiddle "},
                      {noSort:true,knownBy: "Date",data: "timestamp", readOnly: true,className: "htCenter htMiddle "},
                      {noSort:true,knownBy: "Mol Weight",data: "molecularWeight", readOnly: true, className: "htCenter htMiddle "},
                      {noSort:true,knownBy: "Batch ID",data: "multipleBatchId", readOnly: true, className: "htCenter htMiddle "},
                      {noSort:true,knownBy: "Project",data: "project", readOnly: true, className: "htCenter htMiddle ", renderer: "projectRenderer"},
                    ].concat(customCols);
                }
                if(angular.isDefined(scope.excluded)){
                  var theCols = [];
                  angular.forEach(allCols, function(c){
                    var keep = true;
                    angular.forEach(scope.excluded, function(ex){
                      // console.log(ex);
                      // console.log(c);
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
                    return renderers.getColumnLabel(c, scope);
                });
                var hotObj = {
                    width: '100%',
                    data: scope.compounds,
                    colHeaders: columnHeaders,
                    columns: allCols,       
                               
                  }
                
                  if(angular.isDefined(scope.uncuratedHeaders)){
                  hotObj.afterChange = function(data,sourceOfChange){
                      scope.cbh.saveChangesToTemporaryDataInController(data, sourceOfChange);
                  }  
                  renderers.renderHandsOnTable(scope, hotObj, element );

                
                

                }






              }
              scope.$watch("redraw", function(newValue, oldValue){
                redraw();
              }, true);

                            // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)


             
              

      },
      

      scope: {
        "redraw": "=",
        "compounds" : "=",
        "cbh" : "=",
        "sorts" : "=",
        "uncuratedHeaders" : "=",
        "columns" : "=",
        "excluded" : "=",
        "warningsFilter" : "="
      }
    };
  }]);
