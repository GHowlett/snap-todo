var gulp = require('gulp');

var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var csso = require('gulp-csso');

gulp.task('lint', function(){
	return gulp.src('src/js/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
	;
});

gulp.task('uglify', function(){
	return gulp.src('src/js/*.js')
		.pipe(gulp.dest('www/js'))
		.pipe(uglify())
	;
});

gulp.task('csso', function(){
	return gulp.src('src/css/*.css')
		.pipe(gulp.dest('www/css'))
		.pipe(csso())
	;
});

gulp.task('copy', function(){
	return gulp.src('src/*.html')
		.pipe(gulp.dest('www'))
	;
});

gulp.task('default', ['lint', 'uglify', 'csso', 'copy']);