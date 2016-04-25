'use strict';

/**
 * @ngdoc service
 * @name chembiohubAssayApp.ViewDataFactory
 * @description
 * # ViewDataFactory
 * Factory in the chembiohubAssayApp.
 */
angular.module('chembiohubAssayApp')
  .factory('ViewDataFactory', ['$resource', function ($resource) {
    // Service logic
    // ...

    // Public API here
    var test_ws_data = {};


    var test_datapoints = {
        "/test/api/datastore/cbh_datapoints/2" : {"created": "2015-08-13T09:39:43.650658", "created_by": {"date_joined": "2015-02-23T10:34:11", "first_name": "", "id": 1, "is_staff": true, "is_superuser": true, "last_login": "2015-08-13T04:49:22.465231", "last_name": "", "resource_uri": "/test/api/users/1", "username": "andy"}, "custom_field_config": "/test/api/datastore/cbh_custom_field_config/106", "id": 2, "modified": "2015-08-13T09:39:43.651076", "project_data": {"Abstract": "Biiiiiiiiiiiiiiig abstract", "Project Id": "ttest"}, "resource_uri": "/test/api/datastore/cbh_datapoints/2", "supplementary_data": {}},
        "/test/api/datastore/cbh_datapoints/3" : {"created": "2015-08-13T09:41:43.543643", "created_by": {"date_joined": "2015-02-23T10:34:11", "first_name": "", "id": 1, "is_staff": true, "is_superuser": true, "last_login": "2015-08-13T04:49:22.465231", "last_name": "", "resource_uri": "/test/api/users/1", "username": "andy"}, "custom_field_config": "/test/api/datastore/cbh_custom_field_config/107", "id": 3, "modified": "2015-08-13T09:41:43.544126", "project_data": {"Aims": "to test our API", "Assays included": "test", "Sub-Project ID": "test"}, "resource_uri": "/test/api/datastore/cbh_datapoints/3", "supplementary_data": {}},
        "/test/api/datastore/cbh_datapoints/4" : {"created": "2015-08-13T09:42:57.380200", "created_by": {"date_joined": "2015-02-23T10:34:11", "first_name": "", "id": 1, "is_staff": true, "is_superuser": true, "last_login": "2015-08-13T04:49:22.465231", "last_name": "", "resource_uri": "/test/api/users/1", "username": "andy"}, "custom_field_config": "/test/api/datastore/cbh_custom_field_config/108", "id": 4, "modified": "2015-08-13T09:42:57.381017", "project_data": {"Assay ID": "test", "Assay Type": "test", "Written Protocol": "to test our API"}, "resource_uri": "/test/api/datastore/cbh_datapoints/4", "supplementary_data": {}},
        "/test/api/datastore/cbh_datapoints/5" : {"created": "2015-08-13T09:45:10.343853", "created_by": {"date_joined": "2015-02-23T10:34:11", "first_name": "", "id": 1, "is_staff": true, "is_superuser": true, "last_login": "2015-08-13T04:49:22.465231", "last_name": "", "resource_uri": "/test/api/users/1", "username": "andy"}, "custom_field_config": "/test/api/datastore/cbh_custom_field_config/109", "id": 5, "modified": "2015-08-13T09:46:22.753781", "project_data": {"Standard Activity Type": "IC50", "Standard Activity Value": "34", "Standard Unit": "nM"}, "resource_uri": "/test/api/datastore/cbh_datapoints/5", "supplementary_data": {}},
        "/test/api/datastore/cbh_datapoints/6" : {"created": "2015-08-13T09:49:19.760949", "created_by": {"date_joined": "2015-02-23T10:34:11", "first_name": "", "id": 1, "is_staff": true, "is_superuser": true, "last_login": "2015-08-13T04:49:22.465231", "last_name": "", "resource_uri": "/test/api/users/1", "username": "andy"}, "custom_field_config": "/test/api/datastore/cbh_custom_field_config/109", "id": 6, "modified": "2015-08-13T09:49:19.761362", "project_data": {"Standard Activity Type": "IC50", "Standard Activity Value": "567", "Standard Unit": "nM"}, "resource_uri": "/test/api/datastore/cbh_datapoints/6", "supplementary_data": {}},
        "/test/api/datastore/cbh_datapoints/7" : {"created": "2015-08-13T09:49:41.438691", "created_by": {"date_joined": "2015-02-23T10:34:11", "first_name": "", "id": 1, "is_staff": true, "is_superuser": true, "last_login": "2015-08-13T04:49:22.465231", "last_name": "", "resource_uri": "/test/api/users/1", "username": "andy"}, "custom_field_config": "/test/api/datastore/cbh_custom_field_config/109", "id": 7, "modified": "2015-08-13T09:49:41.439112", "project_data": {"Standard Activity Type": "IC50", "Standard Activity Value": "56", "Standard Unit": "nM"}, "resource_uri": "/test/api/datastore/cbh_datapoints/7", "supplementary_data": {}},
        "/test/api/datastore/cbh_datapoints/8" : {"created": "2015-08-13T09:50:06.390150", "created_by": {"date_joined": "2015-02-23T10:34:11", "first_name": "", "id": 1, "is_staff": true, "is_superuser": true, "last_login": "2015-08-13T04:49:22.465231", "last_name": "", "resource_uri": "/test/api/users/1", "username": "andy"}, "custom_field_config": "/test/api/datastore/cbh_custom_field_config/109", "id": 8, "modified": "2015-08-13T09:50:06.390549", "project_data": {"Standard Activity Type": "IC50", "Standard Activity Value": "7", "Standard Unit": "nM"}, "resource_uri": "/test/api/datastore/cbh_datapoints/8", "supplementary_data": {}},
    };

    var getDatapoints = function(classification){
      angular.forEach($scope.display_data, function(datapoint){
        var l0 = $resource(classification.l0.get(), {});
        var l1 = $resource(classification.l1.get(), {});
        var l2 = $resource(classification.l2.get(), {});
        var l3 = $resource(classification.l3.get(), {});
        var l4 = $resource(classification.l4.get(), {});
        return {'l0':l0, 'l1':l1, 'l2':l2, 'l3':l3, 'l4':l4};
      });
    };

    var dataClassifications = $resource('(prefix)/api/datastore/cbh_datapoint_classifications',{});

    return {
      "dataClassifications": dataClassifications,
      "test_ws_data": test_ws_data,
      "test_datapoints": test_datapoints,
    }

  }]);
