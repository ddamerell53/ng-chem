'use strict';

describe('Controller: SearchassaysctrlCtrl', function () {

  // load the controller's module
  beforeEach(module('ngChemApp'));

  var SearchassaysctrlCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SearchassaysctrlCtrl = $controller('SearchassaysctrlCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
