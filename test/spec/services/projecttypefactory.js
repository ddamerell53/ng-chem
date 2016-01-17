'use strict';

describe('Service: ProjectTypeFactory', function () {

  // load the service's module
  beforeEach(module('ngChemApp'));

  // instantiate service
  var ProjectType;
  beforeEach(inject(function (_ProjectType_) {
    ProjectType = _ProjectType_;
  }));

  it('should do something', function () {
    expect(!!ProjectType).toBe(true);
  });

});
