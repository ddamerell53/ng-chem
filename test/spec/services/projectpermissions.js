'use strict';

describe('Service: Projectpermissions', function () {

  // load the service's module
  beforeEach(module('chembiohubAssayApp'));

  // instantiate service
  var Projectpermissions;
  beforeEach(inject(function (_Projectpermissions_) {
    Projectpermissions = _Projectpermissions_;
  }));

  it('should do something', function () {
    expect(!!Projectpermissions).toBe(true);
  });

});
