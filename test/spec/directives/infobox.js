'use strict';

describe('Directive: infoBox', function () {

  // load the directive's module
  beforeEach(module('ngChemApp'));

  var element,
    scope,
    template;

  beforeEach(module('my.templates'));
  //template = '<info-box freetext="" lookup=""></info-box>';

  beforeEach(inject(function ($compile, $rootScope) {
    scope = $rootScope.$new();
    element = angular.element('<info-box freetext="{{freetext}}" lookup="{{lookup}}"></info-box>');
    scope.freetext = "123";
    scope.lookup = "456";
    $compile(element)(scope);
    scope.$digest();
  }));

  /*it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<info-box></info-box>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the infoBox directive');
  }));*/

  /*it('should not display if lookup and freetext both empty', inject(function ($compile) {
    
    //element = $compile(element)(scope);
    //expect(element.attr('freetext')).toBe('');
    //expect(element.attr('lookup')).toBe('');
    var contents = element.find('span.glyphicon');
    expect(contents.html()).toBe('');

  }));*/

  it('should display text if freetext has text', inject(function ($compile, $templateCache) {
    //element = angular.element('<info-box freetext="Text Here"></info-box>');
    //element = $compile(element)(scope);
    //scope.$digest();
    //template = $templateCache.get('to/templates/myTemplate.html');
    var isolated = element.isolateScope();
    /*scope.$apply(function() {
      scope.freetext = '123';
      scope.lookup = '456';
    });*/
    expect(isolated.values.displaytext).toBe('123');
    //var contents = ;
    //expect(contents.html()).toBe('');
    
    //expect(element.find('span.glyphicon').attr('data-content')).toBe('123');
    //expect(element.attr('freetext')).toBe('Text Here');

  }));



});
