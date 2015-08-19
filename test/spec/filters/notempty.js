'use strict';

describe('Filter: notEmpty', function () {

  // load the filter's module
  beforeEach(module('chembiohubAssayApp'));

  // initialize a new instance of the filter before each test
  var notEmpty;
  beforeEach(inject(function ($filter) {
    notEmpty = $filter('notEmpty');
  }));

  it('should return the input prefixed with "notEmpty filter:"', function () {
    var text = 'angularjs';
    expect(notEmpty(text)).toBe('notEmpty filter: ' + text);
  });

});
