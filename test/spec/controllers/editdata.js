'use strict';

describe('Controller: EditdataCtrl', function () {

  // load the controller's module
  beforeEach(module('ngChemApp'));

  var EditdataCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EditdataCtrl = $controller('EditdataCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
