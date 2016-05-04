'use strict';

/**
 * @ngdoc directive
 * @name chembiohubAssayApp.directive:handsoncompoundtablev2
 * @restrict 'E'
 * @description
 * # HandsOnCompoundTable
 */
angular.module('chembiohubAssayApp')
    .directive('handsoncompoundtablev2', ["$timeout", "$compile", "renderers", "$rootScope", "$filter", "$modal", "$window", function($timeout, $compile, renderers, $rootScope, $filter, $modal, $window) {
        return {
            template: '<div  ></div>',
            restrict: 'E',
            transclude: true,
            controller: ['$scope', function($scope){
                
            }],
            link: function preLink(scope, element, attrs) {
                var redraw;
                var jsonSchemaColDefs;
               

                function buildButton(col) {
                    var button = document.createElement('a');
                    var inactiveStr = "";

                    if (col.noSort) {
                        inactiveStr = " lightgrey"
                        button.innerHTML = 'search∙hide';
                    }else{
                        button.innerHTML = 'search∙sort∙hide';
                    }

                    
                    button.className = ' btn btn-default tableFilter';
                    button.style["padding"] = "2px";

                    return button;
                }

                function buildInfoSpans(col) {

                    var mappingOptions = document.createElement('span');
                    if (col.mappingOptions && !col.copyto) {
                        mappingOptions.className = 'pull-right alert-danger'
                        mappingOptions.style.marginRight = "20px;"
                        mappingOptions.innerHTML = 'Unmapped <info-box lookup="unmapped_values_written" lookupitems="cbh.messages" right="true"></info-box>'
                    } else if (col.mappingOptions && col.copyto) {
                        var automappedSpan = '<span></span>';
                        if (col.automapped == true) {
                            automappedSpan = '<span>(auto)</span>';
                        }
                        mappingOptions.className = 'pull-right alert-success'
                        mappingOptions.style.marginRight = "20px;"
                        mappingOptions.innerHTML = '<span class="glyphicon glyphicon-arrow-right"></span>' + col.copyto + automappedSpan + '<info-box lookup="mapped_values_written" lookupitems="cbh.messages" right="true"></info-box></span>';
                    }

                    return mappingOptions;
                }

                


                function addButtonMenuEvent(button, col, TH) {
                    col.TH = TH;
                    Handsontable.Dom.addEvent(button, 'click', function(event) {
                        //Cancel any existing showfilters flags so we dont get two highlighted columns

                        scope.cbh.sendToSearch(col); 

                        // 
                        angular.forEach($(TH).siblings(), function(el){
                            $timeout(function(){
                                el.style["background"] = "";
                                el.style["color"] = "";
                            })
                        });
                        TH.style["background"] = "linear-gradient(lightcyan, #eee)";
                        TH.style["color"] = "#002147";


                        event.preventDefault();
                        event.stopImmediatePropagation();

                    });
                    if(col.showFilters){
                        
                        $timeout(function(){
                            angular.forEach($(TH).siblings(), function(el){
                            
                                el.style["background"] = "";
                                el.style["color"] = "";
                            
                             });
                            TH.style["background"] = "linear-gradient(lightcyan, #eee)";
                            TH.style["color"] = "#002147";
                        });
                        
                    }
                }
                 

                redraw = function() {
                     var rend = renderers.getRenderers(scope, isNewCompoundsInterface);
                     var allCols = [];

                    angular.forEach(scope.cbh.tabular_data_schema, function(c) {
                        if (angular.isDefined(c.renderer_named)) {
                            if(angular.isDefined(rend[c.renderer_named])){
                                c.renderer = rend[c.renderer_named];
                            }

                        }
                        if(angular.isDefined(c.project_specific_schema)){
                            angular.forEach(c.project_specific_schema, function( schem, pid){
                                if(angular.isDefined(rend[schem.renderer_named])){
                                    schem.renderer = rend[schem.renderer_named]
                                }

                            })
                        }
                        
                        //Provided we are in edit mode or newcompoundsinterface then 
                        //make the editable cells not readonly
                        //On the new compounds interface then this will work for the 
                        //action item

                        if(c.editable && (scope.cbh.editMode || isNewCompoundsInterface)){
                            c.readOnly = false;
                        }else{
                            c.readOnly = true;
                        }
                        if(c.hide != "hide"){
                            if(c.knownBy == "Clone" && scope.cbh.editMode){
                                //nothing
                            }else{
                                allCols.push(c);
                            }
                        }

                        
                    });

                	//find element with class hot-loading
                	

                	//then hide at the end

                    jsonSchemaColDefs = [];
                    var isNewCompoundsInterface = false;
                    if (angular.isDefined(scope.uncuratedHeaders)) {
                        isNewCompoundsInterface = true;
                        if (scope.cbh.fileextension == "xlsx") {
                            //SMiles option only for excel files
                            jsonSchemaColDefs = [{
                                "title": "SMILES for chemical structures",
                                "type": "chemical"
                            }];

                        }

                    }

                    var count = 0;
                    var cNames = [];
                    var projects = scope.cbh.projects.objects;
                    var showCompounds = false;
                    var columnHeaders = allCols.map(function(c) {
                        return renderers.getColumnLabel(c, scope);
                    });
                    var hotObj = {
                        data: scope.compounds,
                        colHeaders: columnHeaders,
                        columns: allCols,
                        //there is a minCols parameter to force rendering of all possible columns
                        //seems to be a known issue where some rows do not have data populated in every column
                        //so we can force-set the minimum number of columns to be the length of the allCols item
                        //https://github.com/handsontable/handsontable/issues/3008
                        minCols: allCols.length,

                        //afterGetColHeader is a function that is called when the html of the header has already been set
                        //which allows DOM manipulation after the TH has been created
                        //there are lots of useful hooks provided by Handsontable
                        //http://docs.handsontable.com/0.15.0-beta3/Hooks.html
                        afterGetColHeader: function(col, TH) {

                            var instance = this,
                                button = buildButton(allCols[col]),
                                infospans = buildInfoSpans(allCols[col]);

                            addButtonMenuEvent(button, allCols[col], TH);
                            while (TH.firstChild.lastChild != TH.firstChild.firstChild) {
                                    TH.firstChild.removeChild(TH.firstChild.lastChild);

                                }
                            var br = document.createElement('br');
                            TH.firstChild.appendChild(br);
                            TH.firstChild.appendChild(button);
                            TH.firstChild.appendChild(infospans);
                            TH.style['white-space'] = 'normal';
                        },
                        maxRows: scope.compounds.length,
                        renderAllRows: true,
                        fillHandle: "vertical",
                        height: 600,
                    }
                    if (isNewCompoundsInterface) {
                        hotObj.afterChange = function(data, sourceOfChange) {
                            scope.cbh.saveChangesToTemporaryDataInController(data, sourceOfChange);
                        };
                        //removing hotobj.cells to allow users to override Ignore and register molecules as a batch, even if it has no structure.
                        //put a warning in the structure column if this is the case.

                    } else {

                        hotObj.afterChange = function(data, sourceOfChange) {
                            scope.cbh.saveChangesToCompoundDataInController(data, sourceOfChange);
                        };
                        hotObj.beforeAutofill = function(start, end, data) {
                            for (var colNo = start.col; colNo <= end.col; colNo++) {
                                if (allCols[colNo].field_type == "uiselecttags") {
                                    for (var rowNo = start.row; rowNo <= end.end; rowNo++) {

                                    }
                                } else if (allCols[colNo].knownBy == "Archive/Restore") {

                                    var projects = scope.cbh.projects.objects;
                                    var rowOne = start.row;
                                    var firstMol = this.getSourceDataAtRow(rowOne);

                                    //get the existing HTML of the cell using this.getCell(rowOne, colNo)
                                    var firstCell = this.getCell(rowOne - 1, colNo);
                                    var firstValueArchived = false;

                                    //does it have a danger class? If so, make the html of the subsequent cells the Archive button
                                    //might need to change this to traverse the DOM and find if the button has the success class
                                    // td > a > button
                                    var firstCellButton = firstCell.children[0].children[0];
                                    if (firstCellButton.className == 'btn btn-success') {
                                        var firstValueArchived = true;
                                    }
                                    
                                    for (var rowNo = start.row; rowNo <= end.row; rowNo++) {
                                        var cellAtRow = this.getCell(rowNo, colNo);
                                        var cellLink = cellAtRow.children[0];
                                        var mol = this.getSourceDataAtRow(rowNo);
                                        var split = mol.project.split("/");
                                        var projid = split[split.length - 1];

                                        if (firstValueArchived && cellLink.children[0].className == ('btn btn-danger')) {
                                            
                                            cellLink.innerHTML = "<button class='btn btn-success btn-xs'><span class=' glyphicon glyphicon-ok'></span>&nbsp;Restore</button>"
                                            mol.toArchive = true;
                                            mol.properties.archived = true;
                                            cellLink.click();
                                        } else if (!firstValueArchived && cellLink.children[0].className == ('btn btn-success')) {
                                            
                                            cellLink.innerHTML = "<button class='btn btn-danger btn-xs'><span class='glyphicon glyphicon-remove'></span>&nbsp;Archive</button>";
                                            mol.toArchive = false;
                                            mol.properties.archived = false;
                                            cellLink.click();
                                        }

                                    };
                                }
                            }


                        };

                    }

                   
                    var container1,
                        hot1;

                    var container = document.createElement('DIV');
                    container.className = container.className + ' handsontable';


                    while (element[0].firstChild) {
                        element[0].removeChild(element[0].firstChild);
                    }


                    element[0].appendChild(container);
                    var hot1 = new Handsontable(container, hotObj);
                    // hot1.populateFromArray = renderers.getPopulateFromArray(hot1);
                    var id = element[0].firstChild.id;
                    scope.hotId = "#" + id;
                    var elem = $(scope.hotId);

                    elem.wrap("<div id='myid' ></div>");

                    $('.btn-toggle').dropdown();
                    scope.elem = $("#myid");


                    scope.hot1 = hot1;
                	
                	
                	$timeout(function(){
                	  var el = document.querySelector('.hot-loading');
					  var angElement = angular.element(el);
                      angElement.removeClass("now-showing");
                      //scope.$apply()
                    });
                	

                }
                scope.$watch("redraw", function(newValue, oldValue) {
                    redraw();
                }, true);

                scope.$on("updateListView", function() {
                    redraw();
                });


            },

            //filterFunction and column are to provide the ability to pass in
            //what the filter action on the table header should do and also
            //pass the column selected to the scope where the directive is placed, 
            //rather than an internally generated modal
            scope: {
                "redraw": "=",
                "compounds": "=",
                "cbh": "=",
                "uncuratedHeaders": "=",
                "columns": "=",
                "messages": "=",
                "plugins": "=",
            }
        };
    }]);