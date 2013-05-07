/*global define:true, require:true*/ // require.js
/*jslint indent:2*/

(function (window) {
  'use strict';
  var $ = window.$,
    FileReader = window.FileReader,
    oldAjax,
    newAjax,
    retrieveViaFileReader,
    retrieveViaBMPBlob;

  if (!$) {
    return; // no jQuery to be adapted
  }

  oldAjax = $.ajax;
  /**
   * duck-punch jQuery.ajax to support Blob URIs, much of this is
   * inspired by the way $.ajax already works, so check their code
   * @param {String} [url]
   * @param {Object} [options]
   */
  newAjax = function (url, options) {
    var jqXHR,
      blobURL,
      blob,
      deferred,
      completeDeferred,
      isSuccess,
      type = 'GET';

    if (typeof url === 'object') {
      blobURL = url.url;
      type = url.type || type;
    } else if (typeof url === 'string') {
      blobURL = url;
      type = (options && options.type) || type;
    }
    if (blobURL && blobURL.indexOf('blob:') === 0) {
      jqXHR = {
        readyState: 4,
        status: isSuccess ? 200 : 500
      };
      blob = window.BMP.URL.retrieveObject(url);
      if (type !== 'GET') {
        isSuccess = false;
      } else if (!blob || !blob.bytes) {
        isSuccess = false;
      }
      deferred = $.Deferred();
      completeDeferred = $.Callbacks("once memory");
      deferred.promise(jqXHR).complete = completeDeferred.add;
      jqXHR.success = jqXHR.done;
      jqXHR.error = jqXHR.fail;
      if (isSuccess) {
        deferred.resolve(blob.bytes, "success", jqXHR);
      } else {
        deferred.reject(jqXHR, "error", null);
      }
      return jqXHR;
    }

    return oldAjax.apply($, $.makeArray(arguments));
  };

  if (window.URL === window.BMP.URL ||
      window.URL.createObjectURL === window.BMP.URL.createObjectURL) {
    $.ajax = newAjax;
  }
}(this));
