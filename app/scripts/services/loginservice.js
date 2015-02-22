'use strict';

/**
 * @ngdoc service
 * @name ngChemApp.LoginService
 * @description
 * # LoginService
 * Factory in the ngChemApp.
 */
angular.module('ngChemApp')
  .factory('LoginService', ["$rootScope", "$http","urlConfig", function ($rootScope, $http, urlConfig) {
    // Service logic
    // ...
    var LoginService = {}
    var urlBase =  urlConfig.users.list_endpoint;

    var arr = window.location.href.split("/");
    var myUrl = arr[0] + "//" + arr[2] + urlBase + "/";
    // AppConfig.then(function (config) {
    //     conf = config;
    //     urlBase =  conf.urls.users.list_endpoint;
    //     myUrl = arr[0] + "//" + arr[2] + urlBase;
    // });




    LoginService.setLoggedIn = function() {
      //logged in logic

      var promise = $http.get( myUrl ).then(
            function(data){
                return data.data;
            }
        );
        return promise;

    }



    /*LoginService.isLoggedIn = function() {
      //$rootScope.logged_in_user = user;
      var loggedIn = false;
      console.log($rootScope.logged_in_user);
      if($rootScope.logged_in_user.id > 0) {
        loggedIn = true;
      }
      return loggedIn;
    }*/


    // Public API here
    return LoginService;

    
  }]);
