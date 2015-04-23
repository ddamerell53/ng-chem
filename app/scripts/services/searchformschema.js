'use strict';

/**
 * @ngdoc service
 * @name ngChemApp.SearchFormSchema
 * @description
 * # SearchFormSchema
 * Factory in the ngChemApp.
 */
angular.module('ngChemApp')
  .factory('SearchFormSchema', function () {
    // Service logic
    // ...

    

    // Public API here
    return {

      //this returns the form schema for the main search page. We can use this factory for other search forms schemas?
      getMainSearch: function () {
        var schemaform = {
                                "form": [
                                    {
                                      "key": "project",
                                      "placeholder": "Check the console",
                                      "onChange": "getSearchCustomFields()",
                                      //"feedback": "{'glyphicon': true, 'glyphicon-ok': hasSuccess(), 'glyphicon-star': !hasSuccess() }"
                                      "feedback": false,
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
                                      "placeholder": "Search SMILES string"
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
                                          "selected": true
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
                                                        "undefined",
                                                        "null",
                                                        "NaN"
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



                                                    /*
                                                    "Yield": {
                                                        "placeholder": "TEst",
                                                        "minimum": 0.0,
                                                        "type": "number",
                                                        "maximum": 100.0,
                                                        "title": "Yield"
                                                    },*/
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
        return schemaform;
      }
    };
  });
