'use strict';

describe('Service: addData', function () {

  // load the service's module
  beforeEach(module('ngChemApp'));

  // instantiate service
  var addData;
  beforeEach(inject(function (_addData_) {
    addData = _addData_;
  }));

  it('should do something', function () {
    expect(!!addData).toBe(true);
  });

});
