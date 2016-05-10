'use strict';

/**
 * @ngdoc service
 * @name chembiohubAssayApp.ProjectFactory
 * @description
 * # ProjectFactory
 * Factory for providing convenient, parameterised access to the project related API endpoints ({@link https://github.com/thesgc/chembiohub_ws/wiki/Project-API cbh_projects}).
 * @param {object} $resource angular library for constructing webservice calls from URLs.
 * @param {object} urlConfig app config object containing aliases for all available web service endpoints.
 * @returns {object} $resource angular service containing access to the project list endpoint with custom PATCH alias (update).
 */
angular.module('chembiohubAssayApp')
  .factory('ProjectFactory' ,function ($resource, urlConfig) {

    //need to  - 
    //create a page which shows a list of projects available to the user
    //       /projects
    //this contains a directive showing the list which can accept filter parameters
    
    //Looking at a single project lists molecules which are associated with that project
    //       /project/:projectId
    var projUrl = "";

    return $resource(urlConfig.cbh_projects.list_endpoint + '/:projectId', {projectId:'@projectId'}, {
        'update': { method:'PATCH' }
    });


  });


