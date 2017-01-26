var fs = require('fs');

describe("gulp-sass-civicrm-import", function(done) {
  it('process "examples/a-input.scss" correctly', function(done){
    var vinyl = require('vinyl-fs');
    var importCiviSass = require('../index.js');

    var paths = [
      {key: 'org.example.foo', path: '/var/www/vendor/foo'},
      {key: 'org.example.foobar', path: '/var/www/files/foobar'},
      {key: 'org.example.f', path: '/tmp/f'}
    ];

    var expectString = fs.readFileSync(__dirname + '/examples/a-output.scss').toString('utf-8');
    vinyl
      .src(__dirname + '/examples/a-input.scss')
      .pipe(importCiviSass({paths: paths}))
      .on('data', function(file) {
    var buf = '';
        buf = buf + file.contents.toString('utf-8');
        expect(buf).toBe(expectString);
      })
      .on('end', function() {
        done();
      });
  });
});