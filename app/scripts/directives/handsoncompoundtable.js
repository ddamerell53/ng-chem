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
      link: function preLink(scope, element, attrs) {
              var redraw;
              var jsonSchemaColDefs; 


              scope.cbh.setMappedFieldInDirective = function(newFieldId, unCuratedFieldName){
                console.log(newFieldId);
                if(newFieldId === ""){
                  console.log(newFieldId);
                  angular.forEach(scope.uncuratedHeaders,
                  function(hdr){
                    if(hdr.name == unCuratedFieldName){
                      delete hdr.operations;
                      hdr.copyTo = "";
                    }
                  });
                }else{
                  var newField = jsonSchemaColDefs[newFieldId];
                var newFieldName = newField.title;
                console.log(newFieldName);
                  angular.forEach(scope.uncuratedHeaders,
                    function(hdr){
                      if(hdr.name == unCuratedFieldName){
                          hdr.copyTo = newFieldName;
                          var fieldJsonPatchOperations = [];

                          if(newField.type=="array"){
                            fieldJsonPatchOperations.push({"op": "add", "path": "/custom_fields/" + newFieldName, "value" : []});
                            fieldJsonPatchOperations.push({"op": "move", "path": "/custom_fields/" + newFieldName + "/0" , "from" : "/uncurated_fields/" + unCuratedFieldName });
                          }else{
                            var operation = {"op": "move", "path": "/custom_fields/" + newFieldName  , "from" : "/uncurated_fields/" + unCuratedFieldName };
                            fieldJsonPatchOperations.push(operation);
                            if(newField.format=="date"){
                              fieldJsonPatchOperations.push({"op": "convertdate", "path": "/custom_fields/" + newFieldName});
                            }
                          }
                          hdr.operations = fieldJsonPatchOperations;
                          
                      }
                  });

                  
                }
                redraw();
                  
                scope.cbh.setMappedFieldInController(newFieldName, unCuratedFieldName);
              }

              redraw = function(){
                  jsonSchemaColDefs = [];
                  var isNewCompoundsInterface = false;
                  if(angular.isDefined(scope.uncuratedHeaders)){
                    isNewCompoundsInterface = true;
                    if(scope.cbh.file_extension=="xlsx"){
                      //SMiles option only for excel files
                        jsonSchemaColDefs = [{"title": "SMILES for chemical structures", "type": "chemical"}];

                    }

                  }

                  var pids = {};
                  var cNames = [];       //DO  NOT CHANGE SMILES TITLE without checking in addcompounds controller and the compounds.py file
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

                if(isNewCompoundsInterface){
                  var uncuratedColumns = scope.uncuratedHeaders.map(function(un, index, array){
                      var disableSel = "";
                      var copyTo = "";
                      var optList = angular.copy(jsonSchemaColDefs).map(function(cName, cNameIndex){
                          var selectedModel = "";
                          var errorName = cName.type;
                            if(cName.format == "date"){
                              errorName = "stringdate";
                              
                            }
                            var disabledOrSelected = "";
                            if(un.fieldErrors[errorName] === true){
                              cName.disabled = true;
                              cName.fieldError = true;
                              cName.uiClass = "";
                                disabledOrSelected = cName;
                                //"<option  disabled >" +  cName.title + " (Invalid data for " + cName.friendly_field_type + ")</option>";
                            }  
                            if(!disabledOrSelected){
                               var weird = array.map(function(uncur){
                            //Check for other items that have been selected in the other dropdowns
                            if(uncur.name != un.name){
                                if(cName.title.toLowerCase()==uncur.copyTo.toLowerCase()){
                                    cName.disabled = true;
                                    cName.alreadyMapped = uncur.name;
                                    cName.uiClass = "";
                                    disabledOrSelected = cName;
                                }
                            }else{

                                if(cName.title.toLowerCase()==uncur.copyTo.toLowerCase()){
                                    cName.uiClass = "glyphicon-check";
                                    disabledOrSelected = cName;
                                    copyTo = cName.title;
                                }
                            }
                          });
                            }
                         
                          if(disabledOrSelected){
                            return disabledOrSelected;
                          }else{
                            cName.uiClass = "glyphicon-unchecked";
                            return cName;
                          }

                      });
//onchange='angular.element(this).scope().cbh.setMappedFieldInDirective(this.value, \"" + un.name + "\")'
                      // var extraHtml = "<select onclick='event.stopPropagation();' onmouseup='event.stopPropagation();' autocomplete='off' class='form-control '  " +  disableSel +" ><option >Map column to:</option>" + optList.join("") + "</select>";
                      return {sortOrder : "none", copyTo: copyTo, mappingOptions: optList, knownBy: un.name, data: "uncuratedFields." + un.name, readOnly:true, className: "htCenter htMiddle ", renderer: "linkRenderer"}
                  });

                  allCols = [
                      {noSort:true, knownBy: "Structure",data: "properties.imageSrc", renderer: "coverRenderer", readOnly: true,  className: "htCenter htMiddle "} ,

                      { sortOrder : "none", knownBy: "Row",data: "id",  readOnly: true,  className: "htCenter htMiddle "} ,
                      { sortOrder : "none",knownBy: "Action",data: "properties.action", type:"dropdown", source: ["New Batch","Ignore"], className: "htCenter htMiddle "} ,
                      // {sortOrder : "none", warningsFilter : true, knownBy:"Without Structure", data: "warnings.noStructure", renderer:"bulletRenderer", readonly:true},
                      // {sortOrder : "none", warningsFilter : true, knownBy:"Can't Process", data: "warnings.parseError", renderer:"bulletRenderer", readonly:true},
                      // {sortOrder : "none",warningsFilter : true, knownBy:"New to ChemReg", data: "warnings.new", renderer:"bulletRenderer", readonly:true},
                      // {sortOrder : "none",warningsFilter : true, knownBy:"Overlap", data: "warnings.overlap", renderer:"bulletRenderer", readonly:true},
                      // {sortOrder : "none", warningsFilter : true, knownBy:"Duplicated", data: "warnings.duplicate", renderer:"bulletRenderer", readonly:true},
                      {sortOrder : "none", knownBy:"Inchi Key", data: "standardInchiKey",  readonly:true, renderer: "linkRenderer"}
                    ].concat(uncuratedColumns);
                }else{
                  allCols = [
                      {noSort:true, knownBy: "Structure",data: "properties.imageSrc", renderer: "coverRenderer", readOnly: true,  className: "htCenter htMiddle "},
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
                    // disableVisualSelection: true,      
                               
                  }
                  if(isNewCompoundsInterface){
                      hotObj.afterChange = function(data,sourceOfChange){
                          scope.cbh.saveChangesToTemporaryDataInController(data, sourceOfChange);
                      } 
                  } 

            var rend = renderers.getRenderers(scope, isNewCompoundsInterface);
         if(angular.isDefined(scope.elem)){
            var scroll = scope.elem.scrollLeft();
            var scrollTop = $(window).scrollTop();

         }
        angular.forEach(hotObj.columns, function(c){
          if(angular.isDefined(c.renderer)){

            c.renderer = rend[c.renderer];
          }
        });

            var container1,
            hot1;
            var container = document.createElement('DIV');


            while (element[0].firstChild) {
                element[0].removeChild(element[0].firstChild);
            }
           
            element[0].appendChild(container);
            var hot1 = new Handsontable(container, hotObj);
            var id = element[0].firstChild.id;
            scope.hotId = "#" + id;
            var elem = $(scope.hotId);

            $timeout(function(){
              var html = "";
              $(elem[0].children[0].firstChild.firstChild.firstChild.firstChild.children[1].firstChild).replaceWith(html);
              $(elem[0].children[1].firstChild.firstChild.firstChild.firstChild.children[1].firstChild).replaceWith(html);
              // var data=["test","test2"];
              // var s = $("<select id=\"selectId\" name=\"selectName\" />");
              // for(var val in data) {
              //     $("<option />", {value: val, text: data[val]}).appendTo(s);
              // }
              elem.wrap("<div id='myid' class='handsontable'></div>");
              scope.width = 0;
              // s.prependTo($(elem[0]));
              angular.forEach(hotObj.columns, function(c, index){
                  c.myColWidth = hot1.getColWidth(index); 
                  scope.width += c.myColWidth;  
                  if(!c.noSort){
                    c.sortOrder = "none";
                  }
                  angular.forEach(scope.sorts, function(item){
                    if(angular.isDefined(item[c.data])){
                      //If an item is in the sorted columns list
                        c.sortOrder = item[c.data].order;
                        console.log("test");
                    };

                  });
              });
                //*[@id="ht_c2c5a3b0ab353bce"]/div[2]/div/div/div/table/thead
              

              scope.columns = hotObj.columns;
              $("#myid").doubleScroll();
              var header = document.createElement('DIV');
              var head = angular.element(header);
              head.html('<div ng-include="&apos;views/templates/compound-table-header.html&apos;"></div>');
              var compiled = $compile(head.contents())(scope);
              $("#myid").prepend(compiled);              

              $('.btn-toggle').dropdown();
              scope.elem = elem;
              if(scroll){
                scope.elem.scrollLeft(scroll);
              }
              if(scrollTop){
                $(window).scrollTop(scrollTop);
              }
           
            });
           
            scope.hot1 = hot1;

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
