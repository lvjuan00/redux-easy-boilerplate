var gulp = require('gulp'),
    path = require('path'),
    rename = require('gulp-rename'),
    template = require('gulp-template'),
    fs = require('fs'),
    yargs = require('yargs').argv;

var root = './';

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

var createComponent = function(simpleComponent) {
  var component;

  if (simpleComponent) {
    component = path.join(__dirname, 'generator', 'simple-component/**/*.**');
  } else {
    component = path.join(__dirname, 'generator', 'component/**/*.**');
  }

  var cap = function(val) {
    return val.charAt(0).toUpperCase() + val.slice(1);
  };

  var name = yargs.name,
      parentPath = yargs.parent || '',
      destPath = path.join(path.join(root, 'src/components/'), parentPath, capitalizeFirstLetter(name));

  return gulp.src(component)
    .pipe(template({
      name: capitalizeFirstLetter(name),
      upCaseName: cap(name)
    }))
    .pipe(rename(function(path) {
      path.basename = path.basename.replace('temp', name);
    }))
    .pipe(gulp.dest(destPath));
};

var createTemplate = function(folder, file) {
  var name = yargs.name,
      parentPath = yargs.parent || '',
      destPath = path.join(path.join(root, folder));

  return gulp.src(path.join(__dirname, 'generator', file))
    .pipe(template({
      name: name,
    }))
    .pipe(rename(function(path) {
      path.basename = path.basename.replace('temp', name);
    }))
    .pipe(gulp.dest(destPath));
};

gulp.task('simple-component', function() {
  createComponent(true);
});

gulp.task('component', function() {
  createComponent(false);
  createTemplate('src/actions/', 'action/*.js');
  createTemplate('src/reducers/', 'reducer/*.js');
});
