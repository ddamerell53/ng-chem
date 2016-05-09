'use strict';

/**
 * @ngdoc service
 * @name chembiohubAssayApp.LoginService
 * @description
 * # LoginService
 * Not currently used BUT still imported in app.js config section - unused.
 * @deprecated
 */
angular.module('chembiohubAssayApp')
  .factory('LoginService', function ($resource,  urlConfig) {

    var LoginService = {}
    var urlBase =  urlConfig.users.list_endpoint;
    var myUrl = urlBase;


return $resource(myUrl );

   
    
  });
