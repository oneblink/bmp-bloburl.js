/*global define:true, require:true*/ // require.js
/*jslint indent:2*/

(function (window) {
  'use strict';
  var $ = window.$,
    FileReader = window.FileReader,
    oldAjax,
    newAjax,
    fillResponseWithBlob,
    Response,
    splitDataURI;

  if (!$) {
    return; // no jQuery to be adapted
  }

  /**
   * @constructor
   */
  Response = function () {
    this.readyState = 4;
    this.status = 0;
    this.headers = {};
    this.responseText = '';
    return this;
  };

  Response.prototype.getResponseHeader = function (header) {
    return this.headers[header];
  };

  Response.prototype.getAllResponseHeaders = function () {
    var headers = {};
    $.each(this.headers, function (header, value) {
      headers[header] = value;
    });
    return headers;
  };

  Response.prototype.statusCode = function () {
    return this.status;
  };

  splitDataURI = function (uri) {
    var parts,
      type,
      encoding,
      data;

    parts = uri.split(','); // 0 => header, 1 => data
    data = parts[1];
    parts = parts[0].split(':'); // 0 => 'data', 1 => type;encoding
    parts = parts[1].split(';'); // 0 => type, 1 => encoding
    type = parts[0];
    encoding = parts[1];
    return {
      encoding: encoding,
      data: data,
      size: data.length
    };
  };

  /**
   */
  fillResponseWithBlob = function (res, blob) {
    var dfrd = new $.Deferred(),
      fr = new FileReader(),
      parts;

    fr.onload = function (event) {
      fr.onload = null;
      try {
        if (blob.type.indexOf('text/') === 0) {
          res.responseText = event.target.result;
        } else {
          parts = splitDataURI(event.target.result);
          res.responseText = parts.data;
          res.headers['Content-Encoding'] = parts.encoding; // non-standard, eek!
        }
        res.headers['Content-Type'] = blob.type;
        res.headers['Content-Length'] = blob.size;
        res.status = 200;
        dfrd.resolve(res);
      } catch (err) {
        res.status = 500;
        dfrd.reject(err, res);
      }
    };
    fr.onerror = function (event) {
      fr.onerror = null;
      res.status = 500;
      dfrd.reject(event.target.error, res);
    };
    try {
      if (blob.type.indexOf('text/') === 0) {
        fr.readAsText(blob);
      } else {
        fr.readAsDataURL(blob);
      }
    } catch (err) {
      fr.onload = null;
      fr.onerror = null;
      res.status = 500;
      dfrd.reject(err, res);
    }
    return dfrd.promise();
  };

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
      jqXHR = new Response();

      deferred = $.Deferred();
      completeDeferred = $.Callbacks("once memory");
      deferred.promise(jqXHR).complete = completeDeferred.add;
      jqXHR.success = jqXHR.done;
      jqXHR.error = jqXHR.fail;

      blob = window.BMP.URL.retrieveObject(url);
      fillResponseWithBlob(jqXHR, blob)
        .then(function (jqXHR) {
          deferred.resolve(jqXHR.responseText, "success", jqXHR);
        })
        .fail(function (err, jqXHR) {
          deferred.reject(jqXHR, "error", null);
        });

      return jqXHR;
    }

    return oldAjax.apply($, $.makeArray(arguments));
  };

  // only duck-punch if Blob URL support is not natively implemented
  if (window.URL === window.BMP.URL ||
      window.URL.createObjectURL === window.BMP.URL.createObjectURL) {
    $.ajax = newAjax;
  }
}(this));
