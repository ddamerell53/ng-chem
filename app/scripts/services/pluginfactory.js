'use strict';

/**
 * @ngdoc service
 * @name ngChemApp.PluginFactory
 * @description
 * # PluginFactory
 * Factory in the ngChemApp.
 */
angular.module('ngChemApp')
  .factory('PluginFactory', function ($resource, urlConfig) {
    // Service logic
    // ...

        return $resource(urlConfig.cbh_plugins.list_endpoint , { }, { });

  });
