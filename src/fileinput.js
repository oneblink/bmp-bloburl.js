/*jslint browser:true, indent:2, nomen:true*/
/*global $, _*/
(function (window) {
  'use strict';
  var BMP,
    FileInput;

  window.BMP = window.BMP || {};
  BMP = window.BMP;

  /**
   * @param {jQuery|Element} element to be enhanced.
   * @constructor
   */
  FileInput = function (element) {
    if (element instanceof $ && element.length === 1) {
      this.$el = element;
      this.el = this.$el[0];
    } else if (_.isElement(element)) {
      this.el = element;
      this.$el = $(this.el);
    } else {
      throw new Error('BMP.FileInput constructor expects a single DOM Element');
    }
    return this;
  };

  FileInput.prototype.size = function () {
    if (this.el && this.$el.val() && this.el.files) {
      return this.el.files.length;
    }
    return 0;
  };

  /**
   * @param {Number} [index] of the requested file, defaults to 0
   * @returns {Blob}
   */
  FileInput.prototype.getNativeBlob = function (index) {
    var size;
    if (!index || !_.isNumber(index)) {
      index = 0;
    }
    size = this.size();
    if (size <= index) {
      throw new RangeError('targetIndex: ' + index + '; size:' + size);
    }
    return this.el.files[index];
  };

  /**
   * returns (via Promise) a BMP.Blob
   * @param {Number} [index] of the requested file, defaults to 0
   * @returns {Promise}
   */
  FileInput.prototype.getBlob = function (index) {
    var dfrd = new $.Deferred();
    BMP.Blob.fromNativeBlob(this.getNativeBlob(index), function (blob) {
      dfrd.resolve(blob);
    }, dfrd.reject);
    return dfrd.promise();
  };

  /**
   * establishes event-handlers
   */
  FileInput.initialize = function () {
    $(document.body).on('click', 'input[type=file]', FileInput.onClick);
  };

  FileInput.onClick = function () {
    var $this = $(this);
    if (!$this.data('fileInput')) {
      $this.data('fileInput', new FileInput(this));
    }
  };

  BMP.FileInput = FileInput;

}(this));
