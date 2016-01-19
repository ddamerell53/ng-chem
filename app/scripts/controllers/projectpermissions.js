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
    "$scope",  "$modalInstance", "$rootScope", "Projectpermissions", "projectId", "permissions","userList",
    function($scope, $modalInstance, $rootScope, Projectpermissions,  projectId, permissions, userList) {
        $scope.projectPermissions = permissions;
        $scope.allUsers = angular.copy(userList);
        //$scope.tagFunction = 
        $scope.saveChanges = function(){
            var updateableList = { "objects": $scope.projectPermissions.roles.map(function(role){
                return $scope.projectPermissions[role];
            }) };
            Projectpermissions.update({}, updateableList, function(data){
                location.reload(true);
                $scope.cancel();
            });
        }
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
    ]);
