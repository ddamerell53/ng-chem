'use strict';

/**
 * @ngdoc service
 * @name chembiohubAssayApp.LoginService
 * @description
 * # LoginService
 * Factory in the chembiohubAssayApp.
 */
angular.module('chembiohubAssayApp')
  .factory('LoginService', function ($resource,  urlConfig) {
    // Service logic
    // ...
    var LoginService = {}
    var urlBase =  urlConfig.users.list_endpoint;
    var myUrl = urlBase;


return $resource(myUrl );

   
    
  });
