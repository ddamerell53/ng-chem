'use strict';

/**
 * @ngdoc service
 * @name ngChemApp.renderers
 * @description
 * # renderers
 * Factory in the ngChemApp.
 */
angular.module('ngChemApp')
  .factory('renderers', function ($timeout, $compile) {
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
                    }
                    a.innerHTML = "view";
                    a.href = escaped;
                    a.target = "_blank";
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
                var split = mol.project.split("/");
                var projid = split[split.length-1]; 
                angular.forEach(projects,function(myproj){
                    if(myproj.id == projid){
                      var toArchive = false ;
                      var escaped = "<button class='btn btn-success'><span class=' glyphicon glyphicon-ok'></span>&nbsp;Restore</button>";
                      if(value==null || value=="false" || value==false){
                          var escaped = "<button class='btn btn-danger'><span class='glyphicon glyphicon-remove'></span>&nbsp;Archive</button>";
                          toArchive = true;
                      }
                      var a = document.createElement('a');
                      a.innerHTML = escaped;
                      Handsontable.Dom.addEvent(a, 'mousedown', function (e){
                          // e.preventDefault(); // prevent selection quirk
                          mol.properties.archived=toArchive;
                          mol.projectKey= myproj.project_key;
                          scope.cbh.patchRecord(mol);
                      });
                      Handsontable.Dom.empty(td);
                      td.className  += "htCenter htMiddle";
                      td.appendChild(a);
                      return td;
                    }
                      
                  });

                
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
                    scope.cbh.openSingleMol(mol);
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
                  console.log(mol);
                  Handsontable.Dom.addEvent(button, 'mousedown', function (e){
                    e.preventDefault(); // prevent selection quirk
                    e.stopPropagation();
                    
                    
                    scope.cbh.openSingleMol(mol, false, prop);
                  
                  });
                  //if it IS a date, just open the date popup
                  /*Handsontable.Dom.addEvent(button, 'mousedown', function (e){
                    e.preventDefault(); // prevent selection quirk
                    e.stopPropagation();
                    
                    
                    //scope.cbh.openSingleMol(mol, false, prop);
                  
                  });*/
                }
                
                return td
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
                if(value==null){
                  return td;
                }
                var escaped = Handsontable.helper.stringify(value),
                  img;
                  img = document.createElement('IMG');
                  //if(value != "") {
                    img.src = value;
                    img.style.cursor = "pointer";
                  //}
                  //img.src = value;
              
                  Handsontable.Dom.addEvent(img, 'mousedown', function (e){
                    // e.preventDefault(); // prevent selection quirk
                    var mol = instance.getSourceDataAtRow(row);
                    scope.cbh.openSingleMol(mol, isNewCompoundsInterface);
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
        
        
        
        if(angular.isDefined(c.copyto)){
           return "<div class='well'><label style='min-width:240px'>"+ c.knownBy + c.copyto +  "</label></div>";

        }
        if(c.data.indexOf("uncurated")==0){
          return "<div class='well'><label style='min-width:240px'>"+ c.knownBy + " Unmapped</label></div>";

        }
       
        else{
          return "<div class='well'><label style='min-width:80px' >"+ c.knownBy + " un</label></div>";

        }

    //     var warningFilterHTML = "";
    //     if(c.warningsFilter){
    //       warningFilterHTML = renderFilter(scope.warningsFilter, c.data, "");
    //     }

    //     //Return a piece of html including an onclick event that
    //     //will pass to the appropriate function that mujst be implemented in the above controller
        
    //     return html
        
      },
      renderFilterLink : function(warningsFilter, fieldKey, title){
        return renderFilter(warningsFilter, fieldKey, title);
      }
      
    };
    return data;

  });
