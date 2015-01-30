'use strict';

/**
 * @ngdoc service
 * @name ngChemApp.HTTPProject
 * @description
 * # HTTPProject
 * Factory in the ngChemApp.

 http://stackoverflow.com/questions/23968129/limiting-http-interceptor-to-specific-domain
 */
angular.module('ngChemApp')
  .factory('HTTPProject', ["$stateParams", function ($http, $stateParams) {
    // Service logic
    // ...

    function getAugmentedConfigData(cfg) {
        var config  = cfg || {};
        config.data = config.data || {};
        config.data.projectKey = $stateParams.projectKey;
        return config;
    }


 var serviceObj = {};

    // Create wrappers for methods WITHOUT data
    // ['delete', 'get', 'head', 'jsonp'].forEach(function (method) {
    //     serviceObj[method] = function (url, config) {
    //         var config = getAugmentedConfig(config);
    //         return $http[method](url, config);
    //     };
    // });

    // Create wrappers for methods WITH data
    ['delete', 'get', 'head', 'jsonp','post', 'put'].forEach(function (method) {
        serviceObj[method] = function (url, data, config) {
            var data = getAugmentedConfigData(data);
            return $http[method](url, data, config);
        };
    });

    return serviceObj;
    // Public API here
   
  }]);
