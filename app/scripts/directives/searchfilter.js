'use strict';

/**
 * @ngdoc directive
 * @name chembiohubAssayApp.directive:searchFilter
 * @description
 * # SearchFilter
 */
angular.module('chembiohubAssayApp')
  .directive('searchFilter', [ function () {
    return {
      templateUrl: 'views/templates/search-filter-templatev2.html',
      restrict: 'E',
      transclude: true,
      scope: {
      	cbh: "=",
      },
      controller: ["$scope", "$rootScope", "skinConfig", "$timeout", function($scope, $rootScope, skinConfig, $timeout){
      	
      	//has the filter button been pressed in the handsontable?
      	$rootScope.$on("columnSelection", function(event, col){
         
        	$scope.col = col;
            $scope.col.showFilters = true;

          
          
          if(!$scope.col.filters){
            $scope.col.filters = {"field_path" : col.data ,
                                  };
          }else{
            $scope.col.filters.field_path = col.data;
          }

        	// $scope.cbh.column = col
          $scope.queryAsfForm = angular.copy(skinConfig.objects[0].query_schemaform.default.form);
          $scope.queryAsfSchema = angular.copy(skinConfig.objects[0].query_schemaform.default.schema);
          $scope.sortAsfForm = angular.copy(skinConfig.objects[0].sort_schemaform.default.form);
          $scope.sortAsfSchema = angular.copy(skinConfig.objects[0].sort_schemaform.default.schema);
          $scope.hideAsfForm = angular.copy(skinConfig.objects[0].hide_schemaform.default.form);
          $scope.hideAsfSchema = angular.copy(skinConfig.objects[0].hide_schemaform.default.schema);
          $scope.blanksQuery = false;

          
           
        });
        
        $scope.updated = function(foo, form){
            // document.getElementById('html5ValidationForm').submit();
              $timeout(function(){
                document.getElementById('validatorId').click();
              });
        };

        
        $scope.queryTypeChanged = function(modelValue, form){
          //Check to see if anything is not equal to its default value
          var needsUpdating = false;
          $scope.$broadcast("schemaFormRedraw");
          //Need to send a redraw to ensure ngmodel is up to date and the validation messages show up
          
          angular.forEach($scope.queryAsfForm, function(item){
            if(item.onChange == "updated(modelValue,form)"){
              var model = $scope.col.filters[item.key];
              var def = $scope.queryAsfSchema.properties[item.key].default;
              if(model != def && model != undefined){
                $scope.col.filters[item.key] = def;
                needsUpdating = true;
              }
            }
          });
          var blanks = (["blanks", "nonblanks"].indexOf(modelValue)> -1);

          if(needsUpdating || blanks || $scope.blanksQuery){
              if($scope.blanksQuery){
                $scope.blanksQuery = false;

              }
              if(blanks){
                  $scope.blanksQuery = blanks;
                  $scope.sendFilterUpdate(true);
              }else{
                //Here we are just cancelling a previous blanks or non blanks query
                $scope.sendFilterUpdate(false);
              }
              
          }
          $scope.$broadcast("schemaFormRedraw");
          
        };

        
        $scope.hideChanged = function(newHiddenValue, form){
          
            $rootScope.$broadcast("hideChanged", {field_path : $scope.col.data} );
          
        };

        $scope.sortChanged = function(newSortValue, form){
          if(newSortValue == $scope.sortAsfSchema.properties[form.key].default){
            //Resetting to default means removing the filter
            $rootScope.$broadcast("removeSort", {field_path : $scope.col.data });
          }else{
            $rootScope.$broadcast("addSort", {field_path : $scope.col.data, direction: newSortValue});
          }
        };
        
        $scope.sendFilterUpdate = function( addNew){
            $rootScope.$broadcast("filtersUpdated", {"addNew" : addNew,  "field_path" : $scope.col.data , "col" : $scope.col} ); 
        };


        $scope.submit = function(form){
          $scope.$broadcast("schemaFormValidate");
          $timeout(function(){
            if(form.$valid){
              $scope.sendFilterUpdate(true);
            }else{
              
              //If the form is invalid for this item we still need to update the table view
              //if there was a previous filter applied to the dataset
              $scope.sendFilterUpdate(false);
            }
          });
          
          
          
          return false;
        }

        $scope.close = function(){
        	$scope.col.showFilters = false;
        }

        //now we need a way of getting the correct form and schema for this field from the custom fields


      }],
      /*link: function postLink(scope, element, attrs) {
        element.text('this is the SearchFilter directive');
      }*/
    };
  }]);
