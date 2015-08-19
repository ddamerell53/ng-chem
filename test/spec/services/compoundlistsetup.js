'use strict';

describe('Service: CompoundListSetup', function () {

  // load the service's module
  beforeEach(module('chembiohubAssayApp'));

  // instantiate service
  var CompoundListSetup;
  beforeEach(inject(function (_CompoundListSetup_) {
    CompoundListSetup = _CompoundListSetup_;
  }));

  it('should do something', function () {
    expect(!!CompoundListSetup).toBe(true);
  });

});
