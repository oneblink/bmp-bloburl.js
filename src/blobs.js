/*global define:true, require:true*/ // require.js
/*jslint indent:2*/
/*jslint browser:true*/

(function (window) {
  'use strict';

  var blobs = {};

  /**
   * emulates (and uses, if available) native URL.createObjectURL
   * @param {Blob|String} blob
   * @param {Function} onSuccess: function (blobURL)
   * @param {Function} onError: function (err)
   */
  blobs.save = function (blob, onSuccess, onError) {
    var successFn, errorFn;
    successFn = onSuccess || function () {};
    errorFn = onError || function () {};
    window.BMP.Blob.fromNativeBlob(blob, function (bmpBlob) { // onSuccess
      var nativeBlob;
      bmpBlob.makeNested();
      nativeBlob = bmpBlob.toNative();
      if (!window.URL || !window.URL.createObjectURL) {
        successFn(window.BMP.URL.createObjectURL(nativeBlob));
      } else {
        successFn(window.URL.createObjectURL(nativeBlob));
      }
    }, function (err) { // onError
      errorFn(err);
    });
  };

  /**
   * @param {String} blobURL
   * @param {Function} onSuccess: function (blobURL)
   * @param {Function} onError: function (err)
   */
  blobs.get = function (blobURL, onSuccess, onError) {
    var successFn, errorFn, blob;
    successFn = onSuccess || function () {};
    errorFn = onError || function () {};
    window.BMP.Blob.fromBlobURL(blobURL, function (blob) { // onSuccess
      blob.undoNested();
      successFn(blob);
    }, function (err) { // onError
      errorFn(err);
    });
  };

  /**
   * emulates (and uses, if available) native URL.revokeObjectURL
   * @param {String} blobURL
   */
  blobs.remove = function (blobURL) {
    if (window.URL && window.URL.revokeObjectURL) {
      window.URL.revokeObjectURL(blobURL);
    }
    delete blobs[blobURL];
  };

  window.BMP = window.BMP || {};
  window.BMP.blobs = blobs;
}(this));
