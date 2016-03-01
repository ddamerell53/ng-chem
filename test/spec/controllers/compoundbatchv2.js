'use strict';

describe('Controller: Compoundbatchv2Ctrl', function () {

  // load the controller's module
  beforeEach(module('ngChemApp'));

  var Compoundbatchv2Ctrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    Compoundbatchv2Ctrl = $controller('Compoundbatchv2Ctrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
