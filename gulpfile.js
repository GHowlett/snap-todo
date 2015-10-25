var gulp = require('gulp');

var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var csso = require('gulp-csso');

var src_path = "src/";
var build_path = "www/";

gulp.task('lint', function(){
	return gulp.src(src_path + 'js/**/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
	;
});

gulp.task('copy', function(){
	return gulp.src([
		src_path + '**/*.html',
		src_path + '**/*.css',
		src_path + '**/*.js'])
		.pipe(gulp.dest(build_path))
	;
});

gulp.task('uglify', function(){
	return gulp.src(build_path + 'js/**/*.js')
		.pipe(gulp.dest(build_path + 'js_build'))
		.pipe(uglify())
	;
});

gulp.task('csso', function(){
	return gulp.src(build_path + 'css/**/*.css')
		.pipe(gulp.dest(build_path + 'css'))
		.pipe(csso())
	;
});

gulp.task('development', ['lint', 'copy']);
gulp.task('production', ['lint', 'copy', 'uglify', 'csso']);
gulp.task('default', ['production']);