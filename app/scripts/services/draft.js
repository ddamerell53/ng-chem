'use strict';

/**
 * @ngdoc service
 * @name chembiohubAssayApp.service:DraftFactory
 * @description
 * # DraftFactory
 * Not currently used. Was intended to provide a rudimentary draft and edit history for textarea fields.
 * @deprecated
 */
angular.module('chembiohubAssayApp')
  .factory('DraftFactory',  ['$resource', 'urlConfig', function ($resource, urlConfig) {
    // ...

    //var supply_whole_uri = $resource('', {supply_uri: '@uri'});
    var save_draft = $resource(urlConfig.instance_path.url_frag + 'datastore/cbh_datapoint_classifications/save_draft/', {content: '@content'});
    var get_draft = $resource(urlConfig.instance_path.url_frag + 'datastore/cbh_datapoint_classifications/get_draft/', {draft_key: '@draft_key'} );
    var list = $resource(urlConfig.instance_path.url_frag + 'datastore/cbh_datapoint_classifications/get_draft_list/');

    

    return {

      "save_draft": save_draft,
      "get_draft": get_draft,
      "list": list,

    }
  }]);
