'use strict';

/**
 * @ngdoc service
 * @name chembiohubAssayApp.ProjectType
 * @description
 * # ProjectType
 * Factory in the chembiohubAssayApp.
 */
angular.module('chembiohubAssayApp')
  .factory('ProjectTypeFactory',function ($resource, urlConfig) {

    return $resource(urlConfig.cbh_project_types.list_endpoint + '/:projectTypeId', {projectTypeId:'@projectTypeId'}, {
        'update': { method:'PATCH' }
    });


  });
