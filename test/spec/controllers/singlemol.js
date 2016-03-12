'use strict';

describe('Controller: SinglemolCtrl', function () {

  // load the controller's module
  beforeEach(module('ngChemApp'));

  var SinglemolCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SinglemolCtrl = $controller('SinglemolCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
