/*global suite:true, test:true, setup:true, teardown:true*/ // mocha
/*global assert:true*/ // chai
/*jslint indent:2*/
/*jslint browser:true*/

suite('browser globals', function () {
  'use strict';
  var URL = window.URL,
    BMP = window.BMP;

  test('URL definition', function () {
    assert(URL, 'using native URL support');
    assert(URL.createObjectURL, 'using Blob URL support for create');
    assert(URL.revokeObjectURL, 'using Blob URL support for revoke');
  });
}); // END: suite('Require.JS', ...)
