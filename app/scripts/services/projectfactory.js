'use strict';

/**
 * @ngdoc service
 * @name chembiohubAssayApp.projectfactory
 * @description
 * # projectfactory
 * Factory in the chembiohubAssayApp.
 */
angular.module('chembiohubAssayApp')
  .factory('ProjectFactory' ,function ($resource, urlConfig) {
    // Service logic
    // ...

    /*var meaningOfLife = 42;

    // Public API here
    return {
      someMethod: function () {
        return meaningOfLife;
      }
    };*/

    //need to  - 
    //create a page which shows a list of projects available to the user
    //       /projects
    //this contains a directive showing the list which can accept filter parameters
    
    //Looking at a single project lists molecules which are associated with that project
    //       /project/:projectId
    var projUrl = "";

    return $resource(urlConfig.cbh_projects.list_endpoint + '/:projectId', {projectId:'@projectId'}, { });


  });


