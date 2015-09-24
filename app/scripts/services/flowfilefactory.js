'use strict';

/**
 * @ngdoc service
 * @name chembiohubAssayApp.FlowFileFactory
 * @description
 * # FlowFileFactory
 * Factory in the chembiohubAssayApp.
 */
angular.module('chembiohubAssayApp')
  .factory('FlowFileFactory', [ '$resource', 'urlConfig', function ($resource, urlConfig){
    // Service logic
    // ...
    //example from adddata
    /*var dataClassification = $resource(urlConfig.instance_path.url_frag + 'datastore/cbh_datapoint_classifications/:dc', {dc: '@dc'}, {
        'update': { method:'PATCH', params:{dc: '@dc'} }
    });*/


    var cbhFlowfile = $resource(urlConfig.instance_path.url_frag + 'datastore/cbh_flowfiles/:fileId', {fileId: '@fileId'});

    var cbhAttachments = $resource(urlConfig.instance_path.url_frag + 'datastore/cbh_attachments', {
      flowfile: '@flowfile',
      data_point_classification:  "@data_point_classification",
      chosen_data_form_config: "@chosen_data_form_config",
      sheet_name: "@sheetname",
    });


    return {

      "cbhFlowfile": cbhFlowfile,
      "cbhAttachments": cbhAttachments,

    }

    
  }]);
