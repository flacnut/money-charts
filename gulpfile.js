'use strict';

var fs = require('fs'),
  del = require('del'),
  gulp = require('gulp'),
  gutil = require('gulp-util'),
  path = require('path'),
  sass = require('gulp-sass'),
  concat = require('gulp-concat'),
  templateCache = require('gulp-angular-templatecache'),
  async = require('async');

var wwwSrcPath = 'www',
  wwwDropPath = 'release';

var cssPaths = [
    wwwSrcPath + '/**/*.scss'
  ],
  jsPaths = [
    wwwSrcPath + '/money.js',
    wwwSrcPath + '/factories/**/*.js',
    wwwSrcPath + '/components/**/*.js'
  ],
  tmplPaths = [
    wwwSrcPath + '/components/**/*.tmpl.html'
  ];

// Task: clean-www
// This task removes the build output. Even if multiple other tasks
// depend on this, this will still only run once, and no other tasks
// will run until it is complete.
gulp.task('clean-www', function cleanWww(done) {
    del(wwwDropPath, done);
});

// Task: copy-index
// Copies the static index.html file to the dist path. This is separate
// from copying assets, as assets are static files we never wish to change.
gulp.task('copy-index', ['clean-www'], function copyIndex() {
  return gulp
    .src(wwwSrcPath + '/index.html')
    .pipe(gulp.dest(wwwDropPath));
});

// Task: copy-assets
// Copy static files to the dist path. Assets are files that will not
// ever be modified as part of copying. These include third-party libs,
// images, fonts, icons, and css.
gulp.task('copy-assets', ['clean-www'], function copyAssets() {
  return gulp
    .src(wwwSrcPath + '/assets/**/*')
    .pipe(gulp.dest(wwwDropPath));
});

// Task: concat-js
// Concatenate all of our javascript files together. This reduces the
// load time for the page, and also negates the need for adding more
// scripts to the index.html everytime a new view is added.
gulp.task('concat-js', ['clean-www'], function concatJs() {
  return gulp
    .src(jsPaths)
    .pipe(concat('dx-app.js'))
    .pipe(gulp.dest(wwwDropPath + '/js'));
});

// Task: generate-templates
// Copy html files flagged with '.tmpl' and create a template-cache file.
// This file is included in the application, and prevents templates from
// being individually fetched. All templates are referenced only by their
// template.html file name, as the path tree is removed by the base function.
gulp.task('generate-templates', ['clean-www'], function generateTemplates() {
  var options = {
    module: 'dx-app',
    base: function stripTmpl(file) {
      return path.basename(file.path).replace('.tmpl.html', '.html');
    }
  };

  return gulp
    .src(tmplPaths)
    .pipe(templateCache('dx-app-templates.js', options))
    .pipe(gulp.dest(wwwDropPath + '/js'));
});

// Task: generate-css
// Compile our scss code into css, and place the files in the css
// directory with other third-party css libraries.
gulp.task('generate-css', ['clean-www'], function generateCss() {
  return gulp
    .src(cssPaths)
    .pipe(concat('dx-theme.css'))
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(wwwDropPath + '/css'));
});

// Task: watch
// When any file that is being watched changes, the build directory
// is cleaned and everything is rebuilt. If we only ran the rebuild
// task associated with the changed files, the output would still
// be cleaned, and we would be left with an incomplete build output.
gulp.task('watch', function watch() {
  gulp.watch(jsPaths, ['build', 'test']);
  gulp.watch(cssPaths, ['build', 'test']);
  gulp.watch(tmplPaths, ['build', 'test']);
  //gulp.watch(testPaths, ['test']);
});

// Task: test
// Executes a single run of Karma tests on the UX using PhantomJs.
gulp.task('test', function test(done) {
  karma.start({
      configFile: __dirname + '/test/www/karma.conf.js',
      singleRun: true
    }, function ignoreKarma(ignore) {
      // Prevent the karma results getting passed into done
      // as gulp miss-handles it.
      done();
    });
});

// Task: live-debug
// Sets up Karma to watch files and execute tests in a Chrome browser
// whenever the files change. Note that this is watching the /dist/ folder
// and not the raw .js files. This task is mostly designed for editing tests,
// if you modify a raw file you'll need to run 'gulp build' in another
// terminal to have karma pickup those changes.
gulp.task('live-debug', function liveDebug(done) {
  karma.start({
      configFile: __dirname + '/test/www/karma.conf.js',
      browsers: ['Chrome'],
      logLevel: 'DEBUG',
      autoWatch: true,
      singleRun: false
    }, function ignoreKarma(ignore) {
      // Prevent the karma results getting passed into done
      // as gulp miss-handles it.
      done();
    });
});

// Task: build
// This task generates all code to be run the static angular app.
// These tasks are *not* order specific, and may be run in any order.
// Order specific operations should either be done in one task, or placed
// as a dependency of one of these tasks.
gulp.task('build', ['copy-index', 'copy-assets', 'concat-js', 'generate-templates', 'generate-css']);

gulp.task('default', ['build']);
