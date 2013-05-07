/*jslint indent:2*/
/*jslint browser:true*/
/*jslint nomen:true, plusplus:true*/

(function (window) {
  'use strict';
  var b, isConstructableBlob = true,
    Blob;

  try {
    b = new window.Blob();
    b = null;
  } catch (err) {
    isConstructableBlob = false;
  }

  /**
   * @constructor
   * @param {Array} [data] zero or more {ArrayBuffer|ArrayBufferView|Blob|String}
   * @param {Object} [options] properties Object with "type" attribute
   */
  Blob = function (data, options) {
    var d,
      dLength,
      datum;

    if (data && !Array.isArray(data)) {
      throw new Error('first argument should be an Array');
    }

    options = options || {};

    this.size = 0;
    this.type = '';
    this.bytes = '';
    this.closed = new Date(0);

    if (data) {
      dLength = data.length;
      for (d = 0; d < dLength; d++) {
        datum = data[d];
        if (typeof datum === 'string') {
          this.size += datum.length;
          this.bytes += datum;

        } else if (datum instanceof Blob) {
          this.size += datum.size;
          this.bytes += datum.bytes;
        }
        // TODO: check for ArrayBufferView, ArrayBuffer and Blob arguments
      }
    }

    if (typeof options === 'object') {
      this.type = options.type || this.type;
    }

    return this;
  };

  Blob.prototype.slice = function () {
  };

  Blob.prototype.close = function () {
    this.closed = new Date();
  };

  /**
   * cross-browser constructor for Blob
   * @param {Array} data Array of {ArrayBuffer|ArrayBufferView|Blob|String}.
   * @param {Object} [options] optional Object with "type" attribute
   */
  Blob.create = function (data, options) {
    var builder;
    options = options || {};
    if (isConstructableBlob) {
      return new window.Blob(data, options);
    }
    if (window.BlobBuilder) {
      builder = new window.BlobBuilder();
      builder.append(data);
      return builder.getBlob(options);
    }
    return new Blob(data, options);
  };

  window.BMP = window.BMP || {};
  window.BMP.Blob = Blob;
  window.Blob = window.Blob || Blob;
}(this));
