'use strict';

describe('Directive: diableAnimation', function () {

  // load the directive's module
  beforeEach(module('ngChemApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<diable-animation></diable-animation>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the diableAnimation directive');
  }));
});
