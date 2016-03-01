'use strict';

describe('Directive: handsoncompoundtablev2', function () {

  // load the directive's module
  beforeEach(module('ngChemApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<handsoncompoundtablev2></handsoncompoundtablev2>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the handsoncompoundtablev2 directive');
  }));
});
