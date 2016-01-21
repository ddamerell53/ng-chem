'use strict';

/**
 * @ngdoc service
 * @name chembiohubAssayApp.ProjectPermissionAllRoles
 * @description
 * # ProjectPermissionAllRoles
 * Factory in the chembiohubAssayApp.
 */
angular.module('chembiohubAssayApp')
  .factory('ProjectPermissionAllRoles', function ($timeout, Projectpermissions) {



    // Public API here
    return {
      get_for_project: function(projectId, scopeForDedupe){
                  var data = {
                                roles: ["owner", "editor", "viewer"],
                              };
                  angular.forEach(data.roles, function(role){
                    data[role] = Projectpermissions.get({"codename": projectId + "__" + role}, function(newPerms){
                      if(angular.isDefined(scopeForDedupe)){
                        var countNewForRole = 0;
                        angular.forEach(newPerms.users, function(uri){
                          if(scopeForDedupe[role].users.indexOf(uri) == -1){
                            scopeForDedupe[role].users.push(uri);
                            countNewForRole++;
                          }

                        });
                        var message;
                        switch(countNewForRole) {
                          case 0:
                            message =  "No users were copied as " + role + "s.";
                            break;
                          case 1:
                            if(["a","e","i", "o", "u"].indexOf(role.slice(0,1)) != -1){
                              message =  "1 user was copied as an " + role + ".";
                              break;
                            }else{
                              message =  "1 user was copied as a " + role + ".";
                              break;
                            }
                            
                          default:
                            message =  countNewForRole + " users were copied as " + role + "s.";

                        }
                        scopeForDedupe[role + "_message"] = message;
                        $timeout(function(){
                            scopeForDedupe[role + "_message"] = "";
                        }, 10000)

                      }

                    });
                    data[role + "_user_tagfunction"] = function(tagggedEmail){
                        // We return a "user" object that will also be edited in the invitations section of the page
                        
                          return {
                                  "username": tagggedEmail, 
                                  "external": true, 
                                  "first_name": "", 
                                  "last_name": "",
                                  "email" : tagggedEmail,
                                  "inviting" : true,
                                  "resource_uri" : tagggedEmail
                                 }
                    }
                  });
                  return data
        }
    };
  });
