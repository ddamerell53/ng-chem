'use strict';

/**
 * @ngdoc service
 * @name chembiohubAssayApp.InvitationFactory
 * @description
 * # FlowFileFactory
 * Factory which provides convenient, parameterised access to invitation related web service endpoints. Not currently used.
 * @param {object} $resource angular library for constructing webservice calls from URLs.
 * @param {object} urlConfig app config object containing aliases for all available web service endpoints.
 * @returns {object} object Object containing keyed $resource objects
 * @deprecated
 */
angular.module('chembiohubAssayApp')
  .factory('InvitationFactory', ['$resource', 'urlConfig', function ($resource, urlConfig) {

    //http://www.sitepoint.com/creating-crud-app-minutes-angulars-resource/

    /**
     * @ngdoc property
     * @name chembiohubAssayApp.InvitationFactory#invite
     * @propertyOf chembiohubAssayApp.InvitationFactory
     * @description
     * Not currently used
     */
    var invite = $resource(urlConfig.invitations.list_endpoint, + 'invite_user/');

    

    return {

      "invite": invite,

    }


  }]);
