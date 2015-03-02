'use strict';

describe('Directive: projectList', function () {

  // load the directive's module
  beforeEach(module('ngChemApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<project-list></project-list>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the projectList directive');
  }));
});
