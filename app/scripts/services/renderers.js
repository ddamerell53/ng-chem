'use strict';

/**
 * @ngdoc service
 * @name chembiohubAssayApp.renderers
 * @description
 * # renderers
 * Factory in the chembiohubAssayApp.
 */
angular.module('chembiohubAssayApp')
  .factory('renderers', function ($timeout, $compile, $state, $rootScope, sfPath, sfSelect) {
    // Service logi
    // ...
    function strip_tags(input, allowed) {
                var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
                  commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
              
                // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
                allowed = (((allowed || "") + "").toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join('');
              
                return input.replace(commentsAndPhpTags, '').replace(tags, function ($0, $1) {
                  return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
                });
    };

    function renderFilter(warningsFilter, fieldKey, title){
              var className = "lightgrey";
            if(warningsFilter == fieldKey){
              className = "blue";
            }
            return '<a class="btn btn-sm btn-default" title="' + title + '" onclick="angular.element(this).scope().cbh.toggleWarningsFilter(&quot;' + fieldKey + '&quot;)" ><span class="glyphicon glyphicon-filter ' + className + ' " ></span></a>';
    }

    // Public API here
    var data = {
        getRenderers: function(sco, isNewCompounds){
        var scope;
        var isNewCompoundsInterface = isNewCompounds;
        var defaultCustomFieldRenderer = function(instance, td, row, col, prop, value, cellProperties) {
                td = linkrend(instance, td, row, col, prop, value, cellProperties);
                
                if(cellProperties.readOnly == false){
                  td.className  += " gallery-item";
                  var holderRow = document.createElement("div");
                  holderRow.className += "row"

                  var button = document.createElement("div");
                  //button.className ="row";
                  button.innerHTML = "<button class='btn btn-xs btn-default pull-right' style='positon:top' title='Edit'><span class='glyphicon glyphicon-pencil'></span></button>"
                  td.firstChild.className += ' col-xs-12';
                  //td.firstChild.style = 'margin-bottom:10px;';

                  //td.insertBefore( button, td.firstChild );
                  $(button).appendTo($(holderRow));
                  $(td.firstChild).css('margin-bottom', '18px').appendTo($(holderRow));

                  $(holderRow).appendTo($(td));

                  var mol = instance.getSourceDataAtRow(row);
                  //is this a date?
                  //if not, open the row editor as normal
                  Handsontable.Dom.addEvent(button, 'mousedown', function (e){
                    e.preventDefault(); // prevent selection quirk
                    e.stopPropagation();
                    
                    
                    scope.cbh.openSingleMol(mol, false, prop);
                  
                  });

                }
                
                return td
              };

          var  emptyCustomFieldRenderer = function(instance, td, row, col, prop, value, cellProperties) {
               
                td.innerHTML = "";
                td.title = "This field is not configured for this project or is restricted.";
                td.className = "htCenter htMiddle lightgreybackground";
                return td;

              }

        var linkrend = function(instance, td, row, col, prop, value, cellProperties) {
               var escaped = Handsontable.helper.stringify(value);
                escaped = strip_tags(escaped, '');
                if (cellProperties.field_type == 'href'){
                    var a = document.createElement('a');
                    if(escaped.length > 0){
                      if(escaped.substring(1,1) ==":"){
                        //assume a file link
                        escaped = "file://" + escaped;
                      }
                       a.innerHTML = "view";
                    a.href = escaped;
                    a.target = "_blank";
                    }
                   
                    Handsontable.Dom.empty(td);
                    td.className  += "htCenter htMiddle ";
                    td.appendChild(a);
                }
                else if (cellProperties.field_type == 'imghref'){
                    var a = document.createElement('a');
                    if(escaped.length > 0){
                      if(escaped.substring(1,1) ==":"){
                        //assume a file link
                        escaped = "file://" + escaped;
                      }
                       a.innerHTML = "view";
                      a.href = escaped;
                      a.target = "_blank";
                    }
                   
                    Handsontable.Dom.empty(td);
                    td.className  += "htCenter htMiddle ";
                    var i = document.createElement('img');
                    i.src = escaped;
                    i.className="img-responsive";
                    td.appendChild(i);
                    td.appendChild(a);
                    td.setAttribute("style", "min-height:100px;min-width:100px;max-width:100px");
                }
                else if (escaped.indexOf("http") == 0 && escaped.indexOf("//") > 0){

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
                  td.className  += " htMiddle ";
                  if(prop == "standardInchiKey"){
                    td.innerHTML = escaped.substring(0,10) +"...";
                    cellProperties.readOnly = true;
                  }else{
                     td.innerHTML = '<div class="">' + escaped + '</div>';
                  }
                }
                
                return td;
              };
        
        var renderers = {
              infoRenderer : function(instance, td, row, col, prop, value, cellProperties) {
                var mol = instance.getSourceDataAtRow(row);
                var html = "<ul class='noindent'>";
                 var errors = [["parseError", "<li ><span class='alert-danger'>Data not processable</span></li>"],
                 ["smilesParseError", "<li ><span class='alert-danger'>SMILES not processable: </span><br><small class='blue'>SMILESHERE</small></li>"],
                 ["inchiCreationError", "<li ><span class='alert-danger'>Could not generate InChi: </span><br><small class='blue'>SMILESHERE</small></li>"],
                    ["duplicate", "<li ><span class='alert-warning'>Duplicated record</span></li>"],
                    ["new", "<li ><span class='alert-success'>New</span></li>"],
                    ["overlap", "<li ><span class='alert-info'>Overlap</span></li>"]];
                  angular.forEach(errors, function(e){
                    if (angular.isDefined(mol.warnings[e[0]])){
                      html += e[1];
                    }
                  });
                  html += "</ul>"
                      td.className  += " htMiddle ";

                  td.innerHTML = html.replace("SMILESHERE", mol.originalSmiles);
                return td;
              },

              centeredNumericRenderer : function(instance, td, row, col, prop, value, cellProperties) {
                /*var escaped = Handsontable.helper.stringify(value);
                escaped = strip_tags(escaped, '<em><b><strong><a><big>'); //be sure you only allow certain HTML tags to avoid XSS threats (you should also remove unwanted HTML attributes)
                td.innerHTML = escaped;
              */
                Handsontable.renderers.TextRenderer.apply(this, arguments);
                cellProperties.type = "numeric"
                cellProperties.format = "0.00"
                td.className = "htCenter htMiddle";
                return td;

              },



              
               safeHtmlRenderer : function(instance, td, row, col, prop, value, cellProperties) {
                var escaped = Handsontable.helper.stringify(value);
                escaped = strip_tags(escaped, '<em><b><strong><a><big>'); //be sure you only allow certain HTML tags to avoid XSS threats (you should also remove unwanted HTML attributes)
                td.innerHTML = escaped;
              
                return td;
              },

              archivedRenderer : function(instance, td, row, col, prop, value, cellProperties) {
                var projects = scope.cbh.projects.objects;
                var mol = instance.getSourceDataAtRow(row);
                cellProperties.readOnly = false;
                var toArchive = false ;
                      var escaped = "<button class='btn btn-success btn-xs'><span class=' glyphicon glyphicon-ok'></span>&nbsp;Restore</button>";
                      if(value==null || value=="false" || value==false){
                          var escaped = "<button class='btn btn-danger btn-xs'><span class='glyphicon glyphicon-remove'></span>&nbsp;Archive</button>";
                          toArchive = true;
                      }
                  var myproj = scope.cbh.projAddingTo;
                    
                      
                      var a = document.createElement('a');
                      a.innerHTML = escaped;
                      Handsontable.Dom.addEvent(a, 'click', function (e){
                          e.preventDefault(); // prevent selection quirk
                          mol.properties.archived=toArchive;
                          value=toArchive;
                          mol.projectKey= mol.projectfull.project_key;
                          scope.cbh.patchRecord(mol);
                      });
                      Handsontable.Dom.empty(td);
                      td.className  += "htCenter htMiddle";
                      td.appendChild(a);
                      td.style.padding = "5px";
                      return td;
                    
              },

               cloneRenderer : function(instance, td, row, col, prop, value, cellProperties) {
                  var mol = instance.getSourceDataAtRow(row);
                     
                if(scope.cbh.projAddingTo && ! scope.cbh.editMode){
                   var toArchive = false ;
                      
                      var escaped = "<button class='btn btn-primary btn-xs'><span class=' glyphicon glyphicon-duplicate'></span>&nbsp;" + mol.projectfull.project_type.copy_action_name + "</button>";
                      var a = document.createElement('a'); 
                     a.innerHTML = escaped;
                      
                      Handsontable.Dom.addEvent(a, 'click', function (e){
                          e.preventDefault(); // prevent selection quirk
                          if(scope.cbh.projAddingTo.project_type.show_compounds){
                              //If this is a compounds project redirect to compound clone page
                              $state.go("cbh.projects.project.addsingle",{"projectKey" : scope.cbh.projAddingTo.project_key, "idToClone": mol.id} , { reload: true });
                          }else{
                            scope.$apply(function(){
                              $rootScope.$broadcast("cloneAnItem", mol)
                            });
                              
                          }

                      });
                      Handsontable.Dom.empty(td);
                      td.className  += "htCenter htMiddle";
                      td.appendChild(a);
                      td.style.padding = "5px";
                      return td;
                }else{
                var escaped = "<button disabled class='btn btn-primary btn-xs'><span class=' glyphicon glyphicon-duplicate'></span>&nbsp;" + mol.projectfull.project_type.copy_action_name + "</button>";

                  var a = document.createElement('a');
                  a.innerHTML = escaped;
                  Handsontable.Dom.empty(td);
                  td.className  += "htCenter htMiddle";
                  a.title = "Select single editable project to clone";
                  if(scope.cbh.editMode){
                    a.title = "Select single editable project and turn off edit mode to clone";
                  }
                  td.appendChild(a);
                  td.className  += "htCenter htMiddle";
                  td.style.padding = "5px";
                  return td;
                }
                

                
              },
              modalLinkRenderer : function(instance, td, row, col, prop, value, cellProperties) {
                if(value==null){
                  return td;
                }
                var escaped = Handsontable.helper.stringify(value);
                escaped = strip_tags(escaped, ''); //be sure you only allow certain HTML tags to avoid XSS threats (you should also remove unwanted HTML attributes)
                var a = document.createElement('a');
                a.innerHTML = escaped;
                Handsontable.Dom.addEvent(a, 'mousedown', function (e){
                    // e.preventDefault(); // prevent selection quirk
                    var mol = instance.getSourceDataAtRow(row);
                    //scope.cbh.openSingleMol(mol);
                    $state.go($state.current.name + '.record', {'uniqId': mol.id});
                });
                Handsontable.Dom.empty(td);
                td.className  += "htCenter htMiddle courier";
                td.appendChild(a);
              
                return td;
              },
               projectRenderer: function(instance, td, row, col, prop, value, cellProperties){
                var mol = instance.getSourceDataAtRow(row);
                //we have a list of projects - find the right one and render the name

                  //angular.forEach(scope.compounds, function(comp){
                    var split = mol.project.split("/");
                    var projid = split[split.length-1]; 
                    
                    
                    
                  //});

                  var projects = scope.cbh.projects.objects;

                  angular.forEach(projects,function(myproj){

                    
                    if(myproj.id == projid){
                      Handsontable.Dom.empty(td);
                      td.innerHTML = myproj.name;
                      td.className  += "htCenter htMiddle";
                      return td
                    }
                      
                  });

              },
  
               linkRenderer : linkrend,
  
              customFieldRenderer: function(instance, td, row, col, prop, value, cellProperties) {
                /* differentiate different renderer type for custom field */
                var mol = instance.getSourceDataAtRow(row);
                var projects = scope.cbh.projects.objects;

                if(cellProperties.project_specific_schema[mol.projectfull.id]){
                  var projSpecificRenderer = cellProperties.project_specific_schema[mol.projectfull.id].renderer;

                  if(projSpecificRenderer){
                    return projSpecificRenderer(instance, td, row, col, prop, value, cellProperties);
                  }else{
                    return defaultCustomFieldRenderer(instance, td, row, col, prop, value, cellProperties);
                  }
                }
                return emptyCustomFieldRenderer(instance, td, row, col, prop, value, cellProperties);

                
              },
              defaultCustomFieldRenderer: defaultCustomFieldRenderer,
              fileUploadRenderer: function(instance, td, row, col, prop, value, cellProperties){
                //build an unordered, unstyled list
                
                console.log('prop',prop);
                console.log('cellProperties',cellProperties);
                var mol = instance.getSourceDataAtRow(row);

                var dataLoc = cellProperties.prop;
                var path = sfPath.normalize(dataLoc);
                var field_obj = sfSelect(path, mol);


                var htmllist = "<ul class='list-unstyled'>"
                /*angular.forEach(field_obj.attachments, function(attc){
                  htmllist += "<li>" + attc. + " files</li>";
                });*/
                if(field_obj.attachments.length == 1){
                  htmllist += "<li class='text-success'>1 file</li>";
                }
                else if(field_obj.attachments.length == 0){
                  htmllist += "<li class='text-danger'>no files</li>";
                }
                else {
                  htmllist += "<li class='text-success'>" + field_obj.attachments.length + " files</li>";
                }
                htmllist += "</ul>"
                td.className  += "htCenter htMiddle ";
                td.innerHTML = htmllist;
                return td;
              },
              bulletRenderer:  function(instance, td, row, col, prop, value, cellProperties) {
                var classN = "glyphicon glyphicon-unchecked";
                
                if(value=="true"){
                  classN = "glyphicon glyphicon-check";
                }
                td.className = "htCenter htMiddle htDimmed";
                td.innerHTML = "<h2 class='blue'><span class='"+ classN + "'></span></h2>";
                cellProperties.readOnly = true;
                return td
              },

               coverRenderer : function(instance, td, row, col, prop, value, cellProperties) {
                if(value==null  || value===""){
                  td.innerHTML = "No Image";
                  td.className  += "htCenter htMiddle ";
                  Handsontable.Dom.addEvent(td, 'mousedown', function (e){
                    var mol = instance.getSourceDataAtRow(row);
                    $state.go($state.current.name + '.record', {'uniqId': mol.id});
                  });
                  return td;
                }
                var escaped = Handsontable.helper.stringify(value),
                  img;
                  img = document.createElement('IMG');
                  //if(value != "") {
                    img.src = "data:image/png;base64," + value;
                    img.style.cursor = "pointer";
                    img.style.width = "85px";
                  //}
                  //img.src = value;
              
                  Handsontable.Dom.addEvent(img, 'mousedown', function (e){
                    // e.preventDefault(); // prevent selection quirk
                    var mol = instance.getSourceDataAtRow(row);
                    $state.go($state.current.name + '.record', {'uniqId': mol.id});
                  });
              
                  Handsontable.Dom.empty(td);
                  td.className  += "htCenter htMiddle ";

                  td.appendChild(img);
                
                return td;
              }};
        scope = sco;
        return renderers;
      },
    

      getColumnLabel : function(c, scope){
        
        
        return "<label style='min-width:80px' >"+ c.knownBy + "</label>";
        
      },
      renderFilterLink : function(warningsFilter, fieldKey, title){
        return renderFilter(warningsFilter, fieldKey, title);
      }
      
    };


    return data;

  });
