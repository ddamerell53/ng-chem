'use strict';

/**
 * @ngdoc service
 * @name chembiohubAssayApp.addData
 * @description
 * # addData
 * Factory in the chembiohubAssayApp.
 */
angular.module('chembiohubAssayApp')
  .factory('InvitationFactory', ['$resource', 'urlConfig', function ($resource, urlConfig) {
    // Service logic
    // ...

    //http://www.sitepoint.com/creating-crud-app-minutes-angulars-resource/



    //var supply_whole_uri = $resource('', {supply_uri: '@uri'});
    var invite = $resource(urlConfig.invitations.list_endpoint, + 'invite_user/');

    

    return {

      "invite": invite,

    }


  }]);
