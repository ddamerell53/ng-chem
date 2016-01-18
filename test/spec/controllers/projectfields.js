'use strict';

describe('Controller: ProjectfieldsCtrl', function () {

  // load the controller's module
  beforeEach(module('ngChemApp'));

  var ProjectfieldsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ProjectfieldsCtrl = $controller('ProjectfieldsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
