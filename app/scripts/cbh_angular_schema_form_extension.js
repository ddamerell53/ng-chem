
angular.module("schemaForm").run(["$templateCache", function($templateCache) {

//Changes made - added "draggable" to ui-sortable
//Changed style of close button
//Added a drag handle to demonstrate draggability
//Added more ui-sortable styles in chemreg-specific.css
//Added a way to disable the close on an item if it has an ID
//Moved the description to the top of the list view

$templateCache.put("directives/decorators/bootstrap/array.html","<div sf-array=\"form\" class=\"schema-form-array {{form.htmlClass}}\" ng-model=\"$$value$$\" ng-model-options=\"form.ngModelOptions\"><label class=\"control-label\" ng-show=\"showTitle()\">{{ form.title }}</label><div class=\"help-block\" ng-show=\"(hasError() && errorMessage(schemaError())) || form.description\" ng-bind-html=\"(hasError() && errorMessage(schemaError())) || form.description\"></div><ol class=\"list-group\" ng-model=\"modelArray\" ui-sortable=\"draggable\"><li style=\"cursor: move;\" class=\"list-group-item {{form.fieldHtmlClass}}\" ng-repeat=\"item in modelArray track by $index\"><button ng-hide=\"form.readonly || form.remove === null || item.id\" ng-click=\"deleteFromArray($index)\" style=\"position: relative; z-index: 20; font-size:2em; font-weight:bold; opacity:0.5\" type=\"button\" class=\"close pull-right\"><span aria-hidden=\"true\">&times;</span><span class=\"sr-only\">Close</span></button><sf-decorator ng-init=\"arrayIndex = $index\" form=\"copyWithIndex($index)\"></sf-decorator><span class=\"glyphicon glyphicon-move pull-right \"style=\"color:grey;position: relative; z-index: 20; margin-top:-50px\"></span></li></ol><div class=\"clearfix\" style=\"padding: 15px;\"><button ng-hide=\"form.readonly || form.add === null\" ng-click=\"appendToArray()\" type=\"button\" class=\"btn {{ form.style.add || \'btn-default\' }} pull-right\"><i class=\"glyphicon glyphicon-plus\"></i> {{ form.add || \'Add\'}}</button></div></div>");

//Changes made - added a function from the form element to see if form model is disabled (needs one level down to check the id - this is done in ProjectfieldsCtrl)

$templateCache.put("directives/decorators/bootstrap/default.html","<div class=\"form-group schema-form-{{form.type}} {{form.htmlClass}}\" ng-class=\"{\'has-error\': form.disableErrorState !== true && hasError(), \'has-success\': form.disableSuccessState !== true && hasSuccess(), \'has-feedback\': form.feedback !== false }\"><label class=\"control-label {{form.labelHtmlClass}}\" ng-class=\"{\'sr-only\': !showTitle()}\" for=\"{{form.key.slice(-1)[0]}}\">{{form.title}}</label> <input ng-if=\"!form.fieldAddonLeft && !form.fieldAddonRight\" ng-show=\"form.key\" type=\"{{form.type}}\" step=\"any\" sf-changed=\"form\" placeholder=\"{{form.placeholder}}\" class=\"form-control {{form.fieldHtmlClass}}\" id=\"{{form.key.slice(-1)[0]}}\" ng-model-options=\"form.ngModelOptions\" ng-model=\"$$value$$\" ng-disabled=\"form.readonly ? true : (form.isReadOnly ? form.isReadOnly(form.key) : false)\" schema-validate=\"form\" name=\"{{form.key.slice(-1)[0]}}\" aria-describedby=\"{{form.key.slice(-1)[0] + \'Status\'}}\"><div ng-if=\"form.fieldAddonLeft || form.fieldAddonRight\" ng-class=\"{\'input-group\': (form.fieldAddonLeft || form.fieldAddonRight)}\"><span ng-if=\"form.fieldAddonLeft\" class=\"input-group-addon\" ng-bind-html=\"form.fieldAddonLeft\"></span> <input ng-show=\"form.key\" type=\"{{form.type}}\" step=\"any\" sf-changed=\"form\" placeholder=\"{{form.placeholder}}\" class=\"form-control {{form.fieldHtmlClass}}\" id=\"{{form.key.slice(-1)[0]}}\" ng-model-options=\"form.ngModelOptions\" ng-model=\"$$value$$\" ng-disabled=\"form.readonly\" schema-validate=\"form\" name=\"{{form.key.slice(-1)[0]}}\" aria-describedby=\"{{form.key.slice(-1)[0] + \'Status\'}}\"> <span ng-if=\"form.fieldAddonRight\" class=\"input-group-addon\" ng-bind-html=\"form.fieldAddonRight\"></span></div><span ng-if=\"form.feedback !== false\" class=\"form-control-feedback\" ng-class=\"evalInScope(form.feedback) || {\'glyphicon\': true, \'glyphicon-ok\': hasSuccess(), \'glyphicon-remove\': hasError() }\" aria-hidden=\"true\"></span> <span ng-if=\"hasError() || hasSuccess()\" id=\"{{form.key.slice(-1)[0] + \'Status\'}}\" class=\"sr-only\">{{ hasSuccess() ? \'(success)\' : \'(error)\' }}</span><div class=\"help-block\" sf-message=\"form.description\"></div></div>");


}]);




