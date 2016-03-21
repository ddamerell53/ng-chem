'use strict';

describe('Filter: encodeParamForSearch', function () {

  // load the filter's module
  beforeEach(module('ngChemApp'));

  // initialize a new instance of the filter before each test
  var encodeParamForSearch;
  beforeEach(inject(function ($filter) {
    encodeParamForSearch = $filter('encodeParamForSearch');
  }));

  it('should return the input prefixed with "encodeParamForSearch filter:"', function () {
    var text = 'angularjs';
    expect(encodeParamForSearch(text)).toBe('encodeParamForSearch filter: ' + text);
  });

});
