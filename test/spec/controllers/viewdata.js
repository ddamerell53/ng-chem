'use strict';

describe('Controller: ViewdataCtrl', function () {

  // load the controller's module
  beforeEach(module('ngChemApp'));

  var ViewdataCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ViewdataCtrl = $controller('ViewdataCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
