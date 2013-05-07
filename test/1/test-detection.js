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

  test('Blob definition', function () {
    assert(Blob !== BMP.Blob, 'using native Blob support');
  });

  test('FileReader definition', function () {
    assert(FileReader !== BMP.FileReader, 'using native FileReader support');
  });
}); // END: suite('Require.JS', ...)
