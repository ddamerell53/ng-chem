
'use strict';
var arr = window.location.href.split("/");
var part = "dev"
var bit =  "";
var admin_base = "/";


var base = arr[0] + "//" + arr[2]  ;
if (arr[2] != 'localhost:9000'){
	bit =  arr[3];
  part = bit + "/api";
  base = arr[0] + "//" + arr[2] + "/" + bit +"/";
}
else {
  admin_base = "http://localhost:8000/"
}
var path = arr[0] + "//" + arr[2] + "/" + part +"/";
var admin_url = admin_base + part;
var configuration = {
    "cbh_batch_upload": 
    {"list_endpoint": path + "cbh_batch_upload", 
    "schema": path + "cbh_batch_upload/schema"}, 
    "cbh_projects": {"list_endpoint": path + 
    "cbh_projects", "schema": path + "cbh_projects/schema"},
    "cbh_skinning": {"list_endpoint": path + 
    "cbh_skinning", "schema": path + "cbh_skinning/schema"}, 
    "cbh_compound_batches": {"list_endpoint": path + 
    "cbh_compound_batches", "schema": path + "cbh_compound_batches/schema"}, 
    "users": {"list_endpoint": path + "users", "schema": path + "users/schema"},
    "cbh_multiple_batches": {"list_endpoint": path + "cbh_multiple_batches", "schema": path + "cbh_multiple_batches/schema"},
	"instance_path" : {"url_frag": path, "base" : base, "bit": bit} ,

  "cbh_custom_field_configs": {"list_endpoint":path + "cbh_custom_field_configs", "schema": path + "cbh_custom_field_configs/schema",
  "cbh_queries": {"list_endpoint":path + "cbh_queries", "schema": path + "cbh_queries/schema"},

},
"admin": {"list_endpoint": admin_url}

};

angular.module('chembiohubAssayApp').value('urlConfig',  
  configuration
);

angular.module('chembiohubAssayApp').value('prefix',  
  part
);


var initInjector = angular.injector(["ng"]);

var $http = initInjector.get("$http");

var $timeout = initInjector.get("$timeout");

var req = $http({  method: "get",
                    url: configuration.cbh_projects.list_endpoint,
                    params: {"schemaform": true, "limit":1000}, });

var userReq = $http({  method: "get",
                    url: configuration.users.list_endpoint,
                    params: {"limit":1000}, });


userReq.then(function(userData){
  angular.module('chembiohubAssayApp').value('userList', userData.data.objects );
});

var schemaGetter = function(project_data_fields){
            var edit_schema = { "type": "object", 'properties' : {}, 'required': [] };
                angular.forEach(project_data_fields, function(field){
                  angular.extend(edit_schema.properties, angular.copy(field.edit_schema.properties));
                });
            return edit_schema;
        };


var formGetter = function(project_data_fields, htmlClass, project){
            if(!angular.isDefined(htmlClass)){
              htmlClass = "col-xs-3";
            }
            var edit_form = [];
            angular.forEach(project_data_fields, function(field){
              var form = angular.copy(field.edit_form.form[0]);
              form.htmlClass = htmlClass;
              if(angular.isDefined(form.options)){
    
                 if(angular.isDefined(form.options.async)){

                    
                    form.options.async.call =  function(schema, options, search) {
                    
                      var url = form.options.async.url + "?custom__field__startswith=" + search;
                      if(angular.isDefined(project)){
                        url += ("&custom_field=" + form.key);
                        url += ("&project__project_key__in=" + project.project_key);

                      }
                      return $http.get( url ).then( function(data){
                            

                            
                            if(form.permanent_items){
                              angular.forEach(form.permanent_items,function(item){
                                data.data.unshift(angular.copy(item));
                              });
                            }
                            if(search){
                              data.data.unshift({"isTag": true, "label": search + " (adding new)", "value": search});
                            }
                            var foundWords = [];
                            var deDuped = [];
                            data.data.reverse();
                            angular.forEach(data.data, function(d){
                                if(foundWords.indexOf(d.value) == -1){
                                  deDuped.push(d);
                                  foundWords.push(d.value);
                                }
                            });

                            // console.log(data)
                            return {"data" : deDuped};
                          
                          
                      });
                    }
                 }
              }
              edit_form.push(form);
            });
            return edit_form;
        }
angular.module('chembiohubAssayApp')
  .factory('CustomFieldConfig', function () {
    // Service logic
    // ...

    

    // Public API here
    return {
        getSchema: schemaGetter,
        getForm: formGetter

    };
  });

req.then(function(projData){
    angular.forEach(projData.data.objects, function(project){
        project.schemaform = {
          "form" : formGetter(project.custom_field_config.project_data_fields, "col-xs-6", project),
          "schema" : schemaGetter(project.custom_field_config.project_data_fields)
        }
        project.updateCustomFields = function(){
          
          $timeout(function(){
            project.recentlyUpdated = false;
          }, 1000);
          if (!project.recentlyUpdated){
            project.recentlyUpdated = true;
            angular.forEach(project.schemaform.form, function(item){
            if(angular.isDefined(item.options)){
              if (angular.isDefined(item.options.async)){
                  item.options.async.call({}, item.options, "").then(function(data){
                      project.schemaform.schema.properties[item.key].items = data.data;
                  });
              }
            }
          });
          }
        }
        // project.updateCustomFields();
        
    });

    
    angular.module('chembiohubAssayApp').value('loggedInUser',  
        projData.data.user
    );
    angular.module('chembiohubAssayApp').value('projectList',  
          projData.data
    );

     var projectKeys= projData.data.objects.map(function(item){
        return item.project_key;
    });
     window.projectKeys = projectKeys;
    window.projectUrlMatcher = "/{projectKey:" + projectKeys.join('|') + "}/";
    angular.element(document).ready(function() {
        angular.bootstrap(angular.element( document.querySelector( '#bodytest' ) ), ["chembiohubAssayApp"]);
    });
    });
var skin = $http({  method: "get",
                    url: configuration.cbh_skinning.list_endpoint
                  });
skin.then(function(skinObj){
  angular.module('chembiohubAssayApp').value('skinConfig',  
          skinObj.data
    );
})


angular.module('chembiohubAssayApp').constant('euiHost',  
   arr[0] + "//" + arr[2] + "/" + part + "/datastore"
);