function mergeKeyArrays(left, right)
{
    var result = [];
 
    while (left.length && right.length) {
        if (left[0].key.toLowerCase() <= right[0].key.toLowerCase()) {
            result.push(left.shift());
        } else {
            result.push(right.shift());
        }
    }
 
    while (left.length)
        result.push(left.shift());
 
    while (right.length)
        result.push(right.shift());
 
    return result;
}




angular.module('schemaForm').config(
['schemaFormProvider', 'schemaFormDecoratorsProvider', 'sfPathProvider','sfBuilderProvider',
  function(schemaFormProvider,  schemaFormDecoratorsProvider, sfPathProvider, sfBuilderProvider) {

  var simpleTransclusion  = sfBuilderProvider.builders.simpleTransclusion;
  var ngModelOptions      = sfBuilderProvider.builders.ngModelOptions;
  var ngModel             = sfBuilderProvider.builders.ngModel;
  var sfField             = sfBuilderProvider.builders.sfField;
  var condition           = sfBuilderProvider.builders.condition;
  var array               = sfBuilderProvider.builders.array;
    var filtereddropdown = function(name, schema, options) {
      if (schema.type === 'object' && schema.format == 'filtereddropdown') {
        var f = schemaFormProvider.stdFormObj(name, schema, options);
        f.key  = options.path;
        f.type = 'filtereddropdown';
        options.lookup[sfPathProvider.stringify(options.path)] = f;
        return f;
      }
    };

    // schemaFormProvider.defaults.object.unshift(filtereddropdown);

  //Add to the bootstrap directive
    schemaFormDecoratorsProvider.addMapping('bootstrapDecorator', 'filtereddropdown',
    'views/templates/filtered-dropdown-form-template.html', [sfField, ngModelOptions, ngModel, array, condition]);
    schemaFormDecoratorsProvider.createDirective('filtereddropdown',
    'views/templates/filtered-dropdown-form-template.html');


  }]);


