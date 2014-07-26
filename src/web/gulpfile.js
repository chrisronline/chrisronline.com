var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var del = require('del');
var connect = require('gulp-connect');
var compass = require('gulp-compass');
var through = require('through2');
var react = require('gulp-react');
var plumber = require('gulp-plumber');
var minifycss = require('gulp-minify-css');
var replace = require('gulp-replace');
var debug = require('gulp-debug');

// Development
var dev = {
  server: '../server',
  base: 'app',
  bowerSrc: 'app/bower_components',
  scriptsDest: 'app/js',
  scriptsSrc: 'app/scripts',
  imagesSrc: 'app/images',
  sassSrc: 'app/sass',
  cssDest: 'app/css',
  jsxSrc: 'app/scripts',
  jsxDest: 'app/js',
  dist: '../public'
}
gulp.task('generate-scripts', function() {
  return gulp.src(dev.scriptsSrc + '/**/*.js')
    .pipe(plumber())
    .pipe(react())
    .pipe(concat('components.js'))
    .pipe(gulp.dest(dev.scriptsDest))
    .pipe(connect.reload());
});
gulp.task('minify-images', function() {
  return gulp.src(dev.imagesSrc)
    .pipe(imagemin({optimizationLevel: 5}))
    .pipe(gulp.dest(dev.imagesSrc));
});
gulp.task('compass', function() {
  gulp.src(dev.sassSrc + '/*.scss')
    .pipe(plumber())
    .pipe(compass({
      import_path: dev.bowerSrc,
      css: dev.cssDest,
      sass: dev.sassSrc,
      image: dev.imagesSrc
    }))
    .pipe(concat('main.css'))
    .pipe(gulp.dest(dev.cssDest))
    .pipe(connect.reload());
});
gulp.task('html', function() {
  gulp.src(dev.base + '/*.html')
    .pipe(connect.reload());
});
gulp.task('vendor', function() {
  gulp.src([
      dev.bowerSrc + '/jquery/dist/jquery.js',
      dev.bowerSrc + '/react/react.js',
      dev.bowerSrc + '/lodash/dist/lodash.js'
    ])
    .pipe(concat('plugins.js'))
    .pipe(gulp.dest(dev.scriptsDest));
});
gulp.task('watch', function() {
  gulp.watch(dev.scriptsSrc + '/**/*.js', ['generate-scripts']);
  gulp.watch(dev.imagesSrc + '/**/*', ['minify-images']);
  gulp.watch(dev.sassSrc + '/**/*.scss', ['compass']);
  gulp.watch(dev.base + '/*.html', ['html']);
});
gulp.task('connect', function() {
  connect.server({
    root: 'app',
    livereload: true
  });
});

// Production
gulp.task('build', ['generate-scripts', 'vendor', 'minify-images', 'compass'], function(cb) {
  del.sync(dev.dist, {force:true});
  gulp.src(dev.base + '/*.html')
    // .pipe(debug({verbose:true}))
    .pipe(gulp.dest(dev.dist));
  gulp.src(dev.scriptsDest + '/*.js')
    .pipe(replace(/localhost/, 'chrisronline.com'))
    .pipe(uglify())
    .pipe(gulp.dest(dev.dist + '/js'));
  gulp.src(dev.cssDest + '/*.css')
    .pipe(minifycss({keepBreaks:true}))
    .pipe(gulp.dest(dev.dist + '/css'));
  gulp.src(dev.base + '/fonts/*')
    .pipe(gulp.dest(dev.dist + '/fonts'));
});


gulp.task('default', ['watch', 'generate-scripts', 'vendor', 'minify-images', 'compass', 'connect']);
