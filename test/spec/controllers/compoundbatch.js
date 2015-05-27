'use strict';

describe('Controller: CompoundbatchCtrl', function () {

  // load the controller's module
  beforeEach(module('ngChemApp'));

  var CompoundbatchCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CompoundbatchCtrl = $controller('CompoundbatchCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
