'use strict';

describe('Directive: HandsOnCompoundTable', function () {

  // load the directive's module
  beforeEach(module('chembiohubAssayApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<-hands-on-compound-table></-hands-on-compound-table>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the HandsOnCompoundTable directive');
  }));
});
