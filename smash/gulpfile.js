var gulp = require('gulp');
var sass = require('gulp-sass');

//命令行执行gulp 默认执行default任务
gulp.task('default', function () {});

gulp.task('sass', function () {
  return gulp.src('src/css/*.scss')
    .pipe(sass(/*{outputStyle: 'compressed'}*/).on('error', sass.logError))
    .pipe(gulp.dest('src/css/'));
});

//监听文件改动
gulp.task('watch', function () {
  gulp.watch('src/css/*.scss', ['sass']);
});
