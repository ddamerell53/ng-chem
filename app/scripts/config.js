
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




var req = $http({  method: "get",
                    url: configuration.cbh_projects.list_endpoint,
                    params: {"schemaform": true, "limit":1000}, });
req.then(function(projData){
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



 


// var uis = angular.module('ui.select')

// .constant('uiSelectConfig', {
//   theme: 'bootstrap',
//   searchEnabled: true,
//   sortable: false,
//   placeholder: 'Choose...', // Empty by default, like HTML tag <select>
//   refreshDelay: 0, // In milliseconds
//   closeOnSelect: false,
//   generateId: function() {
//     return latestId++;
//   },
//   appendToBody: false
// });