'use strict';

/**
 * @ngdoc service
 * @name ngChemApp.ProjectCustomFields
 * @description
 * # ProjectCustomFields
 * Factory in the ngChemApp.
 */
angular.module('ngChemApp')
  .factory('ProjectCustomFields', function ($http, urlConfig) {
    // Service logic
    // ...

    var ProjectCustomFields = {};
    ProjectCustomFields.query = function(projectKey,filters, tagFunction) {
        filters.projectKey = projectKey;
        filters.project__project_key = projectKey;
         var promise = $http( 
            {
                url: urlConfig.cbh_custom_field_configs.list_endpoint,
                method: 'GET',
                params: filters
            }
            ).then(
            function(data){
                var customFields = {}
                if (data.data.objects.length==1){
                    customFields = data.data.objects[0];
                    var formData = customFields.schemaform.form.map(function(key){
                          if (angular.isDefined(customFields.schemaform.schema.properties[key].options)){
                              if (angular.isDefined(customFields.schemaform.schema.properties[key].options.tagging)){
                                  return {
                                    "options": {   "tagging" : tagFunction,
                                              "taggingLabel": "(adding new)",
                                              "taggingTokens": ",|ENTER"

                                            },
                                        "key": key,
                                        "description" : customFields.schemaform.schema.properties[key].description
                                         }
                                      } 
                                }
                                return key;
                            }
                  );
                  customFields.schemaform.form = formData;
                }
                return customFields;
            }
        );
        return promise;
    };


    return ProjectCustomFields;
  });
