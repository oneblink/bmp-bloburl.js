# BMP Blob.JS

This library attempts to poly-fill interesting parts of the [W3C File API](http://www.w3.org/TR/FileAPI/) in a seemless way. That is, you ought to be able to use the covered APIs in the W3C specified manner and everything should "just work".

That said, this library doesn't attempt much. We just try to cover functionality that can be covered in a cross-browser fashion. Most of the tricky stuff we leave to braver folk.

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



