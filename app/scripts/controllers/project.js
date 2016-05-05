'use strict';

/**
 * @ngdoc controller
 * @name chembiohubAssayApp.controller:ProjectCtrl
 * @description
 * # ProjectCtrl
 * This controller is used to fetch the appropriate projects for the given user for display on the project list page. 
 * It is essentially a holder for the appropriate angular services.
 */
angular.module('chembiohubAssayApp')
  .controller('ProjectCtrl', [ '$scope', '$rootScope', '$state', 'ProjectFactory', 'MessageFactory', '$stateParams','urlConfig', function ($scope, $rootScope, $state, ProjectFactory, MessageFactory, $stateParams, urlConfig) {
    //stuff
    $scope.urlConfig =  urlConfig;
    $rootScope.headline = "Projects";
    $rootScope.subheading = "Click 'Show Project List' to see your projects";
    //$rootScope.help_lookup = "projects_help"
    $scope.help_lookup = "projects_help"
    $rootScope.glyphicon = "folder-open";

    $scope.getMessage = function(lookup_str){
        return MessageFactory.getMessage(lookup_str);

    }

    $scope.messages = MessageFactory.getMessages();


    
  }]);