angular.module('schemaForm')
  .controller('filtereddropdownController', 
    function ($scope, $rootScope, $timeout, $filter) {
    $scope.loading = true;
    $scope.opened = function(key, autoComp){
         $rootScope.$broadcast($scope.form.options.fetchDataEventName, {'key': key, 'autocomplete' : autoComp});
    };
    $scope.autoComp = "";
    //if there are static items defined, sort them and make them into right format
    if($scope.form.options.staticItems){
       $scope.form.options.staticItems.sort(function(item1, item2){ 
        if ( item1.key < item2.key )
          return -1;
        if ( item1.key > item2.key )
          return 1;
        return 0;
      })

    }
    if($scope.form.options.dataArrivesEventName){

        $scope.$on($scope.form.options.dataArrivesEventName , function(event, autocompletedata){


        if($scope.autoComp == autocompletedata.autocomplete){
          //The data is not out of date - if the user types quickly we are pulling back
          //results for every letter typed so we have to be sure the data is still valid
          //We could already be waiting for the next result!
              $scope.loading = false;
              var sortedStaticItems = [];
              if($scope.form.options.staticItems){
                sortedStaticItems = angular.copy($scope.form.options.staticItems);
              }
              //The static items still need to be filtered for autocomplete for consistency
              var autocompleteStatic = $filter('filter')(sortedStaticItems, {key: $scope.autoComp})
              //Merge together the static items from the schema with the dynamic items from the back end
              //This gives a total list of items as desired
              $scope.items = mergeKeyArrays(autocompletedata.items, autocompleteStatic) ;
              if($scope.autoComp){
                var autoCompleteExistsOnBackend = false;
                angular.forEach($scope.items, function(item){
                    if(item.key.toLowerCase() == $scope.autoComp){
                      autoCompleteExistsOnBackend = true;
                    }
                });
                if(autoCompleteExistsOnBackend){
                  $scope.autoCompNotInList = undefined;
                }else{
                  $scope.autoCompNotInList = {"key" : $scope.autoComp, doc_count: 0};
                }
              }else{
                $scope.autoCompNotInList = undefined;
              }
              
              $scope.numberItemsMissing = autocompletedata.unique_count - autocompletedata.items.length;
            }else{
              //The user must have changed the autocomplete in between times
            }
            
        });
    }
    $scope.$watch("autoComp", function(newVal, oldVal){
      //when the user searches, we call the back end to get 
      if(newVal != oldVal){
        
          //Filter via the back end as it is more accurate
          $scope.opened($scope.form.key, $scope.autoComp);
        
      }
    });

    $scope.autoCompNotInList = undefined;
    $scope.newTags = [];
    $scope.newTagsObjects = [];


    if($scope.form.options.multiple){
      $scope.checkItem = function(key, $$value$$){
        if(!angular.isDefined($$value$$)){
          return -1;
        }
        return $$value$$.indexOf(key)
      }
      $scope.toggleItem = function(item,  isNewItem){
        $timeout(function(){
            $scope.$apply(function(){
              var index;
                index = $scope.model[$scope.form.key[0]].indexOf(item.key);
              
            
            var newTagIndex = $scope.newTags.indexOf(item.key);
              if(index == -1){
                  $scope.model[$scope.form.key[0]].push(item.key); 
                  if(isNewItem){
                    $scope.newTags.push(item.key);
                    $scope.newTagsObjects.push(item);
                    //Reset the autocomplete
                    $scope.autoComp = "";
                  }
                  $scope.autoCompNotInList = undefined;
              }else{
                  $scope.model[$scope.form.key[0]].splice(index, 1);
                  if(isNewItem){
                    $scope.newTags.splice(newTagIndex, 1);
                    $scope.newTagsObjects.splice(newTagIndex, 1);
                  }
              
                }
            });
            
            $scope.evalExpr($scope.form.onChange, {'modelValue': $scope.model[$scope.form.key[0]], form: $scope.form});
        })
      }
    }else {
      $scope.checkItem = function(key, $$value$$){
        if(!angular.isDefined($$value$$)){
          return -1;
        }
        if( $$value$$ == key){
          return 1;
        }else{
          return -1;
        }
      }
      $scope.toggleItem = function(item,  isNewItem){
        
        $timeout(function(){
            $scope.$apply(function(){
              var toggleOff = false;
              if($scope.model[$scope.form.key[0]] == item.key){
                toggleOff = true;
              }
              
              var newTagIndex = $scope.newTags.indexOf(item.key);
              if(!toggleOff){
                  //If the last item selected was a new item, remove it from the local list
                  if($scope.newTags.indexOf($scope.model[$scope.form.key[0]] ) > -1){
                    $scope.newTags = []
                  }
                  $scope.model[$scope.form.key[0]] = item.key; 
                  if(isNewItem){
                    $scope.newTags.push(item.key);
                    //Reset the autocomplete
                    $scope.autoComp = "";
                  }
                  $scope.autoCompNotInList = undefined;
              }else{
                  $scope.model[$scope.form.key[0]] = "";
                  if(isNewItem){
                    $scope.newTags.splice(newTagIndex, 1);
                  }
              
                }
              //newTagObjects should only contain the selected new tags at any time
              $scope.newTagsObjects = $scope.newTags.map(function(tag){
                return {"key" : tag};
              });
            });
            
            $scope.evalExpr($scope.form.onChange, {'modelValue': $scope.model[$scope.form.key[0]], form: $scope.form});
        })
      }
    }
    
    $scope.items = [];
    
  });

angular.module('schemaForm').config(
['schemaFormProvider', 'schemaFormDecoratorsProvider', 'sfPathProvider',
  function(schemaFormProvider,  schemaFormDecoratorsProvider, sfPathProvider) {

    var chemdoodle = function(name, schema, options) {
      if (schema.type === 'string' && schema.format == 'chemdoodle') {
        var f = schemaFormProvider.stdFormObj(name, schema, options);
        f.key  = options.path;
        f.type = 'chemdoodle';
        options.lookup[sfPathProvider.stringify(options.path)] = f;
        return f;
      }
    };

    schemaFormProvider.defaults.object.unshift(chemdoodle);

  //Add to the bootstrap directive
    schemaFormDecoratorsProvider.addMapping('bootstrapDecorator', 'chemdoodle',
    'views/templates/chemdoodle-form-template.html');
    /*schemaFormDecoratorsProvider.createDirective('chemdoodle',
    'directives/decorators/bootstrap/chemdoodle/chemdoodle-form-template.html');*/
  }]);






