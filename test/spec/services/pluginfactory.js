'use strict';

describe('Service: PluginFactory', function () {

  // load the service's module
  beforeEach(module('ngChemApp'));

  // instantiate service
  var PluginFactory;
  beforeEach(inject(function (_PluginFactory_) {
    PluginFactory = _PluginFactory_;
  }));

  it('should do something', function () {
    expect(!!PluginFactory).toBe(true);
  });

});
