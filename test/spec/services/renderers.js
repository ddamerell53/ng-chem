'use strict';

describe('Service: renderers', function () {

  // load the service's module
  beforeEach(module('ngChemApp'));

  // instantiate service
  var renderers;
  beforeEach(inject(function (_renderers_) {
    renderers = _renderers_;
  }));

  it('should do something', function () {
    expect(!!renderers).toBe(true);
  });

});
