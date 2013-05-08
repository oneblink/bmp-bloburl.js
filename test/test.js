/*global suite:true, test:true, setup:true, teardown:true*/ // mocha
/*global assert:true*/ // chai
/*jslint indent:2*/
/*jslint browser:true, plusplus:true*/

suite('BMP BlobURL poly-fill: URL', function () {
  'use strict';
  var URL = window.URL,
    BMP = window.BMP,
    $ = window.$,
    convertStringToArrayBuffer;

  // http://stackoverflow.com/questions/6965107
  convertStringToArrayBuffer = function (str) {
    var strLen = str.length,
      buf = new window.ArrayBuffer(str.length * 2), // 2 bytes for each char
      bufView = new window.Uint16Array(buf),
      i;

    for (i = 0; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  };

  test('URL.createObjectURL', function () {
    assert(URL.createObjectURL, 'method itself is truthy / defined');
  });

  test('URL.revokeObjectURL', function () {
    assert(URL.revokeObjectURL, 'method itself is truthy / defined');
  });

  test('create-retrieve flow with text Blob', function (done) {
    var blob = BMP.Blob.create(['abc'], {type: 'text/plain'}),
      uri;

    uri = URL.createObjectURL(blob);
    assert(typeof uri === 'string', 'URL.createObjectURL returns a string');
    window.BMP.Blob.fromBlobURL(uri, function (blob) {
      assert(blob.text === 'abc', 'retrieved Blob has matching contents');
      done();
    }, function (error) {
      assert(false, 'request for Blob should not result in HTTP 500');
      done();
    });
  });

  test('create-revoke flow with text Blob', function (done) {
    var blob = BMP.Blob.create(['abc'], {type: 'text/plain'}),
      uri;

    uri = URL.createObjectURL(blob);
    URL.revokeObjectURL(uri);
    window.BMP.Blob.fromBlobURL(uri, function (blob) {
      assert(false, 'request for Blob should not result in HTTP 200');
      done();
    }, function (error) {
      assert(true, 'request for Blob results in failure');
      done();
    });
  });

  /** this test breaks in Chrome, don't know what Blobs become responseText
  test('create-retrieve flow with JSON Blob', function (done) {
    var blob = BMP.Blob.create(['{"key":"value"}'], {type: 'application/json'}),
      uri;

    uri = URL.createObjectURL(blob);
    assert(typeof uri === 'string', 'URL.createObjectURL returns a string');
    window.BMP.Blob.fromBlobURL(uri, function (blob) {
      var base64 = window.btoa('{"key":"value"}');
      assert.equal(blob.base64, base64, 'retrieved Blob has matching contents');
      done();
    }, function (error) {
      assert(false, 'request for Blob should not result in HTTP 500');
      done();
    });
  });
   */

  /** this test breaks non-native URL
  test('create-retrieve flow with JSON Blob', function (done) {
    var data = convertStringToArrayBuffer('{"key":"value"}'),
      blob = BMP.Blob.create([data], {type: 'application/json'}),
      uri;

    uri = URL.createObjectURL(blob);
    assert(typeof uri === 'string', 'URL.createObjectURL returns a string');
    window.BMP.Blob.fromBlobURL(uri, function (blob) {
      var base64 = window.btoa('{"key":"value"}');
      assert.equal(blob.base64, base64, 'retrieved Blob has matching contents');
      done();
    }, function (error) {
      assert(false, 'request for Blob should not result in HTTP 500');
      done();
    });
  });
   */

}); // END: suite('Require.JS', ...)
