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
  var BMP = window.BMP;

  test('application/... with (un)nesting', function () {
    var blob;
    blob = new BMP.Blob(['123'], {type: 'application/octet-stream'});
    assert.equal(blob.base64, '123');
    assert.equal(blob.type, 'application/octet-stream');
    blob.makeNested();
    assert(!blob.base64, '.base64 should no longer be defined');
    assert.equal(blob.text, 'data:application/octet-stream;base64,123');
    assert.equal(blob.type, 'text/plain');
    blob.undoNested();
    assert(!blob.text, '.text should no longer be defined');
    assert.equal(blob.base64, '123');
    assert.equal(blob.type, 'application/octet-stream');
  });

  test('text/plain with (un)nesting', function () {
    var blob;
    blob = new BMP.Blob(['123'], {type: 'text/plain'});
    assert.equal(blob.text, '123', 'fresh BMP.Blob has text set');
    assert.equal(blob.type, 'text/plain', 'fresh BMP.Blob has text set');
    assert(!blob.base64, '.base64 should not be defined');
    blob.makeNested();
    assert.equal(blob.text, 'data:text/plain,123', 'post-nested blob.text');
    assert.equal(blob.type, 'text/plain', 'post-nested blob.type');
    assert(!blob.base64, '.base64 should not be defined');
    blob.undoNested();
    assert.equal(blob.text, '123', 'un-nested blob.text');
    assert.equal(blob.type, 'text/plain', 'un-nested blob.type');
    assert(!blob.base64, '.base64 should not be defined');
  });

}); // END: suite('BMP Blob'...)

suite('BMP.blobs', function () {
  'use strict';
  var BMP = window.BMP;

  test('BMP.blobs is globally accessible', function () {
    assert(window.BMP.blobs, '');
  });

  suite('text/... blob', function () {
    var blob, url;

    suiteSetup(function () {
      blob = BMP.Blob.createNative(['abc'], {type: 'text/plain'});
    });

    test('"save" returns a string', function (done) {
      BMP.blobs.save(blob, function (blobURL) { // onSuccess
        assert(true, 'should not return with an error');
        assert.equal(typeof blobURL, 'string', 'blobURL is a string');
        url = blobURL;
        done();
      }, function (err) { // onError
        assert(false, 'should not return with an error');
        done(err);
      });
    });

    test('"get" returns BMP.Blob', function (done) {
      BMP.blobs.get(url, function (blob) { // onSuccess
        assert(true, 'should not return with an error');
        assert(blob instanceof BMP.Blob, 'blob is a BMP.Blob');
        assert.equal(blob.type, 'text/plain', 'correct type was retrieved');
        assert.equal(blob.text, 'abc', 'correct text was retrieved');
        assert(!blob.base64, 'no base64 defined');
        done();
      }, function (err) { // onError
        assert(false, 'should not return with an error');
        done(err);
      });
    });
  });

  suite('binary blob: test/pixel.png', function () {
    var blob, url, base64;

    suiteSetup(function (done) {
      var input;
      this.timeout(30 * 1000);
      base64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAAAAAA6fptVAAAACklEQVQI12P4DwABAQEAG7buVgAAAABJRU5ErkJggg==';
      blob = BMP.Blob.createNative([window.atob(base64)], {type: 'image/png'});
      window.alert('use the file picker to select text/pixel.png');
      input = window.document.createElement('input');
      input.type = 'file';
      window.document.body.appendChild(input);
      input.onchange = function (event) {
        if (input.files && input.files.length) {
          input.onchange = null;
          window.document.body.removeChild(input);
          blob = input.files[0];
          done();
        }
      };
    });

    test('"save" returns a string', function (done) {
      BMP.blobs.save(blob, function (blobURL) { // onSuccess
        assert(true, 'should not return with an error');
        assert.equal(typeof blobURL, 'string', 'blobURL is a string');
        url = blobURL;
        done();
      }, function (err) { // onError
        assert(false, 'should not return with an error');
        done(err);
      });
    });

    test('"get" returns BMP.Blob', function (done) {
      BMP.blobs.get(url, function (blob) { // onSuccess
        assert(true, 'should not return with an error');
        assert(blob instanceof BMP.Blob, 'blob is a BMP.Blob');
        assert.equal(blob.type, 'image/png', 'correct type was retrieved');
        assert.equal(blob.base64, base64, 'correct text was retrieved');
        assert(!blob.text, 'no text defined');
        done();
      }, function (err) { // onError
        assert(false, 'should not return with an error');
        done(err);
      });
    });

  });

});
