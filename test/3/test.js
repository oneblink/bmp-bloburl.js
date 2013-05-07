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

  suite('BMP Blob.JS: URL', function () {
    var URL = window.URL;

    /**
     * execute once before everything else in this suite
     */
    suiteSetup(function (done) {
      require(['url'], function (url) {
        URL = url;
        done();
      });
    });

    test('URL.createObjectURL', function (done) {
      assert(URL.createObjectURL, 'method itself is truthy / defined');
      done();
    });

    test('URL.revokeObjectURL', function (done) {
      assert(URL.revokeObjectURL, 'method itself is truthy / defined');
      done();
    });

    /**
     * execute once after everything else in this suite
     */
    suiteTeardown(function () {
    });

  }); // END: suite('Require.JS', ...)

});
