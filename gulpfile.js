var gulp = require('gulp');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var watch = require('gulp-watch');
var karma = require('gulp-karma');
var livereload = require('gulp-livereload');

var testFiles = [
    'bower_components/jquery/dist/jquery.min.js',
    'src/namespace.js',
    'src/wally.js',
    'src/helpers.js',
    'src/styler.js',
    'spec/wally_spec.js',
    'spec/wally_internal_spec.js',
    'spec/wally_helpers_spec.js'
];

var distJsFiles = [
    'src/namespace.js',
    'src/wally.js',
    'src/helpers.js',
    'src/styler.js'
]

gulp.task('default', function(){
  gulp.start('lint');
  gulp.start('test');
  gulp.start('compress');
  gulp.start('copy');
});

gulp.task('watch', function() {
    var server = livereload();
    gulp.watch(['src/*.js', '*.html'], function(files) {
      server.changed(files.path); // livereload notification
    });
    gulp.src(testFiles)
        .pipe(karma({
          configFile: 'karma.conf.js',
          action: 'watch'
        }));
});

gulp.task('compress', function() {
  gulp.src(distJsFiles)
    .pipe(uglify({outSourceMap: false}))
    .pipe(concat("wally.min.js"))
    .pipe(gulp.dest('dist'))
});

gulp.task('compress_development', function() {
  gulp.src(distJsFiles)
    .pipe(uglify({outSourceMap: false}))
    .pipe(concat("wally.min.js"))
    .pipe(gulp.dest('src'))
});

gulp.task('copy', function() {
  gulp.src(distJsFiles)
    .pipe(concat("wally.js"))
    .pipe(gulp.dest('dist'))
});

gulp.task('lint', function() {
  gulp.src(distJsFiles)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});


gulp.task('test', function() {
  // Be sure to return the stream
  return gulp.src(testFiles)
    .pipe(karma({
      configFile: 'karma.conf.js',
      action: 'run'
    }));
});
