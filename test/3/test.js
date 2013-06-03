/*global suite, test, setup, teardown, suiteSetup, suiteTeardown*/ // mocha
/*global assert, sinon*/ // chai + sinon
/*global $, BMP*/
/*jslint indent:2*/
/*jslint browser:true, plusplus:true*/

suite('BMP.FileInput', function () {
  'use strict';
  var FileInput = BMP.FileInput;

  suiteSetup(function () {
    FileInput.initialize();
  });

  suite('FileInput.onClick', function () {
    var $input, spy;

    setup(function () {
      $(document.body).off('click', 'input[type=file]', FileInput.onClick);
      $input = $('<input type="file" />').appendTo(document.body);
      spy = sinon.spy(FileInput, 'onClick');
      FileInput.initialize();
    });

    test('FileInput.onClick is called', function () {
      $input.trigger('click');
      assert(spy.called);
    });

    teardown(function () {
      $(document.body).off('click', 'input[type=file]', FileInput.onClick);
      FileInput.onClick.restore();
      FileInput.initialize();
      $input.remove();
    });

  }); // END: suite('FileInput.onClick'...)

  suite('with no selected Files', function () {
    var $input, fileInput;

    setup(function () {
      $input = $('<input type="file" />').appendTo(document.body);
      $input.trigger('click');
      fileInput = $input.data('fileInput');
    });

    test('fileInput stored as jQuery element data', function () {
      assert.isObject(fileInput);
      assert.instanceOf(fileInput, FileInput);
    });

    test('fileInput.size() returns 0', function () {
      assert.property(fileInput, 'size');
      assert.equal(fileInput.size(), 0);
    });

    test('fileInput.getBlob() throws RangeError', function () {
      assert.throws(function () {
        fileInput.getBlob();
      }, RangeError);
    });

    teardown(function () {
      $input.remove();
    });

  }); // END: suite('with no selected Files'...)

  suite('with a simulated selected File', function () {
    var $input, fileInput, stub;

    setup(function () {
      var base64, data, nativeBlob;
      $input = $('<input type="file" />').appendTo(document.body);
      $input.trigger('click');
      fileInput = $input.data('fileInput');

      base64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAAAAAA6fptVAAAACklEQVQI12P4DwABAQEAG7buVgAAAABJRU5ErkJgggAA';
      data = [window.Base64Binary.decodeArrayBuffer(base64)];
      nativeBlob = window.BMP.Blob.createNative(data, {type: 'image/png'});
      stub = sinon.stub(fileInput, 'getNativeBlob', function () {
        return nativeBlob;
      });
    });

    test('fileInput stored as jQuery element data', function () {
      assert.isObject(fileInput);
      assert.instanceOf(fileInput, FileInput);
    });

    test('fileInput.size() returns 1', function () {
      assert.property(fileInput, 'size');
      assert.equal(fileInput.size(), 0);
    });

    test('fileInput.getBlob() returns BMP.Blob', function (done) {
      fileInput.getBlob().then(function (blob) { //onSuccess
        assert(true, 'promise was resolved');
        assert.isObject(blob);
        assert.instanceOf(blob, BMP.Blob);
        done();
      }, function (error) { //onError
        assert.fail(true, false, 'promise was rejected');
        done();
      });
    });

    test('fileInput.getBlob(0) returns BMP.Blob', function (done) {
      fileInput.getBlob(0).then(function (blob) { //onSuccess
        assert(true, 'promise was resolved');
        assert.isObject(blob);
        assert.instanceOf(blob, BMP.Blob);
        done();
      }, function (error) { //onError
        assert.fail(true, false, 'promise was rejected');
        done();
      });
    });

    teardown(function () {
      $input.remove();
    });

  }); // END: with a simulated selected File

}); // END: suite('BMP.FileInput'...)
