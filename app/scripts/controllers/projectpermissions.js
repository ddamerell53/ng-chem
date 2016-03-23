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
    "$scope", "$q",  "$filter","$modalInstance", "$rootScope", "Projectpermissions", "proj", "permissions","userList","ProjectPermissionAllRoles",
    function($scope, $q, $filter, $modalInstance, $rootScope, Projectpermissions,  proj, permissions, userList, ProjectPermissionAllRoles) {
        $scope.projectPermissions = permissions;
        function orderPredicate(item){
            if(item.first_name){
                return item.first_name;
            }
            return item.username;
        }

        
        $scope.allUsers = $filter('orderBy')(angular.copy(userList), "display_name");
        $scope.proj = proj;
        //$scope.tagFunction = 
        $scope.saveChanges = function(){
            var updateableList = { "objects": $scope.projectPermissions.roles.map(function(role){
                return $scope.projectPermissions[role];
            }) };
            //TODO handle error here
            Projectpermissions.update({}, updateableList, function(data){
                location.reload(true);
                $scope.cancel();
            });
        }
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.copyProjectPermissions = function(copyProjectId){
            
            var perms = ProjectPermissionAllRoles.get_for_project(copyProjectId, $scope.projectPermissions);
            
        }
    }
    ]);
