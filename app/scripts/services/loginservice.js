'use strict';

/**
 * @ngdoc service
 * @name ngChemApp.LoginService
 * @description
 * # LoginService
 * Factory in the ngChemApp.
 */
angular.module('ngChemApp')
  .factory('LoginService', function ($resource,  urlConfig) {
    // Service logic
    // ...
    var LoginService = {}
    var urlBase =  urlConfig.users.list_endpoint;
    var myUrl = urlBase;


return $resource(myUrl );

   
    
  });
