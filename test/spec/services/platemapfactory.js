'use strict';

describe('Service: PlateMapFactory', function () {

  // load the service's module
  beforeEach(module('ngChemApp'));

  // instantiate service
  var PlateMapFactory;
  beforeEach(inject(function (_PlateMapFactory_) {
    PlateMapFactory = _PlateMapFactory_;
  }));

  it('should do something', function () {
    expect(!!PlateMapFactory).toBe(true);
  });

});
