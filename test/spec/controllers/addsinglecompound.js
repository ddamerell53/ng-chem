'use strict';

describe('Controller: AddsinglecompoundCtrl', function () {

  // load the controller's module
  beforeEach(module('ngChemApp'));

  var AddsinglecompoundCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AddsinglecompoundCtrl = $controller('AddsinglecompoundCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
