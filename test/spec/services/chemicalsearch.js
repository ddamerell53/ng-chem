'use strict';

describe('Service: chemicalSearch', function () {

  // load the service's module
  beforeEach(module('ngChemApp'));

  // instantiate service
  var chemicalSearch;
  beforeEach(inject(function (_chemicalSearch_) {
    chemicalSearch = _chemicalSearch_;
  }));

  it('should do something', function () {
    expect(!!chemicalSearch).toBe(true);
  });

});
