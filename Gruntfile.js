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
        src: ['bmp-blobs.*']
      }
    },

    jslint: {
      files: [
        'src/*.js'
      ],
      directives: {
        todo: true // TODO: eventually get rid of this
      },
      options: {
        failOnError: true
      }
    },

    concat: {
      dist: {
        src: [
          'src/url.js',
          'src/mime.js',
          'src/blob.js',
          'src/fileinput.js'
          /*'src/blobs.js'*/
        ],
        dest: 'bmp-blobs.js'
      }
    },

    uglify: {
      'default': {
        files: {
          'bmp-blobs.min.js': ['bmp-blobs.js']
        }
      },
      options: {
        sourceMap: 'bmp-blobs.js.map',
        preserveComments: 'some',
        beautify: {
          max_line_len: 80
        },
        compress: {}
      }
    },

    mocha: {
      all: {
        src: [
          'test/**/*.html',
          '!test/1/index.html' // this test needs stuff that isn't in PhantomJS
        ],
        mocha: {}
      }
    },

    watch: {
      gruntfile: {
        files: '<%= jslint.files %>',
        tasks: ['test'],
        options: {
          interrupt: true
        }
      }
    }
  });

  grunt.registerTask('default', [
    'test',
    'build'
  ]);

  grunt.registerTask('build', [
    'clean',
    'concat',
    'uglify'
  ]);

  grunt.registerTask('test', [
    'jslint',
    'mocha'
  ]);

};

