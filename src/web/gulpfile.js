var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var del = require('del');
var compass = require('gulp-compass');
var through = require('through2');
var react = require('gulp-react');
var plumber = require('gulp-plumber');
var minifycss = require('gulp-minify-css');
var replace = require('gulp-replace');
var debug = require('gulp-debug');
var rev = require('gulp-rev');
var revreplace = require('gulp-rev-replace');
var revcollector = require('gulp-rev-collector');
var frontMatter = require('gulp-front-matter');
var rename = require('gulp-rename');
var gulpFilter = require('gulp-filter');
var hogan = require('hogan.js');
var _ = require('lodash');
var browserSync = require('browser-sync');

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
  templatesSrc: 'app/views',
  dist: 'dist',
  revDir: 'rev'
};

dev.vendor = [
  dev.bowerSrc + '/jquery/dist/jquery.js',
  dev.bowerSrc + '/react/react.js',
  dev.bowerSrc + '/lodash/dist/lodash.js'
];

gulp.task('compile-templates', function() {
  var content = [];
  var posts = [];
  var tags = [];
  var index = null;
  var indexSrcFilter = gulpFilter(['index.src.html'])

  gulp.src('app/**/*.html')
    .pipe(frontMatter())
    .pipe(through.obj(
      function(file, enc, cb) {
        if (file.path.indexOf('views/') === -1) {
          if (file.path.indexOf('index.src.html') > -1) {
            index = file;
          }
        }
        else if (file.path.indexOf('posts') > -1) {
          tags = tags.concat(file.frontMatter.tags.split(','));
          posts.push(file);
        }
        else {
          content.push(file);
        }
        cb();
      },
      function(cb) {
        var model = {};
        model.nav = [];
        model.sections = [];

        model.blog = {};
        model.blog.tags = _.map(_.uniq(tags), function(tag) {
          return { tag: tag };
        });
        model.blog.posts = [];

        // console.log(model.blog);

        content.forEach(function(contentFile) {
          var title = contentFile.frontMatter.title;
          model.nav.push({ href: title, label: title });
          model.sections.push({id: title, content: contentFile.contents.toString()});
        });

        posts.forEach(function(postFile) {
          var post = postFile.frontMatter;
          post.content = postFile.contents.toString();
          post.id = post.title.replace(/\s+/, '-').toLowerCase().replace('.', '-');
          model.blog.posts.push(post);
        });

        // Compile now
        model.sections.forEach(function(section) {
          section.content = hogan.compile(section.content).render(model);
        });

        var compiledTemplate = hogan.compile(index.contents.toString());
        var newContents = compiledTemplate.render(model);
        index.contents = new Buffer(newContents);
        this.push(index);
      }
    ))
    .pipe(indexSrcFilter)
    .pipe(rename('index.html'))
    .pipe(gulp.dest('app'));
});
gulp.task('generate-scripts', function() {
  return gulp.src(dev.scriptsSrc + '/**/*.js')
    .pipe(plumber())
    .pipe(react())
    .pipe(concat('components.js'))
    .pipe(gulp.dest(dev.scriptsDest))
    .pipe(browserSync.reload({stream:true}));
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
    .pipe(browserSync.reload({stream:true}));
});
gulp.task('html', function() {
  gulp.src(dev.base + '/*.html')
    .pipe(browserSync.reload({stream:true}));
});
gulp.task('vendor', function() {
  gulp.src(dev.vendor)
    .pipe(concat('plugins.js'))
    .pipe(gulp.dest(dev.scriptsDest))
    .pipe(browserSync.reload({stream:true}));
});
gulp.task('watch', function() {
  gulp.watch(dev.scriptsSrc + '/**/*.js', ['generate-scripts']);
  gulp.watch(dev.imagesSrc + '/**/*', ['minify-images']);
  gulp.watch(dev.sassSrc + '/**/*.scss', ['compass']);
  gulp.watch(dev.base + '/*.html', ['html', 'compile-templates']);
  gulp.watch(dev.templatesSrc + '/**/*.html', ['compile-templates']);
  gulp.watch(dev.vendor, ['vendor']);
});
gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: 'app'
    }
  });
});

// Production
gulp.task('clean', function(cb) {
  del([dev.dist, dev.revDir], cb);
});
gulp.task('build-scripts', ['clean', 'generate-scripts', 'vendor'], function() {
  return gulp.src(dev.scriptsDest + '/*.js')
    .pipe(replace(/localhost:8082/, 'www.chrisronline.com'))
    .pipe(uglify())
    .pipe(rev())
    .pipe(gulp.dest(dev.dist + '/js'))
    .pipe(rev.manifest())
    .pipe(gulp.dest(dev.revDir + '/js'));
});
gulp.task('build-css', ['clean', 'minify-images', 'compass'], function() {
    return gulp.src(dev.cssDest + '/*.css')
      .pipe(minifycss({keepBreaks:true}))
      .pipe(rev())
      .pipe(gulp.dest(dev.dist + '/css'))
      .pipe(rev.manifest())
      .pipe(gulp.dest(dev.revDir + '/css'));
});
gulp.task('copy', ['clean'], function() {
    gulp.src(dev.base + '/../favicon.ico')
      .pipe(gulp.dest(dev.dist));
    gulp.src(dev.base + '/fonts/*')
      .pipe(gulp.dest(dev.dist + '/fonts'));
});
gulp.task('rev', ['clean', 'build-scripts', 'build-css'], function() {
    return gulp.src([dev.revDir + '/**/*.json', dev.base + '/*.html'])
      .pipe(revcollector())
      .pipe(gulp.dest(dev.dist));
});

gulp.task('build', [
  'build-scripts',
  'build-css',
  'copy',
  'rev'
]);
gulp.task('default', [
  'watch',
  'generate-scripts',
  'compile-templates',
  'vendor',
  'minify-images',
  'compass',
  'browser-sync'
]);
