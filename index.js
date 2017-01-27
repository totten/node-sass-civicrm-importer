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

  var regex = new RegExp('^' + _.escapeRegExp(options.prefix) + "([^\/]+)(/.+)");

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
    var result = regex.exec(url);
    if (result && result[1]) {
      var extKey = result[1], suffix = result[2];
      if (pathMap[extKey]) {

        if (suffix.indexOf('*') < 0) {
          var path = pathMap[extKey] + suffix;
          if (options.debug) console.log('node-sass-civicrm-importer-spec: Mapped ' + url + ' to ' + path);
          done({file: path});
          return;
        }

        var buf = '';
        var files = _.filter(glob.sync(pathMap[extKey] + suffix), function(file ){
          return !fs.statSync(file).isDirectory() && file.match(/\.(scss|sass)$/);
        });
        if (options.debug) console.log('node-sass-civicrm-importer-spec: Mapped glob ' + url + ' to ', files);
        _.each(files, function(file){
          buf = buf + fs.readFileSync(file).toString('utf-8');
        });

        done({content: buf});
        return;
      }
    }

    done(null);
  };
};
