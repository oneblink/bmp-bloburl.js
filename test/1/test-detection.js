/*global suite:true, test:true, setup:true, teardown:true*/ // mocha
/*global assert:true*/ // chai
/*jslint indent:2*/
/*jslint browser:true*/

suite('browser globals', function () {
  'use strict';
  var URL = window.URL,
    Blob = window.Blob,
    FileReader = window.FileReader,
    BMP = window.BMP,
    $ = window.$;

  test('URL definition', function () {
    assert(URL !== BMP.URL, 'using native URL support');
  });
}); // END: suite('Require.JS', ...)