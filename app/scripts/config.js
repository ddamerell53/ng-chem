
'use strict';
var arr = window.location.href.split("/");
var part = "dev"
var bit =  "";

var base = arr[0] + "//" + arr[2]  ;
if (arr[2] != 'localhost:9000'){
	bit =  arr[3];
  part = bit + "/api";
  base = arr[0] + "//" + arr[2] + "/" + bit +"/";
}
var path = arr[0] + "//" + arr[2] + "/" + part +"/";

var configuration = {"cbh_batch_upload": 
    {"list_endpoint": path + "cbh_batch_upload", 
    "schema": path + "cbh_batch_upload/schema"}, 
    "cbh_projects": {"list_endpoint": path + 
    "cbh_projects", "schema": path + "cbh_projects/schema"}, 
    "cbh_compound_batches": {"list_endpoint": path + 
    "cbh_compound_batches", "schema": path + "cbh_compound_batches/schema"}, 
    "users": {"list_endpoint": path + "users", "schema": path + "users/schema"},
	"instance_path" : {"url_frag": path, "base" : base} ,
  "cbh_custom_field_configs": {"list_endpoint":path + "cbh_custom_field_configs", "schema": path + "cbh_custom_field_configs/schema"},

};

angular.module('ngChemApp').value('urlConfig',  
  configuration
);

angular.module('ngChemApp').value('prefix',  
  part
);


var initInjector = angular.injector(["ng"]);

var $http = initInjector.get("$http");


$http.get(configuration.users.list_endpoint).then(function(users){
    angular.module('ngChemApp').value('loggedInUser',  
        users.data.objects[0]
    );
    var req = $http({  method: "get",
                        url: configuration.cbh_projects.list_endpoint,
                        params: {"schemaform": true}, });
    req.then(function(projData){
        console.log(projData.data);
        angular.module('ngChemApp').value('projectList',  
              projData.data
        );

         var projectKeys= projData.data.objects.map(function(item){
            return item.project_key;
        });
        window.projectUrlMatcher = "/{projectKey:" + projectKeys.join('|') + "}/";
        angular.element(document).ready(function() {
            angular.bootstrap(angular.element( document.querySelector( '#bodytest' ) ), ["ngChemApp"]);
        });
    });
});




 


