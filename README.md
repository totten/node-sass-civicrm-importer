# node-sass-civicrm-importer

Filter SCSS files to resolve the paths to CiviCRM extensions.


## Installation

```
npm install --save-dev civicrm/node-sass-civicrm-importer
```


## Usage (SCSS)

```scss
@import "ext:org.example.foo/hello";
@import "ext:org.example.bar/world/**";
```

would generally resolve to something like:

```scss
@import "/var/www/sites/default/files/civicrm/ext/org.example.foo/_hello.scss";
@import "/var/www/sites/vendor/example/bar/world/_one.scss";
@import "/var/www/sites/vendor/example/bar/world/two/_three.scss";
```

## Usage (Gulp)

```js
var importCiviSass = require('node-sass-civicrm-importer');

gulp.task('css', function() {
  return gulp
    .src('example.scss')
    .pipe(sass({
       importer: importCiviSass()
     }))
    .pipe(gulp.dest('./public/css/'));
});
```


```js
var importCiviSass = require('node-sass-civicrm-importer');

gulp.task('css', function() {
  return gulp
    .src('example.scss')
    .pipe(sass({
       importer: importCiviSass({
         debug: true,
         prefix: 'foo:',
         paths: [{key: 'org.example.bar', 'path': '/var/www/bar'}]
       })
     }))
    .pipe(gulp.dest('./public/css/'));
});
```
