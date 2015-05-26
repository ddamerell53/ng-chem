'use strict';

describe('Service: searchUrlParams', function () {

  // load the service's module
  beforeEach(module('ngChemApp'));

  // instantiate service
  var searchUrlParams;
  beforeEach(inject(function (_searchUrlParams_) {
    searchUrlParams = _searchUrlParams_;
  }));

  it('should do something', function () {
    expect(!!searchUrlParams).toBe(true);
  });

});
