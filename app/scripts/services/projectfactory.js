'use strict';

/**
 * @ngdoc service
 * @name ngChemApp.projectfactory
 * @description
 * # projectfactory
 * Factory in the ngChemApp.
 */
angular.module('ngChemApp')
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

    return $resource(urlConfig.cbh_projects.list_endpoint + '/:projectId', {projectId:'@projectId'}, {

        //define other methods here - name method, define extra params


        //for example
        //charge: {method:'POST', params:{charge:true}}

        //call from outside (i.e. inside a directive) with Project.$charge({amount:9.99});

      } 

    );


  });
