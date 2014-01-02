[![Build Status](https://travis-ci.org/openhoat/grunt-contrib-node-webkit.png?branch=master)](https://travis-ci.org/openhoat/grunt-contrib-node-webkit)

## What's grunt-contrib-node-webkit ?

A grunt task to build [node-webkit](https://github.com/rogerwang/node-webkit) apps.
It builds the app package for specified platforms (win, mac, linux32, linux64).

## Getting started

This plugin requires [Grunt](http://gruntjs.com/) ~0.4.2

Check out the [Getting Started](http://gruntjs.com/getting-started) guide to learn how to create a Gruntfile

Install with :

    $ npm install grunt-grunticon --save-dev

## Usage

Gruntfile.js example :

```javascript
module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    nw: {
      binaries: { // Node-webkit binaries for each platform (win, mac, linux32, linux64)
        linux64: '/opt/node-webkit/node-webkit-v0.8.3-linux-x64/nw',
        win: '/opt/node-webkit/node-webkit-v0.8.3-win-ia32/nw.exe'
      },
      options: {
        dist: 'dist'
      },
      targets: ['linux64', 'win'], // Platform targets to build
      src: [ // Files to include in app package
        'package.json',
        'index.html',
        'index.js',
        'node_modules/anymodulename/**/*',
        // ...
      ]
    }
  });
  grunt.loadNpmTasks('grunt-contrib-node-webkit');
};
```

Build the app packages :

    $ grunt nw

The resulting zip files located in dist dir should contain app binaries.

Enjoy !
