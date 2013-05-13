/*global suite:true, test:true, setup:true, teardown:true*/ // mocha
/*global assert:true*/ // chai
/*jslint indent:2*/
/*jslint browser:true*/

suite('browser globals', function () {
  'use strict';
  var URL = window.URL

  test('URL definition', function () {
    assert(!URL.createObjectURL, 'no native URL');
  });
}); // END: suite('Require.JS', ...)
