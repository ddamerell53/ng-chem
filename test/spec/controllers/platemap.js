'use strict';

describe('Controller: PlatemapCtrl', function () {

  // load the controller's module
  beforeEach(module('ngChemApp'));

  var PlatemapCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PlatemapCtrl = $controller('PlatemapCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
