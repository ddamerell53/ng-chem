'use strict';

/**
 * @ngdoc service
 * @name chembiohubAssayApp.SkinningFactory
 * @description
 * # SkinningFactory
 * Factory for providing convenient, parameterised access to the skinning related API endpoints (cbh_skinning).
 * @param {object} $resource angular library for constructing webservice calls from URLs.
 * @returns {object} $resource angular service containing access to the skinning endpoint.
 */
angular.module('chembiohubAssayApp')
  .factory('SkinningFactory', function ($resource) {

    return $resource(urlConfig.cbh_skinning.list_endpoint , { }, { });

  });
