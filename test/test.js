/*global suite:true, test:true, setup:true, teardown:true, suiteSetup:true,
suiteTeardown:true*/ // mocha
/*global assert:true*/ // chai
/*jslint indent:2*/
/*jslint browser:true, plusplus:true*/

suite('BMP MIME', function () {
  'use strict';
  var MIME = window.BMP.MIME;

  test('MIME.isText', function () {
    assert(MIME.isText('text/plain'), 'text/plain');
    assert(MIME.isText('application/json'), 'application/json');
    assert(MIME.isText('application/javascript'), 'application/javascript');
    assert(!MIME.isText('image/jpeg'), 'image/jpeg');
  });

}); // END: suite('BMP MIME'...)

suite('BMP Blob', function () {
  'use strict';
  var BMP = window.BMP,
    base64 = window.btoa('123'); // "MTIz"

  test('application/... with (un)nesting', function () {
    var blob;
    blob = new BMP.Blob([base64], {type: 'application/octet-stream'});
    assert.equal(blob.base64, base64, 'fresh BMP.Blob has base64 set');
    assert.equal(blob.type, 'application/octet-stream');
    assert(!blob.text, '.test should not be defined');
    blob.makeNested();
    assert(!blob.base64, '.base64 should no longer be defined');
    assert.equal(blob.text, 'data:application/octet-stream;base64,' + base64);
    assert.equal(blob.type, 'text/plain');
    blob.undoNested();
    assert(!blob.text, '.text should no longer be defined');
    assert.equal(blob.base64, base64);
    assert.equal(blob.type, 'application/octet-stream');
  });

  test('text/plain with (un)nesting', function () {
    var blob;
    blob = new BMP.Blob([base64], {type: 'text/plain'});
    assert.equal(blob.base64, base64, 'fresh BMP.Blob has base64 set');
    assert.equal(blob.type, 'text/plain', 'fresh BMP.Blob has text set');
    assert(!blob.text, '.test should not be defined');
    blob.makeNested();
    assert.equal(blob.text, 'data:text/plain;base64,' + base64, 'post-nested blob.text');
    assert.equal(blob.type, 'text/plain', 'post-nested blob.type');
    assert(!blob.base64, '.base64 should not be defined');
    blob.undoNested();
    assert.equal(blob.base64, base64, 'un-nested blob.base64');
    assert.equal(blob.type, 'text/plain', 'un-nested blob.type');
    assert(!blob.text, '.text should not be defined');
  });

}); // END: suite('BMP Blob'...)
