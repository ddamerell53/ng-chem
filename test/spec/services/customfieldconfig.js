'use strict';

describe('Service: customFieldConfig', function () {

  // load the service's module
  beforeEach(module('ngChemApp'));

  // instantiate service
  var customFieldConfig;
  beforeEach(inject(function (_customFieldConfig_) {
    customFieldConfig = _customFieldConfig_;
  }));

  it('should do something', function () {
    expect(!!customFieldConfig).toBe(true);
  });

});
