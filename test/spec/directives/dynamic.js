'use strict';

describe('Directive: dynamic', function () {

  // load the directive's module
  beforeEach(module('chembiohubAssayApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<dynamic></dynamic>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the dynamic directive');
  }));
});
