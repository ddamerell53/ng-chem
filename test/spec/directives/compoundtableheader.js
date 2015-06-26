'use strict';

describe('Directive: compoundTableHeader', function () {

  // load the directive's module
  beforeEach(module('ngChemApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<compound-table-header></compound-table-header>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the compoundTableHeader directive');
  }));
});
