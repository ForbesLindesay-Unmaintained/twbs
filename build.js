'use strict';

var assert = require('assert');
var fs = require('fs');

var step = require('testit');
var gethub = require('gethub');
var mkdirp = require('mkdirp').sync;
var rimraf = require('rimraf').sync;

step('cleanup', function () {
  rimraf(__dirname + '/bootstrap');
  rimraf(__dirname + '/less');
  rimraf(__dirname + '/lib');
  rimraf(__dirname + '/fonts');
  rimraf(__dirname + '/BOOTSTRAP-LICENSE');
  rimraf(__dirname + '/index.js');
  rimraf(__dirname + '/jquery.js');
});

step('download', function () {
  return gethub('twbs', 'bootstrap',
                'v' + require('./package.json')['bootstrap-version'],
                __dirname + '/bootstrap');
}, '60 seconds');

step('copy less files', function () {
  mkdirp(__dirname + '/less');
  var files = fs.readdirSync(__dirname + '/bootstrap/less');
  for (var i = 0; i < files.length; i++) {
    if (files[i] === 'glyphicons.less') {
      var src = fs.readFileSync(__dirname + '/bootstrap/less/' + files[i], 'utf8');
      // remove ~quotes from ~"url('@{icon-font-path}@{icon-font-name}.eot')"
      src = src.replace(/~"([^\"]+)"/g, '$1');
      fs.writeFileSync(__dirname + '/less/' + files[i], src);
    } else if (/\.less$/.test(files[i])) {
      var src = fs.readFileSync(__dirname + '/bootstrap/less/' + files[i], 'utf8');
      fs.writeFileSync(__dirname + '/less/' + files[i], src);
    }
  }
});

step('copy js files', function () {
  mkdirp(__dirname + '/lib');
  var prefix = 'var jQuery = require("../jquery");\nvar $ = jQuery;\nmodule.exports = jQuery;\n';
  var files = fs.readdirSync(__dirname + '/bootstrap/js');
  for (var i = 0; i < files.length; i++) {
    if (/\.js$/.test(files[i])) {
      var src = fs.readFileSync(__dirname + '/bootstrap/js/' + files[i], 'utf8');
      var match;
      var pattern = /\$\.fn\.([a-zA-Z]+)/g;
      var dependencies = [];
      while (match = pattern.exec(src)) {
        if (dependencies.indexOf(match[1]) === -1 && match[1] !== files[i].replace(/\.js$/, ''))
          dependencies.push(match[1]);
      }
      var deps = '';
      dependencies.forEach(function (dep) {
        if (fs.existsSync(__dirname + '/bootstrap/js/' + dep + '.js'))
          deps += 'require("./' + dep + '.js");\n';
      });
      src = prefix + deps + src;
      fs.writeFileSync(__dirname + '/lib/' + files[i], src);
    }
  }
});

step('copy js fonts', function () {
  mkdirp(__dirname + '/fonts');
  var files = fs.readdirSync(__dirname + '/bootstrap/fonts');
  for (var i = 0; i < files.length; i++) {
    var src = fs.readFileSync(__dirname + '/bootstrap/fonts/' + files[i]);
    fs.writeFileSync(__dirname + '/fonts/' + files[i], src);
  }
});

step('create index.js', function () {
  var buf = [];
  buf.push('"use strict";');
  buf.push('');
  buf.push('var jQuery = require("./jquery");');
  buf.push('');
  buf.push('module.exports = jQuery');
  buf.push('');
  var files = fs.readdirSync(__dirname + '/bootstrap/js');
  for (var i = 0; i < files.length; i++) {
    if (/\.js$/.test(files[i])) {
      buf.push('require("./lib/' + files[i] + '");');
    }
  }
  buf.push('');
  fs.writeFileSync(__dirname + '/index.js', buf.join('\n'));
});

step('create jquery.js', function () {
  var buf = [];
  buf.push('"use strict";');
  buf.push('');
  buf.push('var jQuery = require("jquery");');
  buf.push('');
  buf.push('module.exports = jQuery.fn ? jQuery : jQuery(window);');
  buf.push('');
  fs.writeFileSync(__dirname + '/jquery.js', buf.join('\n'));
});

step('copy LICENSE', function () {
  var src = fs.readFileSync(__dirname + '/bootstrap/LICENSE', 'utf8');
  fs.writeFileSync(__dirname + '/BOOTSTRAP-LICENSE', src);
});

step('cleanup', function () {
  rimraf(__dirname + '/bootstrap');
});
