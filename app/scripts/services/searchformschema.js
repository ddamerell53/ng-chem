'use strict';

/**
 * @ngdoc service
 * @name ngChemApp.SearchFormSchema
 * @description
 * # SearchFormSchema
 * Factory in the ngChemApp.
 */
angular.module('ngChemApp')
  .factory('SearchFormSchema', [ 'ProjectFactory', '$q', function (ProjectFactory, $q) {
    // Service logic
    // ...
    function getProjects() {
      var defer = $q.defer();

      ProjectFactory.get().$promise.then(function(res) {
        
        defer.resolve(res.objects);
            
      });
      return defer.promise;
    }

    // Public API here
    return {

      //this returns the form schema for the main search page. We can use this factory for other search forms schemas?
      getMainSearch: function () {
        var defer = $q.defer();
        var schemaform = {
                                "form": [
                                    {
                                      "key": "project",
                                      "placeholder": "Check the console",
                                      "onChange": "getSearchCustomFields()",
                                      //"feedback": "{'glyphicon': true, 'glyphicon-ok': hasSuccess(), 'glyphicon-star': !hasSuccess() }"
                                      "feedback": false,
                                      "titleMap": {
                                        
                                      }
                                    },
                                    {
                                      "key": "dateStart",
                                      "minDate": "2004-01-01"
                                    },
                                    {
                                      "key": "dateEnd",
                                      "minDate": "2004-01-01"
                                    },
                                    {
                                      "key": "smiles",
                                      "placeholder": "Search SMILES string",
                                      "append": "today",
                                      "feedback": false,
                                    },
                                    {
                                      "key": "strucOpt",
                                      "style": {
                                        "selected": "btn-success",
                                        "unselected": "btn-default"
                                      },
                                      "type": "radiobuttons",
                                      "titleMap": [
                                        {
                                          "value": "with_substructure",
                                          "name": "Substructure",
                                        },
                                        {
                                          "value": "flexmatch",
                                          "name": "Exact Match"
                                        }
                                      ]
                                    },
                                ],
                                "schema": {
                                    "required": [
                                      //none required for search form
                                    ],
                                    "type": "object",
                                    "properties": {
                                                    "project": {
                                                      "title": "Project",
                                                      "type": "string",
                                                      "enum": [
                                                        
                                                      ]
                                                    },

                                                    "dateStart": {
                                                      "title": "From",
                                                      "type": "string",
                                                      "format": "date"
                                                    },

                                                    "dateEnd": {
                                                      "title": "To",
                                                      "type": "string",
                                                      "format": "date"
                                                    },

                                                    "smiles": {
                                                      "title": "SMILES",
                                                      "type": "string",
                                                    },

                                                    "strucOpt": {
                                                      "title": "Structural search type",
                                                      "type": "string",
                                                      "enum": [
                                                        "with_substructure",
                                                        "flexmatch"
                                                      ]
                                                    },

                                                    /*"Compound Handling Information": {
                                                        "title": "Compound Handling Information",
                                                        "items": [
                                                            {
                                                                "value": "",
                                                                "label": ""
                                                            }
                                                        ],
                                                        "format": "uiselect",
                                                        "type": "array",
                                                        "placeholder": "Add tag to describe how to handle the compound",
                                                        "options": {
                                                            "taggingTokens": ",|ENTER",
                                                            "taggingLabel": "(adding new)",
                                                            "tagging": tagFunction
                                                        }
                                                    }*/
                                    }
                                }
                            
                        }

        getProjects().then(function(projects){
          
               angular.forEach(projects, function(project) {
                
                //add the key to the schema enum for project
                //console.log(project);
                schemaform.schema.properties.project.enum.push(project.project_key)


                //add the key and the label to the form titlemap for project
                angular.forEach(schemaform.form, function(obj){
                  if (obj['key'] == "project") {
                    obj.titleMap[project.project_key] = project.name;
                  }
                }); 

                //defer.resolve(schemaform);
                
              });

              defer.resolve(schemaform);

        });

        return defer.promise;
        
      }
    };
  }]);
