'use strict';

describe('Directive: appProgress', function () {

  // load the directive's module
  beforeEach(module('chembiohubAssayApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<app-progress></app-progress>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the appProgress directive');
  }));
});
