'use strict';

describe('Service: ViewDataFactory', function () {

  // load the service's module
  beforeEach(module('ngChemApp'));

  // instantiate service
  var ViewDataFactory;
  beforeEach(inject(function (_ViewDataFactory_) {
    ViewDataFactory = _ViewDataFactory_;
  }));

  it('should do something', function () {
    expect(!!ViewDataFactory).toBe(true);
  });

});
