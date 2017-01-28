'use strict';

/*globals require, Buffer, console */
var cv = require('civicrm-cv')({mode: 'sync'});
var glob = require('glob');
var fs = require('fs');
var _ = require('lodash');

module.exports = function(options) {
  options = options || {};
  options.prefix = options.prefix || 'ext:';
  options.paths = options.paths || cv('ext:list -L --columns=key,path'); // lazy eval

  var pathMap = {};
  _.each(options.paths, function(ext){
    pathMap[ext.key] = ext.path;
  });

  var regex = new RegExp('^' + _.escapeRegExp(options.prefix) + "([^\/]+)/(.+)");

  /**
   * Translate a URL to the path to a Civi extension.
   *
   * @param String url
   *   Ex: "ext:org.example.foo/scss/something".
   * @param String prev
   * @return null|Object
   *
   * @link https://github.com/sass/node-sass#importer--v200---experimental
   */
  return function(url, prev, done){
    var path = require('path');
    var result = regex.exec(url);
    if (result && result[1]) {
      var extKey = result[1], suffix = result[2];
      if (pathMap[extKey]) {
//        done({file: pathMap[extKey] +'/'+suffix}); return;

        if (suffix.indexOf('*') < 0) {
          var dirname = (path.dirname(suffix) == '.') ? '/' : ('/' + path.dirname(suffix) + '/');
          var basename = path.basename(suffix) + '.scss';
          var filePath;

          if (fs.existsSync(filePath = pathMap[extKey] + dirname + '_' + basename)) {
            if (options.debug) console.log('node-sass-civicrm-importer-spec: Mapped ' + url + ' to ' + filePath);
            done({file: filePath});
            return;
          }
          if (fs.existsSync(filePath = pathMap[extKey] + dirname + basename)) {
            if (options.debug) console.log('node-sass-civicrm-importer-spec: Mapped ' + url + ' to ' + filePath);
            done({file: filePath});
            return;
          }

          done(null);
          return;
        }

        var buf = '';
        var files = _.filter(glob.sync(pathMap[extKey] + '/' + suffix), function(file) {
          return !fs.statSync(file).isDirectory() && file.match(/\.(scss|sass)$/);
        });
        _.each(files, function(file){
          file = path.dirname(file) + '/' + path.basename(file).replace(/^_(.*)\.scss/, '$1');
          buf = buf + '@import "' + file + '";\n';
//          buf = buf + '\n' + fs.readFileSync(file).toString('utf-8');
        });
        if (options.debug) console.log('node-sass-civicrm-importer-spec: Mapped glob ' + url + ' to ', buf);

        done({content: buf});
        return;
      }
    }

    if (options.debug) console.log('node-sass-civicrm-importer-spec: Ignore ' + url);
    done(null);
  };
};
