'use strict';

describe('Controller: DataoverviewCtrl', function () {

  // load the controller's module
  beforeEach(module('ngChemApp'));

  var DataoverviewCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DataoverviewCtrl = $controller('DataoverviewCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
