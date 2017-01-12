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
    transform     = require('vinyl-transform'),
    jade          = require('gulp-jade'),
    marked        = require('marked'),
    path          = require('path'),
    connect       = require('gulp-connect'),
    gutil         = require('gulp-util'),
    opn           = require('opn'),
    rename        = require('gulp-rename'),
    plumber       = require('gulp-plumber'),
    imagemin      = require('gulp-imagemin');
    concat        = require('gulp-concat');

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
  return gulp.src('src/css/main.css')
    .pipe(plumber(function (error) { gutil.log(error.message); this.emit('end');}))
    .pipe(sourcemaps.init())
    .pipe(postcss(processors))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('build/public/css/'))
    .pipe( connect.reload() );
  });

gulp.task('js', function() {
  return browserify({ entries: 'src/js/main.js', debug: true})
    .transform('babelify', {presets: ['es2015']})
    .bundle()
    .pipe(plumber(function (error) { gutil.log(error.message); this.emit('end');}))
    .pipe(source('main.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('build/public/js/'))
    .pipe(connect.reload());
});

gulp.task('js-alt', function(){
  return gulp.src(['src/js/*.js', '!src/js/main.js'])
    .pipe(uglify())
    .pipe(gulp.dest('build/public/js/'));
});

gulp.task('js-vendor', function(){
  return gulp.src('src/js/vendor/**/*.js')
    .pipe(gulp.dest('build/public/js/'));
});

gulp.task('precompile', function(){
  return gulp.src('src/js/vendor/**/*.js')
    .pipe(concat('all.js'))
    .pipe(uglify())
    .pipe(gulp.dest('src/js/compiled/'));
});

gulp.task('templates', function() {
  return gulp.src(['src/www/**/*.jade', '!src/www/layouts/*.jade'])
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
  return gulp.src('src/images/**/*.*')
    .pipe(plumber(function (error) { gutil.log(error.message); this.emit('end');}))
    .pipe(imagemin())
    .pipe(gulp.dest('build/public/images'))
});

gulp.task('videos', function(){
  return gulp.src('src/videos/*.*')
    .pipe(gulp.dest('build/public/videos'));
});

gulp.task('watch', function () {
  gulp.watch('src/css/**/*.css',['css']);
  gulp.watch('src/js/*.js',['js', 'js-alt']);
  gulp.watch('src/js/vendor/**/*.js', ['js-vendor']);
  gulp.watch('src/www/**/*.jade',['templates']);
  gulp.watch('src/images/*.*',['images']);
});

gulp.task('default', ['build', 'watch', 'connect']);
gulp.task('build', ['css','js','js-alt','templates','images','videos']);
