'use strict';

var fs = require('fs'),
  del = require('del'),
  gulp = require('gulp'),
  gutil = require('gulp-util'),
  path = require('path'),
  sass = require('gulp-sass'),
  jsdoc = require('gulp-jsdoc'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
  ngAnnotate = require('gulp-ng-annotate'),
  gulpJsdoc2md = require("gulp-jsdoc-to-markdown"),
  templateCache = require('gulp-angular-templatecache'),
  async = require('async');

var wwwSrcPath = 'www',
  wwwDropPath = 'release',
  docPath = 'docs';

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

var options = {
  uglify: {
    mangle: false,
    compress: false // this doesn't seem to be working :/
  }
};

// Task: clean
// This task removes the build output. Even if multiple other tasks
// depend on this, this will still only run once, and no other tasks
// will run until it is complete.
gulp.task('clean', function cleanWww(done) {
  async.parallel([deleteRelease, deleteDocs], done);

    /**
     * Description
     * @method deleteRelease
     * @param {} cb
     * @return
     */
    function deleteRelease(cb) {
      del(wwwDropPath, cb);
    }

    /**
     * Description
     * @method deleteDocs
     * @param {} cb
     * @return
     */
    function deleteDocs(cb) {
      del(docPath, cb);
    }
});

// Task: set-release-flags
// Set configuration options that will be used to change
// the build process specifically for releases.
gulp.task('set-release-flags', function setReleaseFlags() {
  options.uglify.mangle = true;
  options.uglify.compress = true;
});

// Task: copy-index
// Copies the static index.html file to the dist path. This is separate
// from copying assets, as assets are static files we never wish to change.
gulp.task('copy-index', ['clean'], function copyIndex() {
  return gulp
    .src(wwwSrcPath + '/index.html')
    .pipe(gulp.dest(wwwDropPath));
});

// Task: copy-assets
// Copy static files to the dist path. Assets are files that will not
// ever be modified as part of copying. These include third-party libs,
// images, fonts, icons, and css.
gulp.task('copy-assets', ['clean'], function copyAssets() {
  return gulp
    .src(wwwSrcPath + '/assets/**/*')
    .pipe(gulp.dest(wwwDropPath));
});

// Task: concat-js
// Concatenate all of our javascript files together. This reduces the
// load time for the page, and also negates the need for adding more
// scripts to the index.html everytime a new view is added.
gulp.task('concat-js', ['clean'], function concatJs() {
  return gulp
    .src(jsPaths)
    .pipe(concat('money.js'))
    .pipe(ngAnnotate())
    //.pipe(uglify(options.uglify))
    .pipe(gulp.dest(wwwDropPath + '/js'));
});

// Task: generate-templates
// Copy html files flagged with '.tmpl' and create a template-cache file.
// This file is included in the application, and prevents templates from
// being individually fetched. All templates are referenced only by their
// template.html file name, as the path tree is removed by the base function.
gulp.task('generate-templates', ['clean'], function generateTemplates() {
  var options = {
    module: 'money',
    /**
     * Description
     * @method base
     * @param {} file
     * @return CallExpression
     */
    base: function stripTmpl(file) {
      return path.basename(file.path).replace('.tmpl.html', '.html');
    }
  };

  return gulp
    .src(tmplPaths)
    .pipe(templateCache('money-templates.js', options))
    .pipe(gulp.dest(wwwDropPath + '/js'));
});

// Task: generate-css
// Compile our scss code into css, and place the files in the css
// directory with other third-party css libraries.
gulp.task('generate-css', ['clean'], function generateCss() {
  return gulp
    .src(cssPaths)
    .pipe(concat('theme.css'))
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(wwwDropPath + '/css'));
});

// Task: generate-docs
// Use JSDoc to create documentation for the javascript files. Doc
// stubs can be generated using smartcomments command line util.
gulp.task('generate-docs', ['clean'], function generateDocs() {
  return gulp.src(jsPaths)
        .pipe(gulpJsdoc2md())
        .on("error", function onJsdocErr(err){
            gutil.log(gutil.colors.red("jsdoc2md failed"), err.message)
        })
        .pipe(rename(function onRename(path){
            path.extname = ".md";
        }))
        .pipe(gulp.dest(docPath));
});

// Task: watch
// When any file that is being watched changes, the build directory
// is cleaned and everything is rebuilt. If we only ran the rebuild
// task associated with the changed files, the output would still
// be cleaned, and we would be left with an incomplete build output.
gulp.task('watch', function watch() {
  gulp.watch(jsPaths, ['build']);
  gulp.watch(cssPaths, ['build']);
  gulp.watch(tmplPaths, ['build']);
  gulp.watch(wwwSrcPath + '/index.html', ['build']);
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
gulp.task('build', ['copy-index', 'copy-assets', 'concat-js', 'generate-templates', 'generate-css', 'generate-docs']);

gulp.task('build-release', ['set-release-flags','build']);

gulp.task('default', ['build']);
