var gulp          = require('gulp'),
    postcss       = require('gulp-postcss'),
    cssimport     = require('postcss-import'),
    nested        = require('postcss-nested'),
    autoprefixer  = require('autoprefixer'),
    cssnano       = require('cssnano'),
    lost          = require('lost'),
    sourcemaps    = require('gulp-sourcemaps'),
    babelify      = require('babelify'),
    browserify    = require('browserify'),
    uglify        = require('gulp-uglify'),
    source        = require('vinyl-source-stream');
    buffer        = require('vinyl-buffer'),
    jade          = require('gulp-jade'),
    marked        = require('marked'),
    path          = require('path'),
    connect       = require('gulp-connect'),
    gutil         = require('gulp-util'),
    opn           = require('opn'),
    rename        = require('gulp-rename'),
    plumber       = require('gulp-plumber')

gulp.task('connect', function() {
  connect.server({
    root: 'build',
    livereload: true
  });
  return opn('http://localhost:8080');
});

gulp.task('css', function () {
  var processors = [
    cssimport,
    nested,
    lost(),
    autoprefixer({browsers: ['last 1 version']}),
    cssnano(),
    ];
  return gulp.src('./src/css/main.css')
    .pipe(sourcemaps.init())
    .pipe(postcss(processors))
    .pipe(plumber(function (error) { gutil.log(error.message); this.emit('end');}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./build/public/css/'))
    .pipe( connect.reload() );
  });

gulp.task('js', function() {
  var bundler = browserify({
    entries: './src/js/main.js',
    debug: true
  });
  bundler.transform(babelify);
  return bundler.bundle()
    .pipe(source('main.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe( uglify() )
    .pipe(plumber(function (error) { gutil.log(error.message); this.emit('end');}))
    .pipe(sourcemaps.write('./'))
    .pipe( gulp.dest('build/public/js/'))
    .pipe( connect.reload() );
});

gulp.task('templates', function() {
  return gulp.src('./src/www/*.jade')
    .pipe(jade({
      pretty: true,
      markdown: marked
    }))
    .pipe(plumber(function (error) { gutil.log(error.message); this.emit('end');}))
    .pipe(rename(function(path){
        if (path.basename=='index'){
            return;
        }
        path.dirname=path.basename.split('-').join('/');
        path.basename="index";
    }))
    .pipe(gulp.dest('build/'))
    .pipe( connect.reload() );
});

gulp.task('watch', function () {
  gulp.watch('./src/css/**/*.css',['css']);
  gulp.watch('./src/js/**/*.js',['js']);
  gulp.watch('./src/www/**/*.jade',['templates']);
});

gulp.task('default', ['build', 'watch', 'connect']);
gulp.task('build', ['css','js','templates']);
