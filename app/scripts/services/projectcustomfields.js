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
                    // var customFields = {"schemaform": {"form": ["Analytical Datasets", "Location", "Compound Handling Information", "Custom ID", "Yield"], "schema": {"required": ["Analytical Datasets", "Location"], "type": "object", "properties": {"Custom ID": {"placeholder": "The user's custom identifier", "type": "string", "title": "Custom ID"}, "Analytical Datasets": {"title": "Analytical Datasets", "items": [{"value": "H1 nmr", "label": "H1 nmr"}, {"value": "C13 nmr", "label": "C13 nmr"}, {"value": "HDMS", "label": "HDMS"}, {"value": "HPLC", "label": "HPLC"}, {"value": "Optical Rotation", "label": "Optical Rotation"}, {"value": "IR", "label": "IR"}, {"value": "MP", "label": "MP"}, {"value": "BP", "label": "BP"}], "format": "uiselect", "type": "array", "placeholder": "Check the boxes to say which data have been collected and annotated for this compound.", "options": {"taggingTokens": ",|ENTER", "taggingLabel": "(adding new)", "tagging": tagFunction}}, "Location": {"title": "Location", "items": [{"value": "", "label": ""}], "format": "uiselect", "type": "array", "placeholder": "Add tags to describe where the molecule is kept", "options": {"taggingTokens": ",|ENTER", "taggingLabel": "(adding new)", "tagging": tagFunction}}, "Yield": {"placeholder": "TEst", "minimum": 0.0, "type": "number", "maximum": 100.0, "title": "Yield"}, "Compound Handling Information": {"title": "Compound Handling Information", "items": [{"value": "", "label": ""}], "format": "uiselect", "type": "array", "placeholder": "Add tag to describe how to handle the compound", "options": {"taggingTokens": ",|ENTER", "taggingLabel": "(adding new)", "tagging": tagFunction}}}}}};
                     
                     var customFields = {};


                     if (data.data.objects.length==1){
                         customFields = data.data.objects[0];
                    //TODO tidy this up in the other repo!!!
                     var formData = customFields.schemaform.form.map(function(key){                 
                              if (angular.isDefined(key.options)){               
                                  if (angular.isDefined(key.options.tagging)){
                                      key.options.tagging=tagFunction;
                                    }
                              }
                              return key;
                            });
                     customFields.schemaform.form = formData;
                    }
                    console.log(data.data.objects.length);
                    return customFields;
                }
        );
        return promise;
    };
    return ProjectCustomFields;
});
