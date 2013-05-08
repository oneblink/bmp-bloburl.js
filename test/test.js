/*global suite:true, test:true, setup:true, teardown:true*/ // mocha
/*global assert:true*/ // chai
/*jslint indent:2*/
/*jslint browser:true*/

suite('BMP BlobURL poly-fill: URL', function () {
  'use strict';
  var URL = window.URL,
    BMP = window.BMP,
    $ = window.$;

  test('URL.createObjectURL', function () {
    assert(URL.createObjectURL, 'method itself is truthy / defined');
  });

  test('URL.revokeObjectURL', function () {
    assert(URL.revokeObjectURL, 'method itself is truthy / defined');
  });

  suite('jQuery adapter (for retrieval)', function () {

    test('create-retrieve flow with test Blob', function (done) {
      var blob = BMP.Blob.create(['abc'], {type: 'text/plain'}),
        uri;
  
      uri = URL.createObjectURL(blob);
      assert(typeof uri === 'string', 'URL.createObjectURL returns a string');
      $.ajax(uri)
        .success(function (data, status, jqXHR) {
          assert(jqXHR.status === 200, 'request for Blob results in HTTP 200');
          assert(data === 'abc', 'retrieved Blob has matching contents');
          done();
        })
        .fail(function (jqXHR, status, error) {
          assert(false, 'request for Blob should not result in HTTP 500');
          done();
        });
    });
  
    test('create-revoke flow with test Blob', function (done) {
      var blob = BMP.Blob.create(['abc'], {type: 'text/plain'}),
        uri;
  
      uri = URL.createObjectURL(blob);
      URL.revokeObjectURL(uri);
      $.ajax(uri)
        .success(function (data, status, jqXHR) {
          assert(false, 'request for Blob should not result in HTTP 200');
          done();
        })
        .fail(function (jqXHR, status, error) {
          assert(true, 'request for Blob results in failure');
          done();
        });
    });

  }); // END: suite('jQuery Adapter...')



}); // END: suite('Require.JS', ...)
