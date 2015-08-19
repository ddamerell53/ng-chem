'use strict';

describe('Service: projectfactory', function () {

  // load the service's module
  beforeEach(module('chembiohubAssayApp'));

  // instantiate service
  var projectfactory;
  beforeEach(inject(function (_projectfactory_) {
    projectfactory = _projectfactory_;
  }));

  it('should do something', function () {
    expect(!!projectfactory).toBe(true);
  });

});
