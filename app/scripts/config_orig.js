'use strict';//http://bahmutov.calepin.co/inject-valid-constants-into-angular.html
var configuration = {
    "cbh_batch_upload": 
    {"list_endpoint": "/newsite_ws/cbh_batch_upload", 
    "schema": "/newsite_ws/cbh_batch_upload/schema"}, 
    "cbh_compound_batches": 
    {"list_endpoint": "/newsite_ws/cbh_compound_batches", 
    "schema": "/newsite_ws/cbh_compoundbatches/schema"}, 
    "cbh_projects": {"list_endpoint": "/newsite_ws/cbh_projects", 
    "schema": "/newsite_ws/cbh_projects/schema"}, 
    "users": {"list_endpoint": "/newsite_ws/users", 
    "schema": "/newsite_ws/users/schema"}
}

angular.module('ngChemApp').value('urlConfig',  
  configuration
);
