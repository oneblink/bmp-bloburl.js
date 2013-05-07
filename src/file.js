/*jslint indent:2*/
/*jslint browser:true*/

(function (window) {
  'use strict';
  var Blob = window.Blob,
    File;

  /**
   * same optional arguments as Blob
   */
  File = function () {
    var args = Array.prototype.slice.call(arguments);
    Blob.apply(this, args);

    this.name = '';
    this.lastModifiedDate = new Date(); // TODO: not now :)

    return this;
  };

  File.prototype = Object.create(Blob.prototype);

  window.BMP = window.BMP || {};
  window.BMP.File = File;
  window.File = window.File || File;
}(this));
