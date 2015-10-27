var gulp = require('gulp');

var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var csso = require('gulp-csso');
var browserSync = require('browser-sync').create();
var cache = require('gulp-cached');
var nodemon = require('gulp-nodemon');
var prefixer = require('gulp-autoprefixer');
var sourcemap = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var watchify = require('watchify');

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
	return gulp.src(src_path + '**/*.html')
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

var bundler = browserify({
	entries: src_path + 'js/script.js',
	debug: true, // generates sourcemaps
	cache: {}, // watchify arg
	packageCache: {} // watchify arg
});

gulp.task('bundle', function(){
	return bundler.bundle()
		.pipe(source('js/script.js')) // transforms to a vinyl stream (what gulp expects)
		.pipe(buffer()) // transforms to a vinyl buffer (what sourcemap expects)
		.pipe(sourcemap.init({loadMaps:true}))
		.pipe(sourcemap.write())
		.pipe(gulp.dest(build_path))
		.pipe(browserSync.stream())
	;
});

gulp.task('watch', function(){
	// auto-reloads server files
	nodemon({
		script:'server.js', 
		watch:['server.js'],
		env: {'PORT': '3000'}
	});

	// auto-reloads frontend files
	browserSync.init({
        proxy: 'http://localhost:3000', 
        open: false,
        port: 5000
    });

	// incrementally rebuilds bundle
    bundler = watchify(bundler);

    gulp.watch([src_path + '**/*'], ['build']);
});

gulp.task('build', ['lint', 'copy', 'prefix', 'bundle']);
gulp.task('dev', ['build', 'watch']);
gulp.task('prod', ['build', 'csso', 'uglify']);
gulp.task('default', ['prod']);