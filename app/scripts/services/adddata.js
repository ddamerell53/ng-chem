'use strict';

/**
 * @ngdoc service
 * @name chembiohubAssayApp.addData
 * @description
 * # addData
 * Factory in the chembiohubAssayApp.
 */
angular.module('chembiohubAssayApp')
  .factory('AddDataFactory', ['$resource', 'urlConfig', function ($resource, urlConfig) {
    // Service logic
    // ...

    //http://www.sitepoint.com/creating-crud-app-minutes-angulars-resource/

    //retrieve data classification
    var dataClassification = $resource(urlConfig.instance_path.url_frag + 'datastore/cbh_datapoint_classifications/:dc', {dc: '@dc'});

    //retrieve level data
    var level = $resource(urlConfig.instance_path.url_frag + 'datastore/cbh_datapoints/:dpid', {dpid: '@dpid'});

    //retrieve custom field config
    var cfg = $resource(urlConfig.instance_path.url_frag + 'datastore/cbh_custom_field_config/:cfgid', {cfgid: '@cfgid'});

    //var supply_whole_uri = $resource('', {supply_uri: '@uri'});
    
    

    return {

      dataClassification,
      level,
      cfg,

    }


  }]);
