'use strict';

describe('Service: HTTPProject', function () {

  // load the service's module
  beforeEach(module('ngChemApp'));

  // instantiate service
  var HTTPProject;
  beforeEach(inject(function (_HTTPProject_) {
    HTTPProject = _HTTPProject_;
  }));

  it('should do something', function () {
    expect(!!HTTPProject).toBe(true);
  });

});
