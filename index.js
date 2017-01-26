'use strict';

/*globals require, Buffer */
var through = require('through2');
var cv = require('civicrm-cv')({mode: 'sync'});
var _ = require('lodash');

module.exports = function(options) {
  options = options || {};
  options.prefix = options.prefix || 'civicrm:';
  options.paths = options.paths || cv('ext:list -Li --columns=key,path'); // lazy eval

  var pathMap = {};
  _.each(options.paths, function(ext){
    pathMap[ext.key] = ext.path;
  });

  var transform = function(file, env, cb) {
    var fileContent = file.contents.toString('utf-8');

    // ex: @import 'civicrm:com.example.foo/file';
    // ex: @import   "civicrm:com.example.foo/folder/file";
    var regex = new RegExp("(@import\\s+[\"'])" + _.escapeRegExp(options.prefix) + "([^\/]+)([^\"'\r\n]+[\"'];?)", "g");
    fileContent = fileContent.replace(regex, function(match, prefix, extKey, suffix, offset, s) {
      if (pathMap[extKey]) {
        return prefix + pathMap[extKey] + suffix;
      } else {
        return match;
      }
    });

    file.contents = new Buffer(fileContent);
    cb(null, file);
  };

  return through.obj(transform);
};
