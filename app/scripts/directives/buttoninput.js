'use strict';

/**
 * @ngdoc directive
 * @name chembiohubAssayApp.directive:buttonInput
 * @restrict 'E'
 * @description
 * # buttonInput
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
