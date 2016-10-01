var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');

//命令行执行gulp 默认执行default任务
gulp.task('default', function () {});

gulp.task('sass', function () {

  return gulp.src('src/public/css/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass(/*{outputStyle: 'compressed'}*/).on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('src/public/css/'));
});

//监听文件改动
gulp.task('watch', function () {
  gulp.watch('src/public/css/*.scss', ['sass']);
});
