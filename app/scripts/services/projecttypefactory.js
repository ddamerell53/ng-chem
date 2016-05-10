'use strict';

 /**
 * @ngdoc service
 * @name chembiohubAssayApp.ProjectType
 * @description
 * # ProjectType
 * Factory for providing convenient, parameterised access to the project type related API endpoints ({@link https://github.com/thesgc/chembiohub_ws/wiki/Project-Type-API cbh_project_types}).
 * @param {object} $resource angular library for constructing webservice calls from URLs.
 * @param {object} urlConfig app config object containing aliases for all available web service endpoints.
 * @returns {object} $resource angular service containing access to the project list endpoint with custom PATCH alias (update).
 */
angular.module('chembiohubAssayApp')
  .factory('ProjectTypeFactory',function ($resource, urlConfig) {

    return $resource(urlConfig.cbh_project_types.list_endpoint + '/:projectTypeId', {projectTypeId:'@projectTypeId'}, {
        'update': { method:'PATCH' }
    });


  });
