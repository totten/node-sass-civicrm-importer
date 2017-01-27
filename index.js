'use strict';

/*globals require, Buffer */
var cv = require('civicrm-cv')({mode: 'sync'});
var _ = require('lodash');

module.exports = function(options) {
  options = options || {};
  options.prefix = options.prefix || 'civicrm:';
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
   *   Ex: "civicrm:org.example.foo/scss/something".
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
        done({file: pathMap[extKey] + suffix});
        return;
      }
    }

    done(null);
  };
};
