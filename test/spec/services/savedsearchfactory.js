'use strict';

describe('Service: SavedSearchFactory', function () {

  // load the service's module
  beforeEach(module('ngChemApp'));

  // instantiate service
  var SavedSearchFactory;
  beforeEach(inject(function (_SavedSearchFactory_) {
    SavedSearchFactory = _SavedSearchFactory_;
  }));

  it('should do something', function () {
    expect(!!SavedSearchFactory).toBe(true);
  });

});
