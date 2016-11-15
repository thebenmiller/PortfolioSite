var gulp          = require('gulp'),
    postcss       = require('gulp-postcss'),
    cssimport     = require('postcss-import'),
    nested        = require('postcss-nested'),
    svg           = require('postcss-svg'),
    autoprefixer  = require('autoprefixer'),
    cssnano       = require('cssnano'),
    lost          = require('lost'),
    cssvars       = require('postcss-simple-vars')
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
    plumber       = require('gulp-plumber'),
    copy          = require('gulp-copy');

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
    cssvars(),
    lost(),
    svg({svgo:true}),
    autoprefixer({browsers: ['last 1 version']}),
    cssnano(),
    ];
  return gulp.src('./src/css/main.css')
    .pipe(plumber(function (error) { gutil.log(error.message); this.emit('end');}))
    .pipe(sourcemaps.init())
    .pipe(postcss(processors))
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
    .pipe(plumber(function (error) { gutil.log(error.message); this.emit('end');}))
    .pipe(source('main.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe( uglify() )
    .pipe(sourcemaps.write('./'))
    .pipe( gulp.dest('./build/public/js/'))
    .pipe( connect.reload() );
});

gulp.task('templates', function() {
  return gulp.src(['./src/www/**/*.jade', '!./src/www/layouts/*.jade'])
    .pipe(plumber(function (error) { gutil.log(error.message); this.emit('end');}))
    .pipe(jade({
      pretty: true,
      markdown: marked
    }))
    .pipe(plumber(function (error) { gutil.log(error.message); this.emit('end');}))
    .pipe(rename(function(path){
        if (path.basename=='index'){
            return;
        }
        path.dirname = (path.dirname != '.' ? path.dirname + '/' : '') + path.basename;
        path.basename="index";
    }))
    .pipe(gulp.dest('build/'))
    .pipe( connect.reload() );
});

gulp.task('images', function(){
  return gulp.src('./src/images/*.*')
    .pipe(gulp.dest('./build/public/images/'));
});

gulp.task('watch', function () {
  gulp.watch('./src/css/**/*.css',['css']);
  gulp.watch('./src/js/**/*.js',['js']);
  gulp.watch('./src/www/**/*.jade',['templates']);
  gulp.watch('./src/images/*.*',['images']);
});

gulp.task('default', ['build', 'watch', 'connect']);
gulp.task('build', ['css','js','templates','images']);
