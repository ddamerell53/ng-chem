'use strict';

describe('Controller: BatchesCtrl', function () {

  // load the controller's module
  beforeEach(module('ngChemApp'));

  var BatchesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BatchesCtrl = $controller('BatchesCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
