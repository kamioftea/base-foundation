/**
 * Created by jeff on 23/03/2015.
 */
var fs = require('fs');
var gulp = require('gulp');
var path = require('path');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var post_css = require('gulp-postcss');
var source_maps = require('gulp-sourcemaps');
var rename = require('gulp-rename');
var auto_prefixer = require('autoprefixer');
var merge = require('merge-stream');
var googleWebFonts = require('gulp-google-webfonts');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var reactify = require('reactify');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');

var paths = require('./paths.js');

function getFolders(dir) {
	return fs.readdirSync(dir)
		.filter(function (file) {
			return fs.statSync(path.join(dir, file)).isDirectory();
		});
}

gulp.task('styles', function () {
	return gulp.src(paths.styles)
		.pipe(source_maps.init())
		.pipe(sass({includePaths: paths.styles_includes}))
		.pipe(post_css([auto_prefixer({browsers: ['last 2 version']})]))
		.pipe(concat(paths.styles_filename))
		.pipe(source_maps.write('.'))
		.pipe(gulp.dest(paths.styles_destination))
});

gulp.task('fonts', function () {
	var nodeFonts = gulp.src(paths.fonts)
		.pipe(gulp.dest(paths.fonts_destination));

	var webFonts = gulp.src(paths.fonts_list)
		.pipe(googleWebFonts())
		.pipe(gulp.dest(paths.fonts_destination));

	return merge(nodeFonts, webFonts)
});

gulp.task('scripts', function () {
	var folders = getFolders(paths.scripts_folder_root);

	var modules = folders.map(function (folder) {
		// concat into folder_name.js
		// write to output
		// minify
		// rename to folder.min.js
		// write to output again
		// SEE: https://github.com/gulpjs/gulp/blob/master/docs/recipes/running-task-steps-per-folder.md
		return gulp.src(path.join(paths.scripts_folder_root, folder, '/**/*.js'))
			.pipe(source_maps.init())
			.pipe(concat(folder + '.compiled.js'))
			.pipe(uglify())
			.pipe(rename(folder + '.min.js'))
			.pipe(source_maps.write('.'))
			.pipe(gulp.dest(paths.scripts_destination));
	});

	var core_scripts = gulp.src(paths.scripts)
		.pipe(source_maps.init())
		.pipe(concat(paths.scripts_core_filename + '.js'))
		.pipe(uglify())
		.pipe(rename(paths.scripts_core_filename + '.min.js'))
		.pipe(source_maps.write('.'))
		.pipe(gulp.dest(paths.scripts_destination));

	return merge(modules, core_scripts);
});

gulp.task('images', function(){
	return gulp.src(paths.images)
		.pipe(imagemin({
			progressive: true,
			use: [pngquant()]
		}))
		.pipe(gulp.dest(paths.images_destination));
});

gulp.task('react', function () {
	return browserify(paths.scripts_react_source)
			.transform(reactify)
			.bundle()
			.pipe(source('app.js'))
			.pipe(buffer())
			.pipe(uglify())
			.pipe(rename('app.min.js'))
			.pipe(gulp.dest(paths.scripts_destination));
});

gulp.task('build', ['styles', 'scripts', 'react', 'fonts', 'images']);

gulp.task('watch', ['build'], function () {
	gulp.watch(paths.styles.concat(paths.styles_includes), ['styles']);
	gulp.watch(paths.scripts, ['scripts']);
	gulp.watch(path.join(paths.scripts_folder_root, '/**/*.js'), ['scripts']);
	gulp.watch(paths.scripts_react_source, ['react']);
	gulp.watch(paths.images, ['images']);
});

gulp.task('default', ['watch']);
