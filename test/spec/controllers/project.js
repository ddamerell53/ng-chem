'use strict';

describe('Controller: ProjectctrlCtrl', function () {

  // load the controller's module
  beforeEach(module('ngChemApp'));

  var ProjectctrlCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ProjectctrlCtrl = $controller('ProjectctrlCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
