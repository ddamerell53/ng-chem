'use strict';

describe('Service: SearchFormSchema', function () {

  // load the service's module
  beforeEach(module('ngChemApp'));

  // instantiate service
  var SearchFormSchema;
  beforeEach(inject(function (_SearchFormSchema_) {
    SearchFormSchema = _SearchFormSchema_;
  }));

  it('should do something', function () {
    expect(!!SearchFormSchema).toBe(true);
  });

});
