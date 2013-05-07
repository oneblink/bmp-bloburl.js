/*global suite:true, test:true, setup:true, teardown:true*/ // mocha
/*global suiteSetup:true, suiteTeardown:true*/ // mocha
/*global assert:true*/ // chai
/*global define:true, require:true*/ // require.js
/*jslint indent:2*/
/*jslint browser:true*/

define(function () {
  'use strict';
  
  window.require.config({
    baseUrl: '../../src'
  });

  suite('BMP Blob.JS: Blob', function () {
    var Blob = window.Blob;

    /**
     * execute once before everything else in this suite
     */
    suiteSetup(function (done) {
      require(['blob'], function (blob) {
        Blob = blob;
        done();
      });
    });

    test('new Blob()', function () {
      var blob = new Blob();
      assert(blob.size === 0, 'blank Blob has 0 size');
      assert(blob.type === '', 'blank Blob has empty type');
    });

    test('new Blob() with String "abc" and type "text/plain"', function () {
      var blob = new Blob('abc', {type: 'text/plain'  });
      assert(blob.size === 3, 'Blob has size of 3');
      assert(blob.type === 'text/plain', 'Blob has "text/plain" type');
      assert(blob.bytes === 'abc', 'Blob bytes are "abc"');
    });

    /**
     * execute once after everything else in this suite
     */
    suiteTeardown(function () {
    });

  }); // END: suite('Require.JS', ...)

});
