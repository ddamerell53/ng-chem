'use strict';

/**
 * @ngdoc service
 * @name chembiohubAssayApp.addData
 * @description
 * # addData
 * Factory in the chembiohubAssayApp.
 * @deprecated
 */
angular.module('chembiohubAssayApp')
  .factory('AddDataFactory', ['$resource', 'urlConfig', function ($resource, urlConfig) {
    // Service logic
    // ...

    //http://www.sitepoint.com/creating-crud-app-minutes-angulars-resource/

    //retrieve data classification
    var dataClassification = $resource(urlConfig.instance_path.url_frag + 'datastore/cbh_datapoint_classifications/:dc', {dc: '@dc'}, {
        'update': { method:'PATCH', params:{dc: '@dc'} }
    });

    var nestedDataClassification = $resource(
      urlConfig.instance_path.url_frag + 'datastore/cbh_datapoint_classifications_nested/:dc', 
      {dc: '@dc'});


    //retrieve level data
    var level = $resource(urlConfig.instance_path.url_frag + 'datastore/cbh_datapoints/:dpid', {dpid: '@dpid'});

    //retrieve custom field config

    //var supply_whole_uri = $resource('', {supply_uri: '@uri'});
    var pwf = $resource(urlConfig.instance_path.url_frag + 'datastore/cbh_projects_with_forms/');

    

    return {

      "dataClassification": dataClassification,
      "nestedDataClassification" : nestedDataClassification,
      "level": level,
      "pwf": pwf

    }


  }]);
