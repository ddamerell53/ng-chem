'use strict';

/**
 * @ngdoc directive
 * @name ngChemApp.directive:buttonInput
 * @description
 * # buttonInput
 */
angular.module('ngChemApp')
  .directive('buttonInput', function () {
    return {
      template: '<bootstrap-decorator>\
                    <div class="form-group " ng-class="" ng-init="">\
                        <label class="control-label " >{{label}}</label>\
                            <div class="form-group " >\
                              <div class="input-group">\
                                <input class="form-control" type="text" ng-disabled="disabled" ng-model="copyModel"></input>\
                                <a href="" clip-copy="copyModel" clip-click="" role="button" class="input-group-addon"><span class="glyphicon glyphicon-copy"> Copy</span></a>\
                            </div>\
                            </div>\
                            </div>\
                        </bootstrap-decorator>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        //element.html('this is the chemsvg directive');
        scope.setCopyModel();
        scope.$watch('model', function(){
               scope.setCopyModel();
          }, true);
      
      },
       controller: ['$scope', function($scope) {
         
            $scope.setCopyModel = function() {
                var mymodel = $scope.model;
                if (angular.isDefined($scope.key)){
                  if (angular.isDefined($scope.model[$scope.key])){
                      mymodel = $scope.model[$scope.key];
                  }else{
                    mymodel="";
                  }

                }
                if (mymodel.constructor === Array){
                    $scope.copyModel = mymodel.join(", ");
                }else{
                    $scope.copyModel = mymodel;
                }
            }
       }],
      scope: {
        key: '=',
        model:'=',
        disabled: '=',
        label: '=',

      }
    };
  });
