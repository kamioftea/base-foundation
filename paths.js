module.exports = {
	styles:              ['./assets/styles/app.scss'],
	styles_includes:      [
		'./assets/styles',
		'./bower_components/foundation-sites/scss',
		'./bower_components/components-font-awesome/scss'
	],
	styles_filename:     'app.css',
	styles_destination:  './public/styles',
	scripts:             [
		'./bower_components/jquery/dist/jquery.js',
		'./bower_components/foundation/js/foundation.core.js',
		'./bower_components/highland/dist/highland.js',
		'./bower_components/handlebars/handlebars.js',
    './assets/scripts/app.js',
	],
	scripts_react_source:'./assets/scripts/app.jsx',
	scripts_folder_root: './assets/scripts',
	scripts_destination: './public/scripts',
  scripts_core_filename: 'core',
	fonts:               [
		'./bower_components/components-font-awesome/fonts/*'
	],
	fonts_list:          './assets/font.list',
	fonts_destination:   './public/fonts',
	images:              './assets/images/**/*.{png,gif,jpg}',
	images_destination:  './public/images'
};
