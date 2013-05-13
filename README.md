# BMP Blobs.JS

This library makes available `window.BMP.blobs` and `window.BMP.Blob`.

`window.BMP.blobs` is a singleton that makes it easy to put aside a potentially
large blob and retrieve it later. It transparently makes use of native support
for URL.createObjectURL and Blob URLs (if available).

`window.BMP.Blob` is a constructor for a fallback implementation of the W3C Blob
standard, with some additional convenient methods used to support BMP.blobs.

## Assumptions / Scope

FileReader support in the browser is assumed and BMP.Blobs requires it to
function.

We also make the assumption that any browser sufficiently advanced enough to
support FileReader is likely to also support the official specification for
[XMLHTTPRequest](http://www.w3.org/TR/XMLHttpRequest/).

## Instructions

## Prerequisities

- Node.JS
- NPM

### Build

We use Grunt to build this distribution. As per upstream recommendation,
you should have grunt-cli installed globally, and grunt installed
locally (to the project).

    npm -g uninstall grunt
    npm -g install grunt-cli

After cloning the repository, change your terminal's working directory
to the repository's top-level folder and install the required Node.JS
modules:

    npm update

You may want to do that regularly to keep the modules up to date.

Lastly, to trigger the build progress, simply run:

    grunt

This will output:

- TODO: ...

## Compatibility

Below is a table of built-in (un-polyfilled) support for W3C standards.

browser              | URL | Blob | FileReader
-------------------- | --- | ---- | ---
Chrome               | yes | yes  | yes
Firefox              | yes | yes  | yes
Safari 6             | no  | yes  | yes
Safari 5             | no  | yes* | yes
Internet Explorer 10 | no  | yes  | yes
Internet Explorer 9  | no  | no   | no

Note: Safari 5 supports an early version of Blob that cannot be directly
constructed.

## Test Scenarios

Each test in must be manually loaded into Chrome or Firefox.
The tests are authored such that they simulate non-conformance even in a
fully-conforming browser.

1. URL, Blob and FileReader all fully conformant with W3C specifications
2. as above but with URL either undefined or lacking create|revokeObjectURL

The different `index.html` test files neuter the environment to test different
levels of conformance. The shared `test.js` file is deliberately the same, so
that the same tests are run across multiple browsers.

It is also recommended that the tests be executed in the browsers listed above,
for sanity.


