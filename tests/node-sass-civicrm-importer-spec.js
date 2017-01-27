var fs = require('fs');
var _ = require('lodash');

describe('node-sass-civicrm-importer', function(done) {

  var paths = [
      {key: 'org.example.foo', path: '/var/www/vendor/foo'},
      {key: 'org.example.foobar', path: '/var/www/files/foobar'},
      {key: 'org.example.f', path: '/tmp/f'}
  ];

  var cases = {
    'civicrm:org.example.foo/one': {file: '/var/www/vendor/foo/one'},
    'civicrm:org.example.foobar/two/three': {file: '/var/www/files/foobar/two/three'},
    'foo/bar': null
  };

  var importCiviSass = require('../index.js')({paths: paths});

  _.each(cases, function(expectValue, inputValue){
    it('handles input: ' + inputValue, function(done){
      importCiviSass(inputValue, '', function(result){
        expect(result).toEqual(expectValue);
        done();
      });
    });
  });

});
