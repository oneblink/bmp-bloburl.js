# BMP Blob.JS

This library attempts to poly-fill interesting parts of the [W3C File API](http://www.w3.org/TR/FileAPI/) in a seemless way. That is, you ought to be able to use the covered APIs in the W3C specified manner and everything should "just work".

That said, this library doesn't attempt much. We just try to cover functionality that can be covered in a cross-browser fashion. Most of the tricky stuff we leave to braver folk.

FileReader support in the browser is assumed. That is, the library is not written to poly-fill FileReader and requires it to function.

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

Lastly, to trigger the test and build progress, simply run:

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

Note: Safari 5 supports an early version of Blob that cannot be directly constructed.

## Test Scenarios

When `grunt` executes these scenarios, it uses PhantomJS (a headless WebKit). As it stands, PhantomJS does not have full support for the W3C standards at issue.

As such, it is recommended that you manually run each test in Chrome or Firefox. The tests are authored such that they simulate non-conformance even in a fully-conforming browser.

1. URL, Blob and FileReader all fully conformant with W3C specifications
2. as above but with URL either undefined or lacking create|revokeObjectURL
3. as above but with Blob unable to be directly constructed

The different `index.html` test files neuter the environment to test different levels of conformance. The shared `test.js` file is deliberately the same, so that the same tests are run across multiple browsers.

It is also recommended that the tests be executed in the browsers listed above, for sanity.


