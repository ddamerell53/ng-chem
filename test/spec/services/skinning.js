'use strict';

describe('Service: skinning', function () {

  // load the service's module
  beforeEach(module('chembiohubAssayApp'));

  // instantiate service
  var skinning;
  beforeEach(inject(function (_skinning_) {
    skinning = _skinning_;
  }));

  it('should do something', function () {
    expect(!!skinning).toBe(true);
  });

});
