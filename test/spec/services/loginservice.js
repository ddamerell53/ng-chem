'use strict';

describe('Service: LoginService', function () {

  // load the service's module
  beforeEach(module('ngChemApp'));

  // instantiate service
  var LoginService;
  beforeEach(inject(function (_LoginService_) {
    LoginService = _LoginService_;
  }));

  it('should do something', function () {
    expect(!!LoginService).toBe(true);
  });

});
