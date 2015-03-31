'use strict';

describe('Service: ProjectCustomFields', function () {

  // load the service's module
  beforeEach(module('ngChemApp'));

  // instantiate service
  var ProjectCustomFields;
  beforeEach(inject(function (_ProjectCustomFields_) {
    ProjectCustomFields = _ProjectCustomFields_;
  }));

  it('should do something', function () {
    expect(!!ProjectCustomFields).toBe(true);
  });

});
