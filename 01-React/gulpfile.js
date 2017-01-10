"use strict";
var gulp 		= require('gulp');
var connect 	= require('gulp-connect'); 					// Runs a local dev server
var open 		= require('gulp-open'); 					// Open a url in a web browser
var browserify 	= require('browserify');					// Bundle JS Files
var reactify 	= require('reactify');						// Transform React JSX to JS
var source 		= require('vinyl-source-stream');			// Use conventional text streams with Gulp
var config 		= require('./public/config/gulpconfig');

// Start a local development server
gulp.task('develop', function() {
	connect.server({
		root: ['public/dist'],
		port: config.port,
		base: config.devBaseUrl,
		livereload: true
	});

	gulp.src('public/dist/index.html')
		.pipe(open({ uri: config.devBaseUrl + ':' + config.port + '/' }));
});

// Gulp all HTML files and move them into the dist folder
gulp.task('html', function() {
	gulp.src(config.paths.html)
		.pipe(gulp.dest(config.paths.dist))
		.pipe(connect.reload());
});

// Gulp all JS files and move them into the dist folder
gulp.task('js', function() {
	browserify(config.paths.mainJs)
		.transform(reactify)
		.bundle()
		.on('error', console.error.bind(console))
		.pipe(source('bundle.js'))
		.pipe(gulp.dest(config.paths.dist + '/scripts'))
		.pipe(connect.reload());
});

// Watch for changes in all HTML files and call the html task if a change occurs
gulp.task('watch', function() {
	gulp.watch(config.paths.html, 	['html']);
	gulp.watch(config.paths.js, 	['js']);
});

// Tasks to run by typing in 'gulp' in the command line
gulp.task('default', ['html', 'js', 'develop', 'watch']);