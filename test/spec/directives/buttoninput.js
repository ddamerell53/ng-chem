'use strict';

describe('Directive: buttonInput', function () {

  // load the directive's module
  beforeEach(module('ngChemApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<button-input></button-input>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the buttonInput directive');
  }));
});
