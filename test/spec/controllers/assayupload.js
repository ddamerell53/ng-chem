'use strict';

describe('Controller: AssayuploadCtrl', function () {

  // load the controller's module
  beforeEach(module('ngChemApp'));

  var AssayuploadCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AssayuploadCtrl = $controller('AssayuploadCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
