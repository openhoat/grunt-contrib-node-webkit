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
    clean: {
      default: ['dist']
    },
    nw: {
      binaries: {
        linux32: '/opt/node-webkit/node-webkit-v0.8.3-linux-ia32/nw',
        linux64: '/opt/node-webkit/node-webkit-v0.8.3-linux-x64/nw',
        mac: '/opt/node-webkit/node-webkit-v0.8.3-osx-ia32/nw',
        win: '/opt/node-webkit/node-webkit-v0.8.3-win-ia32/nw.exe'
      },
      options: {
        dist: 'dist'
      },
      targets: ['linux64', 'win'],
      src: [
        'package.json',
        'config.js',
        'index.html',
        'index.js',
        'assets/**/*',
        'lib/folds-recovery.js',
        'node_modules/profess/**/*',
        'node_modules/trycatch/**/*',
        'node_modules/xml2js/**/*'
      ]
    }
  });
  grunt.loadNpmTasks('grunt-contrib-node-webkit');
};
```

Build the app packages :

    $ grunt nw

Enjoy !
