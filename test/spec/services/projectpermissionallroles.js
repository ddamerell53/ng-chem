'use strict';

describe('Service: ProjectPermissionAllRoles', function () {

  // load the service's module
  beforeEach(module('ngChemApp'));

  // instantiate service
  var ProjectPermissionAllRoles;
  beforeEach(inject(function (_ProjectPermissionAllRoles_) {
    ProjectPermissionAllRoles = _ProjectPermissionAllRoles_;
  }));

  it('should do something', function () {
    expect(!!ProjectPermissionAllRoles).toBe(true);
  });

});
