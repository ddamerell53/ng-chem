'use strict';

describe('Directive: SearchFilter', function () {

  // load the directive's module
  beforeEach(module('ngChemApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<-search-filter></-search-filter>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the SearchFilter directive');
  }));
});