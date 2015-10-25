var gulp = require('gulp');

var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var csso = require('gulp-csso');
var browserSync = require('browser-sync').create();
var cache = require('gulp-cached');
var nodemon = require('gulp-nodemon');

var src_path = "src/";
var build_path = "www/";

gulp.task('lint', function(){
	return gulp.src(src_path + 'js/**/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
	;
});

// copies vanilla files
gulp.task('copy', function(){
	return gulp.src([
		src_path + '**/*.html',
		src_path + '**/*.css',
		src_path + '**/*.js'])
		.pipe(cache('vanilla')) // filters out unchanged files
		.pipe(gulp.dest(build_path))
		.pipe(browserSync.stream())
	;
});

gulp.task('uglify', function(){
	return gulp.src(build_path + 'js/**/*.js')
		.pipe(gulp.dest(build_path + 'js'))
		.pipe(uglify())
	;
});

gulp.task('csso', function(){
	return gulp.src(build_path + 'css/**/*.css')
		.pipe(gulp.dest(build_path + 'css'))
		.pipe(csso())
	;
});

// auto-reloads frontend files
gulp.task('watch', ['nodemon'], function(){
	// TODO: only watch vanilla files for copy task
	gulp.watch([src_path + '**/*'], ['copy']);

	browserSync.init({
        proxy: 'http://localhost:3000', 
        open: false,
        port: 5000
    });
});

// auto-reloads server files
gulp.task('nodemon', function(){
	return nodemon({script:'server.js'});
});

gulp.task('dev', ['lint', 'copy', 'watch']);
gulp.task('prod', ['lint', 'copy', 'uglify', 'csso']);
gulp.task('default', ['prod']);