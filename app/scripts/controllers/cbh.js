'use strict';

/**
 * @ngdoc method
 * @name chembiohubAssayApp.controller:CbhCtrl#detectIE
 * @methodOf chembiohubAssayApp.controller:CbhCtrl
 * @description
 * Work out if the current browser is a version of Internet Explorer. We do this becuase the Chemdoodle chemistry sketcher doesn't behave
 * as expected in some IE versions so workarounds have to be applied. Method examines the user agent for the presence of IE, Edge or Trident.
 * @returns {boolean} boolean to flag that the browser is IE.
*/
function detectIE() {
    var ua = window.navigator.userAgent;

    var msie = ua.indexOf('MSIE ');
    if (msie > 0) {
        // IE 10 or older => return version number
        return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }

    var trident = ua.indexOf('Trident/');
    if (trident > 0) {
        // IE 11 => return version number
        var rv = ua.indexOf('rv:');
        return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }

    var edge = ua.indexOf('Edge/');
    if (edge > 0) {
       // Edge (IE 12+) => return version number
       return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
    }

    // other browser
    return false;
}

 
/**
 * @ngdoc controller
 * @name chembiohubAssayApp.controller:CbhCtrl
 * @description
 * # CbhCtrl
 * Main controller for the app. Contains global configuration and global methods which can be overridden in individual controllers.
 */
