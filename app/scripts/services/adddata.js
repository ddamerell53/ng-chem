'use strict';

/**
 * @ngdoc service
 * @name chembiohubAssayApp.addData
 * @description
 * # addData
 * Factory in the chembiohubAssayApp.
 */
angular.module('chembiohubAssayApp')
  .factory('AddDataFactory', ['$resource', function ($resource) {
    // Service logic
    // ...

    //http://www.sitepoint.com/creating-crud-app-minutes-angulars-resource/

    //retrieve data classification
    var dataClassification = $resource('(prefix)/api/datastore/cbh_datapoint_classifications/:dc', {dc: '@dc'});

    //retrieve level data
    var level = $resource('(prefix)/test/api/datastore/cbh_datapoints/2/:lev', {lev: '@lev'});

    //retrieve custom field config
    var cfg = $resource('(prefix)/test/api/datastore/cbh_custom_field_config/:cfgid', {cfgid: '@cfgid'});

    //var supply_whole_uri = $resource('', {supply_uri: '@uri'});
    //we will inject test data for now
    var test_cfg = {
        "created": "2015-08-12T10:22:56.749259",
        "created_by": "/test/api/users/5",
        "data_type": {
            "created": "2015-08-12T06:23:40.501520",
            "id": 3,
            "modified": "2015-08-12T06:23:40.501694",
            "name": "Study"
        },
        "id": 106,
        "modified": "2015-08-12T10:24:49.094644",
        "name": "Project Overview",
        "project_data_fields": [
            {
                "actions_form": null,
                "actions_schema": null,
                "allowed_values": "",
                "created": "2015-08-12T10:22:56.762568",
                "default": "",
                "description": "",
                "edit_form": {
                    "form": [
                        {
                            "key": "Project__space__ID",
                            "placeholder": "",
                            "position": 0,
                            "title": "Project ID"
                        }
                    ]
                },
                "edit_schema": {
                    "properties": {
                        "Project__space__ID": {
                            "placeholder": "",
                            "title": "Project ID",
                            "type": "string"
                        }
                    }
                },
                "exclude_form": {
                    "form": [
                        {
                            "disableSuccessState": true,
                            "feedback": false,
                            "htmlClass": "",
                            "key": "exclude",
                            "options": {
                                "async": {
                                    "call": "dependencyInjectedBasedOnThisString",
                                    "url": "tba"
                                },
                                "refreshDelay": 0
                            }
                        }
                    ]
                },
                "exclude_schema": {
                    "properties": {
                        "exclude": {
                            "format": "uiselect",
                            "items": [],
                            "placeholder": "Choose...",
                            "title": "Exclude Project ID",
                            "type": "array"
                        }
                    }
                },
                "field_key": "",
                "field_type": "char",
                "filter_form": {
                    "form": [
                        {
                            "disableSuccessState": true,
                            "feedback": false,
                            "htmlClass": "",
                            "key": "filter",
                            "options": {
                                "async": {
                                    "call": "dependencyInjectedBasedOnThisString",
                                    "url": "tba"
                                },
                                "refreshDelay": 0
                            }
                        }
                    ]
                },
                "filter_schema": {
                    "properties": {
                        "filter": {
                            "format": "uiselect",
                            "items": [],
                            "placeholder": "Choose...",
                            "title": "Filter Project ID",
                            "type": "array"
                        }
                    }
                },
                "handsontable_column": {
                    "className": "htCenter htMiddle ",
                    "data": "Project__space__ID",
                    "renderer": "linkRenderer",
                    "title": "Project ID"
                },
                "hide_form": {
                    "form": {
                        "key": "hide",
                        "titleMap": [
                            {
                                "name": "Show",
                                "value": "show"
                            },
                            {
                                "name": "Hide",
                                "value": "hide"
                            }
                        ],
                        "type": "radiobuttons"
                    }
                },
                "hide_schema": {
                    "properties": {
                        "hide": {
                            "enum": [
                                "hide",
                                "show"
                            ],
                            "type": "string"
                        }
                    }
                },
                "id": 304,
                "modified": "2015-08-12T10:22:56.807714",
                "name": "Project ID",
                "part_of_blinded_key": false,
                "position": 0,
                "required": false,
                "resource_uri": "/test/api/datastore/l4_cbh_custom_field_config/304",
                "sort_form": {
                    "form": {
                        "key": "sort",
                        "titleMap": [
                            {
                                "name": "A-Z",
                                "value": "asc"
                            },
                            {
                                "name": "Z-A",
                                "value": "desc"
                            }
                        ],
                        "type": "radiobuttons"
                    }
                },
                "sort_schema": {
                    "properties": {
                        "sort": {
                            "enum": [
                                "asc",
                                "desc"
                            ],
                            "type": "string"
                        },
                        "sort_priority": {
                            "type": "integer"
                        }
                    }
                }
            },
            {
                "actions_form": null,
                "actions_schema": null,
                "allowed_values": "",
                "created": "2015-08-12T10:22:56.766260",
                "default": "",
                "description": "",
                "edit_form": {
                    "form": [
                        {
                            "key": "Abstract",
                            "placeholder": "",
                            "position": 1,
                            "title": "Abstract"
                        }
                    ]
                },
                "edit_schema": {
                    "properties": {
                        "Abstract": {
                            "placeholder": "",
                            "title": "Abstract",
                            "type": "string"
                        }
                    }
                },
                "exclude_form": {
                    "form": [
                        {
                            "disableSuccessState": true,
                            "feedback": false,
                            "htmlClass": "",
                            "key": "exclude",
                            "options": {
                                "async": {
                                    "call": "dependencyInjectedBasedOnThisString",
                                    "url": "tba"
                                },
                                "refreshDelay": 0
                            }
                        }
                    ]
                },
                "exclude_schema": {
                    "properties": {
                        "exclude": {
                            "format": "uiselect",
                            "items": [],
                            "placeholder": "Choose...",
                            "title": "Exclude Abstract",
                            "type": "array"
                        }
                    }
                },
                "field_key": "",
                "field_type": "char",
                "filter_form": {
                    "form": [
                        {
                            "disableSuccessState": true,
                            "feedback": false,
                            "htmlClass": "",
                            "key": "filter",
                            "options": {
                                "async": {
                                    "call": "dependencyInjectedBasedOnThisString",
                                    "url": "tba"
                                },
                                "refreshDelay": 0
                            }
                        }
                    ]
                },
                "filter_schema": {
                    "properties": {
                        "filter": {
                            "format": "uiselect",
                            "items": [],
                            "placeholder": "Choose...",
                            "title": "Filter Abstract",
                            "type": "array"
                        }
                    }
                },
                "handsontable_column": {
                    "className": "htCenter htMiddle ",
                    "data": "Abstract",
                    "renderer": "linkRenderer",
                    "title": "Abstract"
                },
                "hide_form": {
                    "form": {
                        "key": "hide",
                        "titleMap": [
                            {
                                "name": "Show",
                                "value": "show"
                            },
                            {
                                "name": "Hide",
                                "value": "hide"
                            }
                        ],
                        "type": "radiobuttons"
                    }
                },
                "hide_schema": {
                    "properties": {
                        "hide": {
                            "enum": [
                                "hide",
                                "show"
                            ],
                            "type": "string"
                        }
                    }
                },
                "id": 305,
                "modified": "2015-08-12T10:22:56.812662",
                "name": "Abstract",
                "part_of_blinded_key": false,
                "position": 1,
                "required": false,
                "resource_uri": "/test/api/datastore/l4_cbh_custom_field_config/305",
                "sort_form": {
                    "form": {
                        "key": "sort",
                        "titleMap": [
                            {
                                "name": "A-Z",
                                "value": "asc"
                            },
                            {
                                "name": "Z-A",
                                "value": "desc"
                            }
                        ],
                        "type": "radiobuttons"
                    }
                },
                "sort_schema": {
                    "properties": {
                        "sort": {
                            "enum": [
                                "asc",
                                "desc"
                            ],
                            "type": "string"
                        },
                        "sort_priority": {
                            "type": "integer"
                        }
                    }
                }
            },
            {
                "actions_form": null,
                "actions_schema": null,
                "allowed_values": "",
                "created": "2015-08-12T10:22:56.769850",
                "default": "",
                "description": "",
                "edit_form": {
                    "form": [
                        {
                            "key": "Grant__space__code",
                            "placeholder": "",
                            "position": 2,
                            "title": "Grant code"
                        }
                    ]
                },
                "edit_schema": {
                    "properties": {
                        "Grant__space__code": {
                            "placeholder": "",
                            "title": "Grant code",
                            "type": "string"
                        }
                    }
                },
                "exclude_form": {
                    "form": [
                        {
                            "disableSuccessState": true,
                            "feedback": false,
                            "htmlClass": "",
                            "key": "exclude",
                            "options": {
                                "async": {
                                    "call": "dependencyInjectedBasedOnThisString",
                                    "url": "tba"
                                },
                                "refreshDelay": 0
                            }
                        }
                    ]
                },
                "exclude_schema": {
                    "properties": {
                        "exclude": {
                            "format": "uiselect",
                            "items": [],
                            "placeholder": "Choose...",
                            "title": "Exclude Grant code",
                            "type": "array"
                        }
                    }
                },
                "field_key": "",
                "field_type": "char",
                "filter_form": {
                    "form": [
                        {
                            "disableSuccessState": true,
                            "feedback": false,
                            "htmlClass": "",
                            "key": "filter",
                            "options": {
                                "async": {
                                    "call": "dependencyInjectedBasedOnThisString",
                                    "url": "tba"
                                },
                                "refreshDelay": 0
                            }
                        }
                    ]
                },
                "filter_schema": {
                    "properties": {
                        "filter": {
                            "format": "uiselect",
                            "items": [],
                            "placeholder": "Choose...",
                            "title": "Filter Grant code",
                            "type": "array"
                        }
                    }
                },
                "handsontable_column": {
                    "className": "htCenter htMiddle ",
                    "data": "Grant__space__code",
                    "renderer": "linkRenderer",
                    "title": "Grant code"
                },
                "hide_form": {
                    "form": {
                        "key": "hide",
                        "titleMap": [
                            {
                                "name": "Show",
                                "value": "show"
                            },
                            {
                                "name": "Hide",
                                "value": "hide"
                            }
                        ],
                        "type": "radiobuttons"
                    }
                },
                "hide_schema": {
                    "properties": {
                        "hide": {
                            "enum": [
                                "hide",
                                "show"
                            ],
                            "type": "string"
                        }
                    }
                },
                "id": 306,
                "modified": "2015-08-12T10:22:56.813812",
                "name": "Grant code",
                "part_of_blinded_key": false,
                "position": 2,
                "required": false,
                "resource_uri": "/test/api/datastore/l4_cbh_custom_field_config/306",
                "sort_form": {
                    "form": {
                        "key": "sort",
                        "titleMap": [
                            {
                                "name": "A-Z",
                                "value": "asc"
                            },
                            {
                                "name": "Z-A",
                                "value": "desc"
                            }
                        ],
                        "type": "radiobuttons"
                    }
                },
                "sort_schema": {
                    "properties": {
                        "sort": {
                            "enum": [
                                "asc",
                                "desc"
                            ],
                            "type": "string"
                        },
                        "sort_priority": {
                            "type": "integer"
                        }
                    }
                }
            },
            {
                "actions_form": null,
                "actions_schema": null,
                "allowed_values": "",
                "created": "2015-08-12T10:22:56.773528",
                "default": "",
                "description": "",
                "edit_form": {
                    "form": [
                        {
                            "key": "Authors",
                            "placeholder": "",
                            "position": 3,
                            "title": "Authors"
                        }
                    ]
                },
                "edit_schema": {
                    "properties": {
                        "Authors": {
                            "placeholder": "",
                            "title": "Authors",
                            "type": "string"
                        }
                    }
                },
                "exclude_form": {
                    "form": [
                        {
                            "disableSuccessState": true,
                            "feedback": false,
                            "htmlClass": "",
                            "key": "exclude",
                            "options": {
                                "async": {
                                    "call": "dependencyInjectedBasedOnThisString",
                                    "url": "tba"
                                },
                                "refreshDelay": 0
                            }
                        }
                    ]
                },
                "exclude_schema": {
                    "properties": {
                        "exclude": {
                            "format": "uiselect",
                            "items": [],
                            "placeholder": "Choose...",
                            "title": "Exclude Authors",
                            "type": "array"
                        }
                    }
                },
                "field_key": "",
                "field_type": "char",
                "filter_form": {
                    "form": [
                        {
                            "disableSuccessState": true,
                            "feedback": false,
                            "htmlClass": "",
                            "key": "filter",
                            "options": {
                                "async": {
                                    "call": "dependencyInjectedBasedOnThisString",
                                    "url": "tba"
                                },
                                "refreshDelay": 0
                            }
                        }
                    ]
                },
                "filter_schema": {
                    "properties": {
                        "filter": {
                            "format": "uiselect",
                            "items": [],
                            "placeholder": "Choose...",
                            "title": "Filter Authors",
                            "type": "array"
                        }
                    }
                },
                "handsontable_column": {
                    "className": "htCenter htMiddle ",
                    "data": "Authors",
                    "renderer": "linkRenderer",
                    "title": "Authors"
                },
                "hide_form": {
                    "form": {
                        "key": "hide",
                        "titleMap": [
                            {
                                "name": "Show",
                                "value": "show"
                            },
                            {
                                "name": "Hide",
                                "value": "hide"
                            }
                        ],
                        "type": "radiobuttons"
                    }
                },
                "hide_schema": {
                    "properties": {
                        "hide": {
                            "enum": [
                                "hide",
                                "show"
                            ],
                            "type": "string"
                        }
                    }
                },
                "id": 307,
                "modified": "2015-08-12T10:22:56.814828",
                "name": "Authors",
                "part_of_blinded_key": false,
                "position": 3,
                "required": false,
                "resource_uri": "/test/api/datastore/l4_cbh_custom_field_config/307",
                "sort_form": {
                    "form": {
                        "key": "sort",
                        "titleMap": [
                            {
                                "name": "A-Z",
                                "value": "asc"
                            },
                            {
                                "name": "Z-A",
                                "value": "desc"
                            }
                        ],
                        "type": "radiobuttons"
                    }
                },
                "sort_schema": {
                    "properties": {
                        "sort": {
                            "enum": [
                                "asc",
                                "desc"
                            ],
                            "type": "string"
                        },
                        "sort_priority": {
                            "type": "integer"
                        }
                    }
                }
            },
            {
                "actions_form": null,
                "actions_schema": null,
                "allowed_values": "",
                "created": "2015-08-12T10:22:56.778046",
                "default": "",
                "description": "",
                "edit_form": {
                    "form": [
                        {
                            "key": "DOI",
                            "placeholder": "",
                            "position": 4,
                            "title": "DOI"
                        }
                    ]
                },
                "edit_schema": {
                    "properties": {
                        "DOI": {
                            "placeholder": "",
                            "title": "DOI",
                            "type": "string"
                        }
                    }
                },
                "exclude_form": {
                    "form": [
                        {
                            "disableSuccessState": true,
                            "feedback": false,
                            "htmlClass": "",
                            "key": "exclude",
                            "options": {
                                "async": {
                                    "call": "dependencyInjectedBasedOnThisString",
                                    "url": "tba"
                                },
                                "refreshDelay": 0
                            }
                        }
                    ]
                },
                "exclude_schema": {
                    "properties": {
                        "exclude": {
                            "format": "uiselect",
                            "items": [],
                            "placeholder": "Choose...",
                            "title": "Exclude DOI",
                            "type": "array"
                        }
                    }
                },
                "field_key": "",
                "field_type": "char",
                "filter_form": {
                    "form": [
                        {
                            "disableSuccessState": true,
                            "feedback": false,
                            "htmlClass": "",
                            "key": "filter",
                            "options": {
                                "async": {
                                    "call": "dependencyInjectedBasedOnThisString",
                                    "url": "tba"
                                },
                                "refreshDelay": 0
                            }
                        }
                    ]
                },
                "filter_schema": {
                    "properties": {
                        "filter": {
                            "format": "uiselect",
                            "items": [],
                            "placeholder": "Choose...",
                            "title": "Filter DOI",
                            "type": "array"
                        }
                    }
                },
                "handsontable_column": {
                    "className": "htCenter htMiddle ",
                    "data": "DOI",
                    "renderer": "linkRenderer",
                    "title": "DOI"
                },
                "hide_form": {
                    "form": {
                        "key": "hide",
                        "titleMap": [
                            {
                                "name": "Show",
                                "value": "show"
                            },
                            {
                                "name": "Hide",
                                "value": "hide"
                            }
                        ],
                        "type": "radiobuttons"
                    }
                },
                "hide_schema": {
                    "properties": {
                        "hide": {
                            "enum": [
                                "hide",
                                "show"
                            ],
                            "type": "string"
                        }
                    }
                },
                "id": 308,
                "modified": "2015-08-12T10:22:56.815857",
                "name": "DOI",
                "part_of_blinded_key": false,
                "position": 4,
                "required": false,
                "resource_uri": "/test/api/datastore/l4_cbh_custom_field_config/308",
                "sort_form": {
                    "form": {
                        "key": "sort",
                        "titleMap": [
                            {
                                "name": "A-Z",
                                "value": "asc"
                            },
                            {
                                "name": "Z-A",
                                "value": "desc"
                            }
                        ],
                        "type": "radiobuttons"
                    }
                },
                "sort_schema": {
                    "properties": {
                        "sort": {
                            "enum": [
                                "asc",
                                "desc"
                            ],
                            "type": "string"
                        },
                        "sort_priority": {
                            "type": "integer"
                        }
                    }
                }
            }
        ],
        "resource_uri": "/test/api/datastore/cbh_custom_field_config/106"
    };

    return {

      dataClassification,
      level,
      cfg,
      test_cfg,

    }


  }]);
