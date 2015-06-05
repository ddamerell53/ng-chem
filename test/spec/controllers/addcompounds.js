'use strict';

describe('Controller: AddcompoundsCtrl', function () {

  // load the controller's module
  beforeEach(module('ngChemApp'));

  var AddcompoundsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AddcompoundsCtrl = $controller('AddcompoundsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