angular.module('chembiohubAssayApp')
  .controller('CbhCtrl', function($scope, $rootScope, $state, $location, $modal, urlConfig, loggedInUser, projectList, prefix, $compile, MessageFactory, skinConfig, InvitationFactory) {

          var cbh = this;
          

          cbh.isIE = detectIE();
          cbh.appName = "Platform"
          cbh.logged_in_user = loggedInUser;
          cbh.projects = projectList;
          cbh.skinning = skinConfig.objects[0];
          //$scope.skinning = cbh.skinning;
          cbh.prefix = urlConfig.instance_path.base;
          cbh.api_base = urlConfig.admin.list_endpoint;
          cbh.searchPage = function() {
            $state.go('cbh.search', {}, {
              reload: true
            });
          }
          cbh.textsearch = '';
          $scope.projects = projectList.objects;

          $rootScope.projects = projectList.objects;
          
          angular.element(document).ready(function() {

            angular.element("info-box", function() {});
          });

          /**
           * @ngdoc method
           * @name chembiohubAssayApp.controller:CbhCtrl#$scope.isLoggedIn
           * @methodOf chembiohubAssayApp.controller:CbhCtrl
           * @description
           * Check that a user has been recorded as being logged in against this controller
           * @returns {boolean} loggedIn flag that user is logged in or not
          */
          $scope.isLoggedIn = function() {
            var loggedIn = false;
            if (cbh.logged_in_user.id > 0) {
              loggedIn = true;
            }
            return loggedIn;
          };

          /**
           * @ngdoc method
           * @name chembiohubAssayApp.controller:CbhCtrl#$rootScope.getUrlBase
           * @methodOf chembiohubAssayApp.controller:CbhCtrl
           * @description
           * Retrieve the base URL for this install of ShowYourWorking
           * @returns {string} url_frag domain name an subdomain for this instance of the app
          */
          $rootScope.getUrlBase = function() {
            return urlConfig.instance_path.url_frag;
          };

          /**
           * @ngdoc method
           * @name chembiohubAssayApp.controller:CbhCtrl#$scope.getProjectObj
           * @methodOf chembiohubAssayApp.controller:CbhCtrl
           * @description
           * Retrieve a project by key from list of available projects
           * @param {string} project_key string for project lookup
           * @returns {object} proj The project object
          */
          $scope.getProjectObj = function(project_key) {
            angular.forEach($scope.projects, function(proj) {
              if (project_key == proj.project_key) {
                return proj;
              }
            });
          };

          cbh.messages = MessageFactory.getMessages();

          /**
           * @ngdoc method
           * @name chembiohubAssayApp.controller:CbhCtrl#cbh.createCustomFieldTransport
           * @methodOf chembiohubAssayApp.controller:CbhCtrl
           * @description
           * Create an object for communication between handsontable and the search form with respect to custom fields 
           * Not currently used
           * @param {string} newValue  The new definition
           * @param {string} oldValue .
           * @param {string} arrayContains .
           * @returns {object} proj The project object
           * @deprecated
          */
          cbh.createCustomFieldTransport = function(newValue, oldValue, arrayContains) {
            var addOrRemove = ""

            var valToSend;
            var strippedValues = []

            //need to strip out angular $$ variables to enable array comparison
            angular.forEach(newValue, function(item) {
              if (angular.isObject(item)) {
                item = angular.fromJson(angular.toJson(item));
              }
              strippedValues.push(item);
            })

            //work out the array difference so we know which value to add to (or remove from) the search form
            //the order of supplying arrays is important in these comparators, hence the size comparison conditional
            //we need to use underscore filter for object array comparison
            //we need to use underscore difference for string array comparison
            if (angular.isDefined(newValue) && angular.isDefined(oldValue)) {
              if (newValue.length > oldValue.length) {
                addOrRemove = "add"
                  //work out which values are in the new value but not the old value
                if (arrayContains == "obj") {
                  var valToSend = _.filter(strippedValues, function(obj) {
                    return !_.findWhere(oldValue, obj);
                  });
                } else if (arrayContains == "string") {
                  var valToSend = _.difference(strippedValues, oldValue);
                }

              } else if (oldValue.length > newValue.length) {
                addOrRemove = "remove";
                //work out which values are in the old value but not the new value
                if (arrayContains == "obj") {
                  var valToSend = _.filter(oldValue, function(obj) {
                    return !_.findWhere(strippedValues, obj);
                  });
                } else if (arrayContains == "string") {
                  var valToSend = _.difference(oldValue, strippedValues);
                }

              }

              return {
                'newValue': valToSend[0],
                'addOrRemove': addOrRemove
              };
            }

          }

          /**
           * @ngdoc method
           * @name chembiohubAssayApp.controller:CbhCtrl#cbh.openFilterPopup
           * @methodOf chembiohubAssayApp.controller:CbhCtrl
           * @description
           * Opens a bootstrap UI modal window for holding a filter form
           * Not currently used
           * @param {object} col  The new definition
           * @deprecated
          */
          cbh.openFilterPopup = function(col) {
                $scope.col = angular.copy(col);
                $scope.modalInstance = $modal.open({
                  templateUrl: 'views/templates/compound-table-filter.html',
                  size: 'md',
                  resolve: {
                    col: function () {
                      return $scope.col;
                    },

                  }, 
                  controller: function($scope, $modalInstance, col, $timeout) {
                    $scope.col = col;
                    
                    $scope.modalInstance = $modalInstance;

                    $scope.cancel = function () {
                      $modalInstance.dismiss('cancel');
                    };

                  }
                });
              }

        
          
          /* Global error handling popup for displaying generic error messages */
          /**
           * @ngdoc method
           * @name chembiohubAssayApp.controller:CbhCtrl#cbh.errorPopup
           * @methodOf chembiohubAssayApp.controller:CbhCtrl
           * @description
           * Opens a bootstrap UI modal window for holding an error message
           * Not currently used
           * @param {object} input_popup_data  data to display
           * @deprecated
          */
          cbh.errorPopup = function(input_popup_data) {

            $scope.popup_data = angular.copy(input_popup_data);
            $scope.modalInstance = $modal.open({
              templateUrl: 'views/templates/modal-error-template.html',
              size: 'sm',
              resolve: {
                popup_data: function () {
                  return $scope.popup_data;
                },

              }, 
              controller: function($scope, $modalInstance, popup_data, $timeout) {
                $scope.popup_data = popup_data;
                
                $scope.modalInstance = $modalInstance;

                $scope.cancel = function () {
                  $modalInstance.dismiss('cancel');
                };

              }
            });
          };
          /* 
             
             
           */
          /**
           * @ngdoc function
           * @name chembiohubAssayApp.controller:CbhCtrl#cbh.invitationPopup
           * @methodOf chembiohubAssayApp.controller:CbhCtrl
           * @description
           * Global invitation popup for inviting external users to use the system. Creates a new user with the details supplied here and emails the invitee.
          */
          cbh.invitationPopup = function() {

            //$scope.popup_data = angular.copy(input_popup_data);
            $scope.modalInstance = $modal.open({
              templateUrl: 'views/templates/modal-invitation-template.html',
              size: 'md',
              controller: function($scope, $modalInstance, InvitationFactory) {
                
                /**
                 * @ngdoc method
                 * @name chembiohubAssayApp.controller:CbhCtrl#$scope.clearForm
                 * @methodOf chembiohubAssayApp.controller:CbhCtrl
                 * @description
                 * Removes all data from the current invitation form
                */
                $scope.clearForm = function(){
                  $scope.invite = {
                    firstName:'',
                    lastName:'',
                    email: '',
                    projects_selected: [],
                    remind: false

                  };

                $scope.validationMessage = "";
                }
                
                $scope.modalInstance = $modalInstance;
                $scope.clearForm();

                /**
                 * @ngdoc method
                 * @name chembiohubAssayApp.controller:CbhCtrl#$scope.setWatcher
                 * @methodOf chembiohubAssayApp.controller:CbhCtrl
                 * @description
                 * Starts a reminder timer for the back end - if an invited user hasn't registered after an invite wihtin a certiain time frame, remind them with a follw up email.
                */
                $scope.setWatcher = function(){
                  $scope.watch = $scope.$watch("invite.email", function(old,newob){
                    if(old != newob){
                      $scope.invite.remind  = false;
                    }
                  });
                }

                $scope.setWatcher();
                $scope.projects = [];
                angular.forEach(cbh.projects.objects, function(proj){
                  if(proj.editor){
                    $scope.projects.push(proj);
                  }
                });

                /**
                 * @ngdoc method
                 * @name chembiohubAssayApp.controller:CbhCtrl#$scope.cancel
                 * @methodOf chembiohubAssayApp.controller:CbhCtrl
                 * @description
                 * Cancel the invitation and close the popup window
                */
                $scope.cancel = function () {
                  $scope.validationMessage = "";
                  $modalInstance.dismiss('cancel');
                };

                /**
                 * @ngdoc method
                 * @name chembiohubAssayApp.controller:CbhCtrl#$scope.sendInvite
                 * @methodOf chembiohubAssayApp.controller:CbhCtrl
                 * @description
                 * Validate the completed invitation form and if valid, send the invite via back end.
                */
                $scope.sendInvite = function() {
                  //check fields are filled in
                  //send info to backend to set up new users
                    $scope.validationMessage = "";

                  if($scope.invite.email == ""){
                    $scope.validationMessage = "Please enter an email address so we can send the invitation.";
                  }
                  else if($scope.invite.projects_selected.length == 0) {
                    $scope.validationMessage = "Please select at least one project to add this user to.";
                  }
                  else {
                    //OK we have the info we need - send the invite!
                    
                    //send via some form of service
                    
                    InvitationFactory.invite.save($scope.invite,
                        function(data) {
                            $scope.watch();
                            $scope.invite.email="";
                            $scope.invite.remind  = false;
                            $scope.validationMessage = data.message;
                            $timeout(function(){
                              $scope.setWatcher();
                            },100);
                            

                        },
                        function(error){
                          if(error.status == 409){
                                //http conflict means we have the invitee in the db already but no reminder has been asked for
                               $scope.validationMessage = error.data.error;
                               $scope.invite.remind = true;
                          }else{
                              $scope.validationMessage = "There was a problem sending your invitation, please contact the ChemBio Hub team.";

                              if(error.data){
                                if(error.data.error){
                                  $scope.validationMessage = error.data.error;
                                }
                              }
                          }
                          
                        }
                    );
                  }


                };

                
              }
            });
          };

          /**
           * @ngdoc method
           * @name chembiohubAssayApp.controller:CbhCtrl#cbh.currentPageClass
           * @methodOf chembiohubAssayApp.controller:CbhCtrl
           * @description
           * Add a css class indicating that the item corresponds to the current page (for paging etc)
           * @param {object} state_to_match  object representing the current ui-router state
           * @returns {string} string empty string if false, 'curent-page' if true
          */
          cbh.currentPageClass = function(state_to_match) {
            if ($state.includes(state_to_match)) {
              return 'current-page';
            } else {
              return '';
            }
          }

          $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){ 
              //fetch the cbh_skinning config and replace the maintenance parts the cached version (cbh.skinning)
              $http({  method: "get",
                    url: urlConfig.cbh_skinning.list_endpoint
                  }).then(function(data){
                    //console.log(data.data.objects[0]);
                    cbh.skinning.maintenance_warning = data.data.objects[0].maintenance_warning
                    cbh.skinning.maintenance_warning_message = data.data.objects[0].maintenance_warning_message
                    cbh.skinning.maintenance_warning_start = data.data.objects[0].maintenance_warning_start
                    cbh.skinning.maintenance_warning_end = data.data.objects[0].maintenance_warning_end
                  });

          })




        });
