
'use strict';
var arr = window.location.href.split("/");
var part = "dev/api"
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
    "cbh_project_types": {"list_endpoint": path + 
    "cbh_project_types", "schema": path + "cbh_project_types/schema"},
    "cbh_permissions": {"list_endpoint": path + 
    "cbh_permissions", "schema": path + "cbh_permissions/schema"},
    "cbh_projects": {"list_endpoint": path + 
    "cbh_projects", "schema": path + "cbh_projects/schema"},
    "cbh_saved_search": {"list_endpoint":path + "cbh_saved_search", "schema": path + "cbh_saved_search/schema"},
    "cbh_plate_map": {"list_endpoint":path + "cbh_plate_map", "schema": path + "cbh_plate_map/schema"},
    "cbh_skinning": {"list_endpoint": path + 
    "cbh_skinning", "schema": path + "cbh_skinning/schema"}, 
    "cbh_compound_batches": {"list_endpoint": path + "cbh_compound_batches", "schema": path + "cbh_compound_batches/schema"},
    "cbh_compound_batches_v2": {"list_endpoint": path + "cbh_compound_batches_v2", "schema": path + "cbh_compound_batches_v2/schema"},
    "users": {"list_endpoint": path + "users", "schema": path + "users/schema"},
    "invitations": {"list_endpoint": path + "invitations", "schema": path + "invitations/schema"},
    "cbh_draft_data": {"list_endpoint": path + "datastore/cbh_draft_data", "schema": path + "datastore/cbh_draft_data/schema"},
    "cbh_multiple_batches": {"list_endpoint": path + "cbh_multiple_batches", "schema": path + "cbh_multiple_batches/schema"},
	  "cbh_chemical_search" :  {"list_endpoint": path + "cbh_chemical_search", "schema": path + "cbh_chemical_search/schema"},
  "instance_path" : {"url_frag": path, "base" : base, "bit": bit} ,

  "cbh_custom_field_configs": {"list_endpoint":path + "cbh_custom_field_configs", "schema": path + "cbh_custom_field_configs/schema"},
  "cbh_queries": {"list_endpoint":path + "cbh_queries", "schema": path + "cbh_queries/schema"},

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
var $q = initInjector.get("$q");

var $timeout = initInjector.get("$timeout");



var schemaGetter = function(project_data_fields){
            var edit_schema = { "type": "object", 'properties' : {}, 'required': [] };

                angular.forEach(project_data_fields, function(field){
                  angular.extend(edit_schema.properties, angular.copy(field.edit_schema.properties));
                  //ensure required fields are added to required
                  if (field.required){
                    edit_schema.required.push(field.name);
                  }
                });
            return edit_schema;
        };


var viewFormGetter = function(project_data_fields, htmlClass, project){
            if(!angular.isDefined(htmlClass)){
              htmlClass = "col-xs-12";
            }
            var view_form = [];
            angular.forEach(project_data_fields, function(field){
              var vform = angular.copy(field.view_form.form);
              view_form.push(vform);
            });
            return view_form
}


var formGetter = function(project_data_fields, htmlClass, project){
            if(!angular.isDefined(htmlClass)){
              htmlClass = "col-xs-12";
            }
            var edit_form = [];
            angular.forEach(project_data_fields, function(field){
              var form = angular.copy(field.edit_form.form[0]);
              form.htmlClass = htmlClass;
              
              edit_form.push(form);
            });
            return edit_form;
        }
        
angular.module('chembiohubAssayApp')
  .factory('CustomFieldConfig', function () {
    return {
        getSchema: schemaGetter,
        getForm: formGetter

    };
  });

var skinReq = $http({  method: "get",
                    url: configuration.cbh_skinning.list_endpoint
                  });



var projReq = $http({  method: "get",
                    url: configuration.cbh_projects.list_endpoint,
                    params: {"do_cache": true, "limit":1000, "project_type__saved_search_project_type": false, }, });

var userReq = $http({  method: "get",
                    url: configuration.users.list_endpoint,
                    params: {"limit":10000}, });



$q.all([skinReq, projReq, userReq]).then(function(data){
  var skinObj = data[0];
  var projData = data[1];
  var userData = data[2];
  skinObj.data.objects[0].tabular_data_schema = angular.copy(projData.data.tabular_data_schema);
  skinObj.data.objects[0].refresh_tabular_schema = function(){
    skinObj.data.objects[0].tabular_data_schema.copied_schema = angular.copy(skinObj.data.objects[0].tabular_data_schema.schema);
  }
  //Add a function to get a schema by name
  skinObj.data.objects[0].get_table_schema_by_name = function(name){
   
   var list_of_fields = skinObj.data.objects[0].tabular_data_schema.included_in_tables[name].default.map(function(item){
      return skinObj.data.objects[0].tabular_data_schema.copied_schema[item];
   });
   return list_of_fields;
  };

skinObj.data.objects[0].get_filtered_table_schema = function(name, selected_projects){

   var project_ids =  selected_projects.map(function(p){return p.id;});
   var schema = skinObj.data.objects[0].get_table_schema_by_name(name);
   var filtered = [];
   angular.forEach(schema, function(field){
      
      var push = false;
      //check that this field is used by one of the projects we have filtered down to
      if(field.project_specific_schema){
          angular.forEach(field.project_specific_schema, function(value, pid){
            
            if(project_ids.indexOf(parseInt(pid)) > -1){
              
              push = true
            }else if (project_ids.length == 0){
              //Assume all projects if none selected
              push = true
            }else{
            }
          });
      }else{
        push = true;
      }
      if(push){
        filtered.push(field);
      }

   });
   
   return filtered;
  };
  


  angular.module('chembiohubAssayApp').value('skinConfig',  
          skinObj.data
    );
  angular.module('chembiohubAssayApp').value('userList', userData.data.objects );
var login = null;
      angular.forEach(userData.data.objects, function(u){
          if(u.is_logged_in){
            login = u;
          }
      });
    angular.module('chembiohubAssayApp').value('loggedInUser',  
              login
     );
    
  angular.forEach(projData.data.objects, function(project){
        project.schemaform = {
          "form" : formGetter(project.custom_field_config.project_data_fields, "col-xs-12", project),
          "schema" : schemaGetter(project.custom_field_config.project_data_fields),
          "viewForm" : viewFormGetter(project.custom_field_config.project_data_fields)
        }
        
    });
      
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





angular.module('chembiohubAssayApp').constant('euiHost',  
   arr[0] + "//" + arr[2] + "/" + part + "/datastore"
);

angular.module('elasticsearch', [])
.factory('esFactory', ['$http', '$q', function ($http, $q) {
    return function (clientOpts) {
        return {
            search: function (searchOpts) {
                var deferredAbort = $q.defer();
                var defer = $q.defer();

                $http({
                    method: 'POST',
                    url: clientOpts.host + "/" + searchOpts.index + '/_search',
                    params: {
                        size: searchOpts.size,
                        from: searchOpts.from
                    },
                    data: searchOpts.body.toJSON(),
                    timeout: deferredAbort.promise
                }).then(
                  function (body) {
                      defer.resolve(body.data);
                  },
                  function () {
                      defer.reject.apply(this, arguments);
                  }
                );

                defer.promise.abort = function () {
                    deferredAbort.resolve();
                };

                // cleanup (http://stackoverflow.com/questions/24440177/angularjs-how-to-cancel-resource-promise-when-switching-routes)
                defer.promise.finally(function() {
                        defer.promise.abort = angular.noop;
                        deferredAbort = defer = null;
                    }
                );

                return defer.promise;
            }
        };
    };
}]);