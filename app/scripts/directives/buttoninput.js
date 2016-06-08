'use strict';

/**
 * @ngdoc directive
 * @name chembiohubAssayApp.directive:buttonInput
 * @restrict 'E'
 * @scope
 * @description
 * # buttonInput
 * Builds a two-mode form element - an "edit" mode display which is a regular form element and a 
 * "readonly" version which is a disabled text form element displaying the field value. This is then accessible 
 * by a "click to copy" mechanism provided by (TODO link)
 *
 * @param {object} copyModel  Used to store data for the read and edit states, acts like a form element
 * @param {boolean} disabled  Flag for displaying this element as a disabled form element (not used)
 * @param {string} label  Text title for the field
 */
angular.module('chembiohubAssayApp')
  .directive('buttonInput', function ($timeout) {
    return {
      template: '<bootstrap-decorator>\
                    <div class="form-group " ng-class="" ng-init="">\
                        <label class="control-label " >{{label}}</label>\
                            <div class="form-group " >\
                              <div class="input-group">\
                                <input class="form-control" type="text" disabled ng-model="copyable"></input>\
                                <a href="" clip-copy="copyable" clip-click="" role="button" class="input-group-addon"><span class="glyphicon glyphicon-copy"> Copy</span></a>\
                            </div>\
                            </div>\
                            </div>\
                        </bootstrap-decorator>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        //element.html('this is the chemsvg directive');
        
        scope.copyable = angular.copy(scope.copyModel);

        var watcher = scope.$watch(function(scope) {
                    return scope.copyModel;
                }, 
          function(newdata, olddata){
          if(newdata != olddata){
            scope.copyable = angular.copy(scope.copyModel);
          }
        })

      
      },
       controller: ['$scope', function($scope) {


         
           
       }],
      scope: {
        copyModel:'=',
        disabled: '=',
        label: '=',

      }
    };
  });
