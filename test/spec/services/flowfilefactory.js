'use strict';

describe('Service: FlowFileFactory', function () {

  // load the service's module
  beforeEach(module('ngChemApp'));

  // instantiate service
  var FlowFileFactory;
  beforeEach(inject(function (_FlowFileFactory_) {
    FlowFileFactory = _FlowFileFactory_;
  }));

  it('should do something', function () {
    expect(!!FlowFileFactory).toBe(true);
  });

});
