
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
    // schemaFormDecoratorsProvider.createDirective('filtereddropdown',
    // 'views/templates/filtered-dropdown-form-template.html');


  }]);


angular.module('schemaForm')
  .controller('filtereddropdownController', function ($scope, $rootScope, $timeout) {
    $scope.loading = true;
    $scope.opened = function(key, autoComp){
         $rootScope.$broadcast("openedDropdown", {'key': key, 'autocomplete' : autoComp});
    };

    $rootScope.$on("autoCompleteData", function(event, autocompletedata){
        $scope.loading = false;
        $scope.items = autocompletedata.items;
        $scope.numberItemsMissing = autocompletedata.unique_count - $scope.items.length;
    });
    $scope.$watch("autoComp", function(newVal, oldVal){
      //when the user searches, we call the back end to get 
      if(newVal != oldVal){
        
          //Filter via the back end as it is more accurate
          $scope.opened($scope.form.key, $scope.autoComp);
        
      }
    });

    $scope.toggleItem = function(item, $$value$$){
        $timeout(function(){
            $scope.$apply(function(){
            var index = $$value$$.indexOf(item.key);
            if(index == -1){
                $$value$$.push(item.key); 
            }else{
                $$value$$.splice(index, 1);
            }
            });
            
            $scope.evalExpr($scope.form.onChange, {'modelValue': $$value$$, form: $scope.form});
        })
        
        
    }
    $scope.items = [];
    
  });