# gulp-sass-civicrm-import

Filter SCSS files to resolve the paths to CiviCRM extensions.


## Installation

```
npm install --save-dev civicrm/gulp-sass-civicrm-import
```


## Usage (SCSS)

```scss
@import "civicrm:org.example.foo/hello";
```

would generally resolve to something like:

```scss
@import "/var/www/sites/default/files/civicrm/ext/org.example.foo/_hello.scss";
```

## Usage (Gulp)

```js
var importCiviSass = require('gulp-sass-civicrm-import');

gulp.task('css', function() {
  return gulp
    .src('example.scss')
    .pipe(importCiviSass())
    .pipe(sass({}))
    .pipe(gulp.dest('./public/css/'));
});
```
