var fs = require('fs');
var _ = require('lodash');

describe('node-sass-civicrm-importer', function(done) {

  var paths = [
      {key: 'org.example.foo', path: __dirname + '/example'},
      {key: 'org.example.foobar', path: '/var/www/files/foobar'},
      {key: 'org.example.f', path: '/tmp/f'}
  ];

  var cases = {
    'ext:org.example.foo/**': {content: 'div.one {}\ndiv.three {}\n'},
    'ext:org.example.foo/one': {file: __dirname + '/example/_one.scss'},
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
