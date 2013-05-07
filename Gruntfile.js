/*global module:true*/ // node.js
/*jslint indent:2*/

/**
 * module.exports ... is required for things to work
 * @param {Object} grunt instance of Grunt.
 */
module.exports = function (grunt) {
  'use strict';

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-jslint');
  grunt.loadNpmTasks('grunt-mocha');

  grunt.initConfig({
    clean: {
      options: {
        src: ['bmp-blob-jquery.*']
      }
    },

    jslint: {
      files: [
        'src/*.js'
      ],
      directives: {
        browser: true,
        es5: true,
        nomen: true,
        sloppy: true, // allow skipping ES5 'use strict'
        todo: true,
        indent: 2,
        predef: [
          // pre-defined globals
          'module',
          'define',
          'require'
        ]
      },
      options: {
        failOnError: true
      }
    },

    concat: {
      dist: {
        src: [
          'src/blob.js',
          'src/file.js',
          'src/url.js',
          'src/filereader.js',
          'src/adapter-jquery.js'
        ],
        dest: 'bmp-blob-jquery.js'
      }
    },

    uglify: {
      'default': {
        files: {
          'bmp-blob-jquery.min.js': ['bmp-blob-jquery.js']
        }
      },
      options: {
        sourceMap: 'bmp-blob-jquery.js.map',
        preserveComments: 'some',
        beautify: {
          max_line_len: 80
        },
        compress: {}
      }
    },

    mocha: {
      all: {
        src: ['test/*/index.html'],
        options: {
          run: false
        }
      }
    }

  });

  grunt.registerTask('default', [
    'jslint',
    'clean',
    'concat',
    'uglify',
    'mocha'
  ]);

  grunt.registerTask('build', [
    'clean',
    'concat',
    'uglify'
  ]);
};

