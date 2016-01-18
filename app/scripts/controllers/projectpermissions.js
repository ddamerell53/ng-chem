'use strict';

/**
 * @ngdoc function
 * @name chembiohubAssayApp.controller:ProjectpermissionsCtrl
 * @description
 * # ProjectpermissionsCtrl
 * Controller of the chembiohubAssayApp
 */
angular.module('chembiohubAssayApp')
  .controller('ProjectpermissionsCtrl', [
    "$scope",  "$modalInstance", "$rootScope", "ProjectFactory", "projectId", "permissions","userList",
    function($scope, $modalInstance, $rootScope, ProjectFactory,  projectId, permissions, userList) {
        $scope.projectPermissions = permissions;
        $scope.allUsers = userList;
        //$scope.tagFunction = 


    }
    ]);
