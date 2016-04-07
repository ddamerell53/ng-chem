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
      template: '<div  ng-include="getTemplateUrl()"></div>',
      restrict: 'E',
      transclude: true,
      scope: {
      	cbh: "=",
      },
      controller: ["$scope", "$rootScope", "skinConfig", "$timeout", function($scope, $rootScope, skinConfig, $timeout){
      	

      	//has the filter button been pressed in the handsontable?
      	$scope.$on("columnSelection", function(event, col){

        	$scope.col = col;
          $scope.getTemplateUrl = function(){
            if($scope.col.searchFormType == 'chemical'){
              return 'views/templates/search-filter-templatev2_chemical.html';
            }
            return 'views/templates/search-filter-templatev2.html';

          }
          $scope.col.showFilters = true;

          
          
          if(!$scope.col.filters){
            $scope.col.filters = {"field_path" : col.data , 'pick_from_list' : []
                                  };
          }else{
            $scope.col.filters.field_path = col.data;
          }
           $scope.chemicalUpdated = function(modelValue, form){
                $scope.chemicalfilters.inprogress = true;
                console.log("calling up")
                $timeout(function(){
                  $rootScope.$broadcast("chemicalSearch")
                });
            }
            $scope.fetching = false;
            $scope.$on("moleculeChanged", function(){
                $scope.chemicalfilters.inprogress = true;
                if(!$scope.fetching){
                  $scope.fetching = true;
                  $timeout(function(){
                    $scope.fetching = false;
                    $rootScope.$broadcast("chemicalSearch")
                  }, 50);
                }
                
                
            });

            $scope.$on("chemicalSearchReady", function(event){
              $scope.chemicalfilters = skinConfig.objects[0].chemicalSearch;
            });

        	// $scope.cbh.column = col
          if(col.searchFormType == "chemical"){
            $scope.queryAsfForm = angular.copy(skinConfig.objects[0].chem_query_schemaform.default.form);
            $scope.queryAsfSchema = angular.copy(skinConfig.objects[0].chem_query_schemaform.default.schema);
            $scope.chemicalfilters = skinConfig.objects[0].chemicalSearch;
          }
          else {
            $scope.queryAsfForm = angular.copy(skinConfig.objects[0].query_schemaform.default.form);
            $scope.queryAsfSchema = angular.copy(skinConfig.objects[0].query_schemaform.default.schema);
          }
          $scope.sortAsfForm = angular.copy(skinConfig.objects[0].sort_schemaform.default.form);
          $scope.sortAsfSchema = angular.copy(skinConfig.objects[0].sort_schemaform.default.schema);
          $scope.hideAsfForm = angular.copy(skinConfig.objects[0].hide_schemaform.default.form);
          $scope.hideAsfSchema = angular.copy(skinConfig.objects[0].hide_schemaform.default.schema);
          $scope.col.blanksQuery = false;
          $scope.$broadcast("schemaFormRedraw");
          
          
           
        });
        

        
        $scope.updated = function(modelValue, form){

            if(form.key[0] =="pick_from_list" ){
              //special case for empty pick from list
              if(modelValue.length == 0){
                $rootScope.$broadcast("cleanupFilters",{"col": $scope.col, "reset_query_type" : false }) 
                $scope.sendFilterUpdate(false);
              }else{
                //We can't do the click on the validate link
                //Because it will close the drop down
                $scope.sendFilterUpdate(true);
              }
              
            }else{
              $timeout(function(){
                document.getElementById('validatorId').click();
              });
            }
              
        };

        $scope.clearFilters = function(){
          $rootScope.$broadcast("cleanupFilters",{"col": $scope.col, "reset_query_type" : true })         
          $scope.sendFilterUpdate(false)


        }

        $scope.closeMenu = function(){
          $scope.col.showFilters = false;
          //Get rid of the coloured top on the selected cell in the table
           $rootScope.$broadcast("updateListView");
        }



        $scope.queryTypeChanged = function(modelValue, form){
            $rootScope.$broadcast("cleanupFilters",{"col": $scope.col, "reset_query_type" : false })         
            var addNew = modelValue.indexOf("blanks") > -1;
             $scope.sendFilterUpdate(addNew)
             $scope.$broadcast("schemaFormRedraw");
        }

         

        
        $scope.hideChanged = function(newHiddenValue, form){

            if(newHiddenValue== $scope.hideAsfSchema.properties[form.key].default){
                $rootScope.$broadcast("removeHide", {field_path : $scope.col.data} );
            }else{
                $rootScope.$broadcast("addHide", {field_path : $scope.col.data} );
                $scope.closeMenu();
            }          
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

        $scope.chemicalsubmit = function(){
          $rootScope.$broadcast("chemicalFilterApplied")
        }

        $scope.removeStructureSearch = function(){
          $rootScope.$broadcast("removeStructureSearch");
        }



        //now we need a way of getting the correct form and schema for this field from the custom fields


      }],
      /*link: function postLink(scope, element, attrs) {
        element.text('this is the SearchFilter directive');
      }*/
    };
  }]);
