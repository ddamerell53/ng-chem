'use strict';

describe('Directive: chemsvg', function () {

  // load the directive's module
  beforeEach(module('chembiohubAssayApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<chemsvg></chemsvg>');
    scope.smiles = 'CCCCCC'
    element = $compile(element)(scope);
    expect(element.attr('ng-show')).toBe('CCCCCC');
  }));
});
