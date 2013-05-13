/*global define:true, require:true*/ // require.js
/*jslint indent:2*/
/*jslint browser:true nomen:true*/

(function (window) {
  'use strict';

  var BMP = window.BMP,
    URL = {},
    generateUUID,
    blobs = {}; // in-memory storage

  /**
   * @param {Blob} blob object to store.
   * @param {Object} [options] optional parameters with 'autoRevoke' attribute.
   * @returns {String} Blob URI.
   */
  URL.createObjectURL = function (blob, options) {
    var key = generateUUID(),
      autoRevoke = !!(options && options.autoRevoke) || false;

    blobs[key] = blob;
    // TODO: handle autoRevoke when specification is finalised
    return 'blob:' + key;
  };

  URL.revokeObjectURL = function (uri) {
    var key = uri.replace('blob:', '');
    delete blobs[key];
  };

  /**
   * non-W3C standard, but used for our implementation
   */
  URL.retrieveObject = function (uri) {
    var key = uri.replace('blob:', '');
    return blobs[key];
  };

  generateUUID = function () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      /*jslint bitwise:true*/
      var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      /*jslint bitwise:false*/
      return v.toString(16);
    });
  };

  window.BMP = window.BMP || {};
  window.BMP.URL = URL;
}(this));
