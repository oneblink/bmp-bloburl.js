(function (window) {
  'use strict';
  var BMP,
    MIME;

  window.BMP = window.BMP || {};
  BMP = window.BMP;

  BMP.MIME = BMP.MIME || {};
  MIME = BMP.MIME;

  /**
   * @const
   */
  MIME.TEXT_TYPES = [
    'application/javascript',
    'application/json',
    'application/x-javascript'
  ];

  /**
   * @param {String} type e.g. 'image/jpeg'
   * @returns {Boolean}
   */
  MIME.isText = function (type) {
    // TODO: strip type parameters (semi-colon and onwards) ??
    if (type.indexOf('text/') === 0) {
      return true;
    }
    if (MIME.TEXT_TYPES.indexOf(type) !== -1) {
      return true;
    }
    return false;
  };

}(this));
