'use strict';

/**
 * @ngdoc directive
 * @name chembiohubAssayApp.directive:HandsOnCompoundTable
 * @description
 * # HandsOnCompoundTable
 */
angular.module('chembiohubAssayApp')
  .directive('handsoncompoundtable',["$timeout","$compile","renderers","$rootScope","$filter","$modal", function ($timeout,$compile, renderers, $rootScope, $filter, $modal) {
    return {
      template: '<div  ></div>',
      restrict: 'E',
      transclude: true,
      link: function preLink(scope, element, attrs) {
              var redraw;
              var jsonSchemaColDefs; 
              //console.log(scope.searchformSchema);
              function labelifyCustomField(field) {
                //for the column uiselect filters, we don't need the column name
                var parts = field.split("|");
                return parts[1];
              }

              function checkCustomField(startsWith, fieldToCheck) {
                var fieldSplit = fieldToCheck.split("|");
                return startsWith == fieldSplit[0];
              }
              scope.cbh.toggleMappedFieldInDirective = function(newFieldId, unCuratedFieldName){
                //console.log(newFieldId);
                if(newFieldId === ""){
                  angular.forEach(scope.uncuratedHeaders,
                  function(hdr){
                    if(hdr.name == unCuratedFieldName){
                      delete hdr.operations;
                      hdr.copyto = "";
                      hdr.automapped = false;
                    }
                  });
                }else{
                  var newField = jsonSchemaColDefs[newFieldId];
                var newFieldName = newField.title;
                  angular.forEach(scope.uncuratedHeaders,
                    function(hdr){
                      if(hdr.name == unCuratedFieldName){
                          if (hdr.copyto == newFieldName){
                            //Already set therefore reset
                            hdr.copyto = "";
                            delete hdr.operations;
                            hdr.automapped = false;

                          }else{
                            hdr.copyto = newFieldName;
                            hdr.automapped = false;
                            var fieldJsonPatchOperations = [];

                            if(newField.type=="array"){
                              fieldJsonPatchOperations.push({"op": "split", "path": "/uncurated_fields/" + unCuratedFieldName});
                              fieldJsonPatchOperations.push({"op": "move", "path": "/custom_fields/" + newFieldName , "from" : "/uncurated_fields/" + unCuratedFieldName });
                            }else{
                              var operation = {"op": "move", "path": "/custom_fields/" + newFieldName  , "from" : "/uncurated_fields/" + unCuratedFieldName };
                              fieldJsonPatchOperations.push(operation);
                              if(newField.format=="date"){
                                fieldJsonPatchOperations.push({"op": "convertdate", "path": "/custom_fields/" + newFieldName});
                              }
                            }
                          hdr.operations = fieldJsonPatchOperations;
                          
                          }  
                      }
                  });

                  
                }
                redraw();
                  
                scope.cbh.setMappedFieldInController(newFieldName, unCuratedFieldName);

              }//setMappedFieldInDirective
              scope.refreshSingleCustField = function(col, searchTerm, knownBy){
                  var url = col.searchformSchema.cf_form[0].options.async.url;
                  $http.get(url + "?custom__field__startswith=" + searchTerm + "&custom_field=" + col.knownBy).then(function(response){
                      col.typeahead = response.data;
                  });
              }


              function buildButton(col) {
                var button = document.createElement('BUTTON');
                var inactiveStr = "";
                if(col.noSort){
                  inactiveStr = " lightgrey"
                }
                button.innerHTML = '<span class="glyphicon glyphicon-filter' + inactiveStr + '"></span>';
                button.className = 'tableFilter';

                return button;
              }

              function buildInfoSpans(col){
                
                var mappingOptions = document.createElement('span');
                if(col.mappingOptions && !col.copyto){
                  mappingOptions.className = 'pull-right alert-danger'
                  mappingOptions.style.marginRight = "20px;"
                  mappingOptions.innerHTML = 'Unmapped <info-box lookup="unmapped_values_written" lookupitems="cbh.messages" right="true"></info-box>'
                }
                else if(col.mappingOptions && col.copyto){
                  var automappedSpan = '<span></span>';
                  if(col.automapped == true){
                    automappedSpan = '<span>(auto)</span>';
                  }
                  mappingOptions.className = 'pull-right alert-success'
                  mappingOptions.style.marginRight = "20px;"
                  mappingOptions.innerHTML = '<span class="glyphicon glyphicon-arrow-right"></span>' + col.copyto + automappedSpan + '<info-box lookup="mapped_values_written" lookupitems="cbh.messages" right="true"></info-box></span>';
                }
                return mappingOptions;
              }

              function addButtonMenuEvent(button, col) {
                Handsontable.Dom.addEvent(button, 'click', function (event) {

                  event.preventDefault();
                  event.stopImmediatePropagation();

                  //need to pass in the column here to get data out
                  //trigger call to cbh object to build modal window
                  //should take care ove everything from there.
                  //cbh scope can't see the correct variables to trigger filtering so need to try it here
                  
                    scope.col = angular.copy(col);
                    scope.modalInstance = $modal.open({
                      templateUrl: 'views/templates/compound-table-filter.html',
                      size: 'md',
                      resolve: {
                        col: function () {
                          return scope.col;
                        },
                        cbh: function() {
                          return scope.cbh;
                        }

                      }, 
                      controller: function($scope, $modalInstance, col, cbh, $timeout) {
                        $scope.col = col;
                        
                        $scope.modalInstance = $modalInstance;

                        //need to resolve the cbh object so that the filter selection triggers a reload
                        $scope.cbh = cbh;

                        $scope.cancel = function () {
                          $modalInstance.dismiss('cancel');
                        };

                      }
                    });
                
                });
              }
             

              redraw = function(){
 
                  jsonSchemaColDefs = [];
                  var isNewCompoundsInterface = false;
                  if(angular.isDefined(scope.uncuratedHeaders)){
                    isNewCompoundsInterface = true;
                    if(scope.cbh.fileextension=="xlsx"){
                      //SMiles option only for excel files
                        jsonSchemaColDefs = [{"title": "SMILES for chemical structures", "type": "chemical"}];

                    }

                  }

                  var customCols = [];       //DO  NOT CHANGE SMILES TITLE without checking in addcompounds controller and the compounds.py file
                  var count = 0;
                  var cNames = [];
                  var projects = scope.cbh.projects.objects;
                  var showCompounds = false;
                  angular.forEach(projects,function(myproj){

                    if ( !angular.isDefined(scope.cbh.includedProjectKeys) ||scope.cbh.includedProjectKeys.indexOf(myproj.project_key) > -1){
                        if (myproj.project_type.show_compounds){
                          showCompounds = true;
                        }

                        angular.forEach(myproj.schemaform.form, function(i){
                          if(cNames.indexOf( i.key) < 0){
                             var hotColumn = {
                                knownBy: i.key, 
                                data: "customFields." + i.key, 
                                readOnly:!scope.cbh.editMode, 
                                className: "htCenter htMiddle ", 
                                renderer: "customFieldRenderer",
                                typeahed : [],
                                field_type: i.field_type,
                            };
                            cNames.push(i.key);
                            customCols.push(hotColumn);
                            jsonSchemaColDefs.push(angular.copy(myproj.schemaform.schema.properties[i.key]));
                          }
                        }
                      );
                        
                      }
                      
                  });
                
                 
                var allCols = [];

                if(isNewCompoundsInterface){
                  var uncuratedColumns = scope.uncuratedHeaders.map(function(un, index, array){
                      var disableSel = "";
                      var copyto = un.copyto;
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
                                if(cName.title.toLowerCase()==uncur.copyto.toLowerCase()){
                                    cName.disabled = true;
                                    cName.alreadyMapped = uncur.name;
                                    cName.uiClass = "";
                                    disabledOrSelected = cName;
                                }
                            }else{

                                if(cName.title.toLowerCase()==uncur.copyto.toLowerCase()){
                                    cName.uiClass = "glyphicon-check";
                                    disabledOrSelected = cName;
                                    copyto = cName.title;
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
                      return {sortOrder : "none", copyto: copyto, mappingOptions: optList, knownBy: un.name, data: "uncuratedFields." + un.name, readOnly:true, className: "htCenter htMiddle ", renderer: "linkRenderer", automapped : un.automapped}
                  });

                  if (showCompounds){

                  allCols = [
                      {noSort:true, knownBy: "Structure",data: "image", renderer: "coverRenderer", readOnly: true,  className: "htCenter htMiddle "} ,
                      { sortOrder : "none", knownBy: "Row",data: "id",  readOnly: true,  className: "htCenter htMiddle "} ,
                      { noSort:true, readOnly:true, knownBy: "Info", data:"originalSmiles", renderer: "infoRenderer"},
                      { sortOrder : "none",knownBy: "Action",data: "properties.action", type:"dropdown", source: ["New Batch","Ignore"], className: "htCenter htMiddle "} ,
                      {sortOrder : "none", knownBy:"Inchi Key", data: "standardInchiKey",  readonly:true, renderer: "linkRenderer"}
                    ].concat(uncuratedColumns);
                  }
                  else {
                    allCols = [
                      { sortOrder : "none", knownBy: "Row",data: "id",  readOnly: true,  className: "htCenter htMiddle "} ,
                      { sortOrder : "none",knownBy: "Action",data: "properties.action", type:"dropdown", source: ["New Batch","Ignore"], className: "htCenter htMiddle "} ,
                    ].concat(uncuratedColumns);
                  }
                }else{
                  
                  if(scope.cbh.editMode){
                    allCols = [
                      {noSort:true, knownBy: "Archive/Restore",data: "properties.archived", renderer: "archivedRenderer", readOnly: true,  className: "htCenter htMiddle "}
                    ];
                  }
                  if (showCompounds){
                    allCols = allCols.concat([{noSort:true, knownBy: "Structure",data: "image", renderer: "coverRenderer", readOnly: true,  className: "htCenter htMiddle "},

                        ]);
                  }
                   allCols = allCols.concat([
                      {noSort:true, knownBy: "UOx ID",data: "chemblId", renderer: "modalLinkRenderer", readOnly: true, className: " htCenter htMiddle "},
                      {knownBy: "Project",data: "project", readOnly: true, className: "htCenter htMiddle ", renderer: "projectRenderer"}

                  ]);
                   allCols = allCols.concat(customCols);

                  if(!scope.cbh.editMode){
                    allCols = allCols.concat([
                     {noSort:true,knownBy: "Added By",data: "createdBy", readOnly: true, className: "htCenter htMiddle "},
                      {noSort:true,knownBy: "Date",data: "timestamp", readOnly: true,className: "htCenter htMiddle "},
                      { knownBy: "Batch ID",data: "id", readOnly: true, className: "htCenter htMiddle "},
                      {noSort:true, knownBy: "Upload ID",data: "multipleBatchId", readOnly: true, className: "htCenter htMiddle "}
                    ]);
                  }
                 if (showCompounds){
                    allCols = allCols.concat([
                      //{knownBy: "Mol Weight",data: "molecularWeight", readOnly: true, className: "htCenter htMiddle ", renderer: "centeredNumericRenderer"},

                        ]);
                  }

                    //allCols = allCols.concat(scope.plugins.map(function(plugin){return plugin.handsontable_column}));
                  
                     
                    
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
                     colWidths:150,
                    data: scope.compounds,
                    colHeaders: columnHeaders,
                    columns: allCols, 
                    //afterGetColHeader is a function that is called when the html of the header has already been set
                    //which allows DOM manipulation after the TH has been created
                    //there are lots of useful hooks provided by Handsontable
                    //http://docs.handsontable.com/0.15.0-beta3/Hooks.html
                    afterGetColHeader: function(col, TH) {
                      var instance = this,
                      button = buildButton(allCols[col]),
                      infospans = buildInfoSpans(allCols[col]);

                      addButtonMenuEvent(button, allCols[col]);

                      if (TH.firstChild.lastChild.nodeName === 'BUTTON') {
                        TH.firstChild.removeChild(TH.firstChild.lastChild);
                      }
                      TH.firstChild.appendChild(button);
                      TH.firstChild.appendChild(infospans);
                      //now we need to build in the warnings...
                      //<span style="margin-right:20px" ng-show="(col.mappingOptions.length > 0 &amp;&amp; !col.copyto)" class="pull-right alert-danger">Unmapped <info-box lookup="unmapped_values_written" lookupitems="cbh.messages" right="!$last"></info-box></span>
                      
                      TH.style['white-space'] = 'normal';
                    },
                    maxRows: scope.compounds.length,
                    fillHandle: "vertical"
                  }
                  if(isNewCompoundsInterface){
                      hotObj.afterChange = function(data,sourceOfChange){
                          scope.cbh.saveChangesToTemporaryDataInController(data, sourceOfChange);
                      };
                      hotObj.cells = function (row, col, prop) { 
                          if (prop =="properties.action"){
                              var comp = scope.compounds[row];
                              if(comp.warnings.parseError || comp.warnings.smilesParseError || comp.warnings.inchiCreationError){
                                return {readOnly:true};
                              }  
                          }
                      };
                  }else{

                      hotObj.afterChange = function(data,sourceOfChange){
                          scope.cbh.saveChangesToCompoundDataInController(data, sourceOfChange);
                      };
                      hotObj.beforeAutofill = function(start, end, data){
                        
                        for (var colNo = start.col; colNo <= end.col; colNo++){
                            if(allCols[colNo].field_type == "uiselecttags"){
                                for (var rowNo = start.row; rowNo <= end.end; rowNo++){

                                }
                            }
                        }
                        

                      };
                      
                  }

            var rend = renderers.getRenderers(scope, isNewCompoundsInterface);
         if(angular.isDefined(scope.elem)){
            //if there has already been a scroll on the compound table then we fix it in place
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
            // hot1.populateFromArray = renderers.getPopulateFromArray(hot1);
            var id = element[0].firstChild.id;
            scope.hotId = "#" + id;
            var elem = $(scope.hotId);

            $timeout(function(){
              
              elem.wrap("<div id='myid' style='overflow-x:scroll' class='handsontable'></div>");
              scope.width = 0;

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
                        
                    };

                  });
                  //set these to be a conditional of whether excludeBlanks and esxcludeFields are empty in the url
                  
                  c.showBlank = false;
                  c.showNonBlank = false;
                  //initialise from search parameters
                  if(scope.showNonBlanks){
                    angular.forEach(scope.showNonBlanks, function(nonblank){
                      //is this column a match with c.data?
                      if(nonblank == c.data){
                        c.showNonBlank = true;
                      }
                    })
                  }
                  if(scope.showBlanks){
                    angular.forEach(scope.showBlanks, function(blank){
                      //is this column a match with c.data?
                      if(blank == c.data){
                        c.showBlank = true;
                      }
                    })
                  }
                  c.typeahead = [];
                  
                  c.searchForm = angular.copy(scope.searchForm);
                  c.searchformSchema = angular.copy(scope.searchformSchema);
                  if(angular.isDefined(c.searchformSchema)){
                    c.searchformSchema.cf_form[0].options['custom_field'] = c.knownBy;
                     if(c.searchForm.search_custom_fields__kv_any) {
                      //loop through the items and only use those for this column
                      angular.forEach(c.searchForm.search_custom_fields__kv_any, function(field, index){
                        c.searchForm.search_custom_fields__kv_any = $filter('filter')(c.searchForm.search_custom_fields__kv_any, function(value, index) { return value.split("|")[0] == c.knownBy })
                        c.searchformSchema.schema.properties.search_custom_fields__kv_any.items = c.searchForm.search_custom_fields__kv_any.map(function(i){return {value : i, label : labelifyCustomField(i)}});
                      });
                        
                    }
                  }
                  
              });
              
              scope.columns = hotObj.columns;
              
              
              angular.forEach(scope.columns, function(col, index){
                var watchString = "columns[" + index + "].searchformSchema.schema.properties.search_custom_fields__kv_any.items";
                //retrieve the current search form to apply custom field filters from URL
                //we have already cloned the search form elements to build the models for the initial load.
                //this needs to be at an overall level
                 //look up the correct column's knownBy
                 //then do the reverse of the custom-field-to-table
                 scope.$on('custom-field-to-table', function(event, data) {
                      if(col.knownBy == data.newValue.split("|")[0]) {
                        
                        if(data.addOrRemove == "add") {
                          var match = $filter('filter')(col.searchForm.search_custom_fields__kv_any, function(value, index) { return value == data.newValue })
                          if(match.length == 0){
                            if(col.searchForm.search_custom_fields__kv_any){
                              col.searchForm.search_custom_fields__kv_any.push(data.newValue);  
                            }
                            else {
                              col.searchForm.search_custom_fields__kv_any = [(data.newValue)]; 
                            }
                            col.searchformSchema.schema.properties.search_custom_fields__kv_any.items = col.searchForm.search_custom_fields__kv_any.map(function(i){return {value : i, label : labelifyCustomField(i)}});
                          }
                        }
                        else if(data.addOrRemove == "remove"){
                          //because there are watches on both the schemas, we need to ensure that on the return journey, no more items are removed.
                          var diffs = $filter('filter')(col.searchForm.search_custom_fields__kv_any, function(value, index) { return value == data.newValue })
                          if(diffs.length > 0){
                            col.searchForm.search_custom_fields__kv_any.splice(col.searchForm.search_custom_fields__kv_any.indexOf(data.newValue), 1);
                            col.searchformSchema.schema.properties.search_custom_fields__kv_any.items = col.searchForm.search_custom_fields__kv_any.map(function(i){return {value : i, label : labelifyCustomField(i)}});
                          }
                        }
                        

                      }

                  });  
                
                scope.$watch(watchString, function(newValue, oldValue){
                  if(newValue !== oldValue){
                    //broadcast the newValue
                    var broadcastObj = scope.cbh.createCustomFieldTransport(newValue, oldValue, "obj");
                    //console.log("from table", broadcastObj)
                    $rootScope.$broadcast('custom-field-from-table', broadcastObj);
                  }
                }, true);
                
              });
              if(customCols){
                //Ensuring there is enough height for the menu bars to sit in
                   var minHeight = 200 + customCols.length *30;
                   $("#myid").css("min-height", minHeight + "px");
              }
              //removing double scroll - IE compat issues
              /*if(!scope.cbh.editMode){
                $("#myid").doubleScroll();
              }*/
              
              //removing recompiled HTML header - IE compat issues
              /*var header = document.createElement('DIV');
              var head = angular.element(header);
              head.html('<div  ng-include="&apos;views/templates/compound-table-header.html&apos;"></div>');
              var compiled = $compile(head.contents())(scope);
              $("#myid").prepend(compiled);   */           

              $('.btn-toggle').dropdown();
              scope.elem = $("#myid");

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

              scope.$on("updateListView", function(){redraw();});


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
        "warningsFilter" : "=",
        "searchformSchema": "=",
        "searchForm": "=",
        "showBlanks": "=",
        "showNonBlanks": "=",
        "messages": "=",
        "plugins": "=",
      }
    };
  }]);
