module.exports = function (grunt) {
  var path = require('path')
    , fs = require('fs')
    , pkg;
  pkg = grunt.file.readJSON('package.json');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.registerTask('mkdir', 'Create dir', function (goal) {
    var recursiveMkdir, configName, dirs;
    recursiveMkdir = function (dir) {
      var parent;
      try {
        parent = path.dirname(dir);
        if (!fs.existsSync(parent)) {
          recursiveMkdir(parent);
        }
        fs.mkdirSync(dir);
      } catch (err) {
        if (err.code !== 'EEXIST') {
          grunt.log.error(err);
        }
      }
    };
    configName = this.name + (goal ? '.' + goal : '');
    dirs = grunt.config(configName + '.dir');
    if (!(dirs instanceof Array)) {
      dirs = [dirs];
    }
    dirs.forEach(function (dir) {
      recursiveMkdir(dir);
    });
  });
  grunt.registerTask('binconcat', 'Concat binary files', function (goal) {
    var configName, srcFiles, destFile, data;
    configName = this.name + (goal ? '.' + goal : '');
    srcFiles = grunt.config(configName + '.src');
    destFile = grunt.config(configName + '.dest');
    try {
      fs.unlinkSync(destFile);
    } catch (err) {
      if (err.code !== 'ENOENT') {
        grunt.log.error(err);
      }
    }
    srcFiles.forEach(function (srcFile) {
      data = fs.readFileSync(srcFile);
      fs.appendFileSync(destFile, data);
    });
  });
  grunt.registerTask('chmod', 'Chmod a file', function (goal) {
    var configName, file, mode;
    configName = this.name + (goal ? '.' + goal : '');
    file = grunt.config(configName + '.file');
    mode = grunt.config(configName + '.mode');
    fs.chmodSync(file, mode);
  });
  grunt.registerTask('nw', 'Node webkit grunt tasks', function (action) {
    var actions = {}
      , distDir, targets, src, workDir, releasePackage;
    action = action || 'build';
    distDir = grunt.config('nw.options.dist') || 'dist/nw';
    grunt.config.requires('nw.targets');
    targets = grunt.config('nw.targets');
    grunt.config.requires('nw.src');
    src = grunt.config('nw.src');
    workDir = path.join(distDir, 'work');
    releasePackage = path.join(workDir, pkg.name + '.nw');
    actions.clean = function () {
      var config = [distDir];
      grunt.config('clean.nw', config);
      grunt.task.run('clean:nw');
    };
    actions.mkdir = function () {
      var dirs, config;
      dirs = [
        workDir
      ];
      targets.forEach(function (target) {
        var config = {
          dir: [grunt.config('nw.binaries.' + target), releasePackage],
          dest: path.join(workDir, target, pkg.name + (target === 'win' ? '.exe' : ''))
        };
        dirs.push(path.join(workDir, target));
      });
      config = { dir: dirs };
      grunt.config('mkdir.nw', config);
      grunt.task.run('mkdir:nw');
    };
    actions.compressApp = function () {
      var config = {
        options: {
          archive: releasePackage,
          mode: 'zip',
          pretty: true
        },
        files: [
          {
            expand: true,
            src: src
          }
        ]
      };
      grunt.config('compress.nw-app', config);
      grunt.task.run('compress:nw-app');
    };
    actions.binconcat = function () {
      targets.forEach(function (target) {
        var config = {
          src: [grunt.config('nw.binaries.' + target), releasePackage],
          dest: path.join(workDir, target, pkg.name + (target === 'win' ? '.exe' : ''))
        };
        grunt.config('binconcat.nw-' + target, config);
      });
      targets.forEach(function (target) {
        grunt.task.run('binconcat:nw-' + target);
      });
    };
    actions.chmod = function () {
      targets.forEach(function (target) {
        var config = {
          file: path.join(workDir, target, pkg.name + (target === 'win' ? '.exe' : '')),
          mode: '775'
        };
        grunt.config('chmod.nw-' + target, config);
      });
      targets.forEach(function (target) {
        grunt.task.run('chmod:nw-' + target);
      });
    };
    actions.copy = function () {
      targets.forEach(function (target) {
        var config = {
          files: [
            {
              expand: true,
              flatten: true,
              src: target === 'win' ? [
                path.join(path.dirname(grunt.config('nw.binaries.' + target)), 'nw.pak'),
                path.join(path.dirname(grunt.config('nw.binaries.' + target)), 'icudt.dll')
              ] : path.join(path.dirname(grunt.config('nw.binaries.' + target)), 'nw.pak'),
              dest: path.join(workDir, target) + '/'
            }
          ]
        };
        grunt.config('copy.nw-' + target, config);
      });
      targets.forEach(function (target) {
        grunt.task.run('copy:nw-' + target);
      });
    };
    actions.compressPackage = function () {
      targets.forEach(function (target) {
        var config = {
          options: {
            archive: path.join(distDir, pkg.name + '-' + target + '.zip'),
            mode: 'zip',
            pretty: true
          },
          files: [
            {
              expand: true,
              flatten: true,
              src: [
                path.join(workDir, target, '**')
              ]
            }
          ]
        };
        grunt.config('compress.nw-' + target, config);
      });
      targets.forEach(function (target) {
        grunt.task.run('compress:nw-' + target);
      });
    };
    actions.build = function () {
      actions.mkdir();
      actions.compressApp();
      actions.binconcat();
      actions.chmod();
      actions.copy();
      actions.compressPackage();
    };
    actions[action]();
  });
};