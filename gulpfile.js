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
var jade = require('gulp-jade');
var stylus = require('gulp-stylus');

var srcPath = "src/";
var buildPath = "www/";

gulp.task('lint', function(){
	return gulp.src(srcPath + 'js/**/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
	;
});

// copies vanilla files
gulp.task('html', function(){
	return gulp.src(srcPath + '**/*.html')
		.pipe(cache()) // filters out unchanged files
		.pipe(gulp.dest(buildPath))
	;
});

gulp.task('jade', function(){
	return gulp.src(srcPath + '**/*.jade')
		.pipe(cache())
		.pipe(jade())
		.pipe(gulp.dest(buildPath))
	;
});

gulp.task('uglify', function(){
	return gulp.src(buildPath + 'js/**/*.js')
		.pipe(gulp.dest(buildPath + 'js'))
		.pipe(uglify())
	;
});

gulp.task('csso', function(){
	return gulp.src(buildPath + 'css/**/*.css')
		.pipe(gulp.dest(buildPath + 'css'))
		.pipe(csso())
	;
});

gulp.task('css', function(){
	return gulp.src(srcPath + '**/*.css')
		.pipe(cache()) // filters out unchanged files
		.pipe(sourcemap.init())
		.pipe(prefixer())
		.pipe(sourcemap.write())
		.pipe(gulp.dest(buildPath))
	;
});

gulp.task('stylus', function(){
	return gulp.src(srcPath + '**/*.styl')
		.pipe(cache()) // filters out unchanged files
		.pipe(sourcemap.init())
		.pipe(stylus())
		.pipe(prefixer())
		.pipe(sourcemap.write())
		.pipe(gulp.dest(buildPath))
	;
});

var bundler = browserify({
	entries: srcPath + 'js/script.js',
	debug: true, // generates sourcemaps
	cache: {}, // watchify arg
	packageCache: {} // watchify arg
});

gulp.task('js', function(){
	return bundler.bundle()
		.pipe(source('js/script.js')) // transforms to a vinyl stream (what gulp expects)
		.pipe(buffer()) // transforms to a vinyl buffer (what sourcemap expects)
		.pipe(sourcemap.init({loadMaps:true}))
		.pipe(sourcemap.write())
		.pipe(gulp.dest(buildPath))
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
    bundler = watchify(bundler, {poll:true}); // poll required for OSX (https://github.com/substack/watchify#rebuilds-on-os-x-never-trigger)

    gulp.watch([srcPath + 'js/**/*.js'], ['lint','js']);
    gulp.watch([srcPath + 'css/**/*.styl'], ['stylus']);
    gulp.watch([srcPath + 'css/**/*.css'], ['css']);
    gulp.watch([srcPath + '**/*.html'], ['html']);
    gulp.watch([srcPath + '**/*.jade'], ['jade']);

    gulp.watch([buildPath + '**/*'], function(){
    	gulp.src(buildPath + '**/*.*')
    		.pipe(cache())
    		.pipe(browserSync.stream())
    });
});

gulp.task('build', ['lint', 'html', 'jade', 'css', 'js']);
gulp.task('dev', ['build', 'watch']);
gulp.task('prod', ['build', 'csso', 'uglify']);
gulp.task('default', ['prod']);