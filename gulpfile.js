var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var gcmq = require('gulp-group-css-media-queries');
var cssnano = require('gulp-cssnano');

var paths = {
  root: './',
  pages: {
    src: './*.html'
  },
  styles: {
    src: './scss/**/*.scss',
    dest: './css'
  }
}

function watch() {
  gulp.watch(paths.styles.src, devStyles);
}

function server() {
  browserSync.init({
    server: {
      baseDir: paths.root,
      directory: true
    }
  });
  browserSync.watch(paths.styles.src, browserSync.reload);
  browserSync.watch(paths.pages.src, browserSync.reload);
}

function devStyles() {
  return gulp.src(paths.styles.src)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.styles.dest))
}

function prodStyles() {
  return gulp.src(paths.styles.src)
    .pipe(sass())
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(gcmq())
    .pipe(cssnano())
    .pipe(gulp.dest(paths.styles.dest))
}

exports.devStyles = devStyles;
exports.prodStyles = prodStyles;

gulp.task('dev', gulp.series(
  gulp.parallel(devStyles),
  gulp.parallel(watch, server),
))

gulp.task('build', gulp.series(
  gulp.parallel(prodStyles),
))