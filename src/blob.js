/*jslint indent:2*/
/*jslint browser:true*/
/*jslint nomen:true, plusplus:true*/

(function (window) {
  'use strict';
  var b, isConstructableBlob = true,
    Blob,
    NestedBlob,
    convertArrayBufferToBase64,
    convertStringToArrayBuffer,
    MIME = window.BMP.MIME;

  try {
    b = new window.Blob();
    b = null;
  } catch (err) {
    isConstructableBlob = false;
  }

  // http://stackoverflow.com/questions/9267899
  convertArrayBufferToBase64 = function (buffer) {
    var binary = '',
      bytes = new window.Uint8Array(buffer),
      len = bytes.byteLength,
      i;

    for (i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  /**
   * @constructor
   * @param {Array} [data] zero or more {String}, we assume non-text MIME is
   * already Base64-encoded
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
    this.base64 = '';
    this.text = '';

    if (typeof options === 'object') {
      this.type = options.type || this.type;
    }

    if (data) {
      dLength = data.length;
      for (d = 0; d < dLength; d++) {
        datum = data[d];
        if (typeof datum === 'string') {
          this.size += datum.length;
          if (MIME.isText(this.type)) {
            this.text += datum;
          } else {
            this.base64 += datum;
          }
        }
      }
    }

    return this;
  };

  /**
   * cross-browser constructor for Blob
   * @param {Array} data Array of {ArrayBuffer|ArrayBufferView|Blob|String}.
   * @param {Object} [options] optional Object with "type" attribute
   */
  Blob.createNative = function (data, options) {
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

  /**
   * @param {String} url
   * @param {Function} onSuccess function({BMP.Blob} blob)
   * @param {Function} onError function({Error} error)
   */
  Blob.fromBlobURL = function (url, onSuccess, onError) {
    var xhr,
      blob;

    if (!window.URL || !window.URL.createObjectURL) {
      this.fromNativeBlob(window.BMP.URL.retrieveObject(url), function (blob) {
        if (onSuccess && onSuccess instanceof Function) {
          onSuccess(blob);
        }
      }, function (err) {
        if (onError && onError instanceof Function) {
          onError(err);
        }
      });

    } else { // native URL.createObjectURL, therefore use XMLHTTPRequest
      Blob.nativelyFromBlobURL(url, onSuccess, onError);
    }
  };

  /**
   * @param {Blob} blob
   * @param {Function} onSuccess function({BMP.Blob} blob)
   * @param {Function} onError function({Error} error)
   */
  Blob.fromNativeBlob = function (blob, onSuccess, onError) {
    var fr = new window.FileReader();

    fr.onload = function (event) {
      fr.onload = null;
      try {
        if (MIME.isText(blob.type)) {
          blob = new Blob([event.target.result], { type: blob.type });
        } else {
          blob = Blob.fromDataURI(event.target.result);
        }
        if (onSuccess && onSuccess instanceof Function) {
          onSuccess(blob);
        }
      } catch (err) {
        if (onError && onError instanceof Function) {
          onError(err);
        }
      }
    };
    fr.onerror = function (event) {
      fr.onerror = null;
      if (onError && onError instanceof Function) {
        onError(event.target.error);
      }
    };
    try {
      if (MIME.isText(blob.type)) {
        fr.readAsText(blob);
      } else {
        fr.readAsDataURL(blob);
      }
    } catch (err) {
      fr.onload = null;
      fr.onerror = null;
      if (onError && onError instanceof Function) {
        onError(err);
      }
    }
  };

  /**
   * @param {String} dataURI
   * @returns {BMP.Blob} not native Blob!
   */
  Blob.fromDataURI = function (dataURI) {
    var parts,
      type,
      encoding,
      data,
      blob = new Blob();

    parts = dataURI.split(','); // 0 => header, 1 => data
    data = parts[1];
    parts = parts[0].split(':'); // 0 => 'data', 1 => type;encoding
    parts = parts[1].split(';'); // 0 => type, 1 => encoding
    type = parts[0];
    encoding = parts[1];

    if (encoding === 'base64') {
      if (MIME.isText(type)) {
        blob.text = window.atob(data);
      } else {
        blob.base64 = data;
      }
    } else {
      blob.text = data;
    }
    blob.type = type;
    blob.size = data.length;
    return blob;
  };

  /**
   * @param {String} url
   * @param {Function} onSuccess function({BMP.Blob} blob)
   * @param {Function} onError function({Error} error)
   */
  Blob.nativelyFromBlobURL = function (url, onSuccess, onError) {
    var xhr,
      blob;

    xhr = new window.XMLHttpRequest();
    xhr.onreadystatechange = function () {
      var mime,
        base64,
        serializer,
        dataview;

      if (this.readyState === this.DONE) {
        this.onreadystatechange = null;
        mime = this.getResponseHeader('Content-Type');
        if (this.status === 200) {
          if (this.responseType === 'arraybuffer') {
            base64 = convertArrayBufferToBase64(this.response);
            blob = new Blob([base64], { type: mime });

          } else if (this.responseType === 'blob') {
            Blob.fromNativeBlob(this.response, function (blob) {
              if (onSuccess && onSuccess instanceof Function) {
                onSuccess(blob);
              }
            }, function (err) {
              if (onError && onError instanceof Function) {
                onError(err);
              }
            });

          } else if (this.responseType === 'document') {
            serializer = new window.XMLSerializer();
            base64 = window.btoa(serializer.serializeToString(this.response));
            blob = new Blob([base64], { type: mime });

          } else if (this.responseType === 'json') {
            base64 = window.btoa(JSON.stringify(this.response));
            blob = new Blob([base64], { type: mime });

          } else { // this.responseType === 'text'
            if (MIME.isText(mime)) {
              blob = new Blob([this.response], { type: mime });
            } else {
              blob = new Blob([base64], { type: mime });
            }
          }
          if (blob && onSuccess && onSuccess instanceof Function) {
            onSuccess(blob);
          }
          if (!blob && onError && onError instanceof Function) {
            onError(new Error('error retrieving target Blob via Blob URL'));
          }

        } else { // status === 500
          if (onError && onError instanceof Function) {
            onError(new Error(this.responseText));
          }
        }
      }
    };
    xhr.open('GET', url);
    xhr.send();
  };

  /**
   * @param {BMP.Blob} blob
   */
  Blob.isNested = function () {

  };

  /**
   * @returns {Blob} a Base64-encoded BMP.Blob within a Blob
   */
  Blob.prototype.makeNested = function () {
    var dataURI = 'data:';
    dataURI += this.type;
    if (MIME.isText(this.type)) {
      dataURI += ',';
      dataURI += this.text;
    } else {
      dataURI += ';base64,';
      dataURI += this.base64;
    }
    this.type = 'text/plain';
    this.text = dataURI;
    this.base64 = null;
  };

  Blob.prototype.undoNested = function () {
    var blob = Blob.fromDataURI(this.text);
    this.type = blob.type;
    if (MIME.isText(this.type)) {
      this.text = blob.text;
      this.base64 = null;
    } else {
      this.base64 = blob.base64;
      this.text = null;
    }
  };

  Blob.prototype.toNative = function () {
    return window.BMP.Blob.createNative([this.base64 || this.text], {
      type: this.type
    });
  };

  window.BMP = window.BMP || {};
  window.BMP.Blob = Blob;
  window.BMP.NestedBlob = NestedBlob;
}(this));
