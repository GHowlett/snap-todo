var gulp = require('gulp');

var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var csso = require('gulp-csso');
var browserSync = require('browser-sync').create();
var cache = require('gulp-cached');
var nodemon = require('gulp-nodemon');
var prefixer = require('gulp-autoprefixer');
var sourcemap = require('gulp-sourcemaps');

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
		src_path + '**/*.js'])
		.pipe(cache()) // filters out unchanged files
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

gulp.task('prefix', function(){
	return gulp.src(src_path + '**/*.css')
		.pipe(cache()) // filters out unchanged files
		.pipe(sourcemap.init())
		.pipe(prefixer())
		.pipe(sourcemap.write())
		.pipe(gulp.dest(build_path))
		.pipe(browserSync.stream())
	;
});

gulp.task('browserify', function(){
	return browserify(src_path + 'js/script.js').bundle()
		.pipe(source('script.js')) // transforms to a vinyl stream (what gulp expects)
		.pipe(gulp.dest(build_path))
	;
});


gulp.task('watch', function(){
	// auto-reloads server files
	nodemon({script:'server.js', watch:['server.js']});

	// auto-reloads frontend files
	browserSync.init({
        proxy: 'http://localhost:3000', 
        open: false,
        port: 5000
    }, function(){
		gulp.watch([src_path + '**/*'], ['build']);
    });
});

gulp.task('build', ['lint', 'copy', 'prefix', 'browserify'])
gulp.task('dev', ['build', 'watch']);
gulp.task('prod', ['build', 'csso', 'uglify']);
gulp.task('default', ['prod']);