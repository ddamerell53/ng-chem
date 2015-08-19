'use strict';

describe('Service: MessageFactory', function () {

  // load the service's module
  beforeEach(module('chembiohubAssayApp'));

  // instantiate service
  var MessageFactory;
  beforeEach(inject(function (_MessageFactory_) {
    MessageFactory = _MessageFactory_;
  }));

  it('should do something', function () {
    expect(!!MessageFactory).toBe(true);
  });

});
