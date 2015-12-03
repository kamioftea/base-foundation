Base Foundation
===============

Over my last few projects I have built a work-flow for building front-end styles
and scripts. This involves maintaining an assets directory with styles in
\*.scss files; a main javascript folder, with possible per page additional
sub-folders; and a build process to compile these to single, minified files in
the public folder for the app.

External tools
--------------

* [bower](http://bower.io/) is used to manage front-end dependencies.
* [npm](https://www.npmjs.com/) is used to manage the build dependencies.
* [gulp](http://gulpjs.com/) is used as a build tool.

Building
--------

The gulpfile splits building the output files into `scripts`, `styles`, and
`fonts` tasks. [`paths.js`](paths.js) is loaded to allow the source and
destination files to be configured. The steps used by the tasks, and the
configuration is detailed in the relevant sections below.

The `build` task runs all of the individual tasks in parallel, and the `watch`
task runs a build and then watches the relevant paths for changes and re-runs
the required leaf-task(s). The default task is `watch`.

I have recently added a fourth leaf task for compiling the react application
.jsx files. As I'm still learning react the specifics of how this works is
likely to change as I learn more and iterate my react work-flow.

Styles
------

[Foundation](http://foundation.zurb.com) is used as a base CSS framework, and
the gulpfile is setup to compile this from SASS, so this is also available to be
used for custom styles.

[components/font-awesome](https://github.com/components/font-awesome) is used to
bring the Font Awesome icon set.

[app.scss](assets/styles/app.scss) is the base file that includes the external
styles, particularly it is used to cherry pick the foundation modules that are
required. Application specific styles should live in their own file that the
core app.scss includes, or alternatively in a separate root .scss file.

The gulp `styles` task will pass configured files through the SASS
compiler(gulp-sass), use post_css/auto_prefixer to add required vendor specific
prefixes for newer css, concatenate the resulting css, and output it.

 * `paths.styles`: Files to be included in the final output file.
 * `paths.style_includes`: should list directories where the sass compiler can
   find extra files that the core files will `@import` or `@include`.
 * `paths.styles_destination` and `paths.styles_filename` control the output
   directory and filename respectively.

Scripts
-------

Scripts are divided into core scripts, modules, and react.

Core scripts include any required external dependencies, along with any
application specific scripts. These are concatenated and minified using
gulp-concat and gulp-uglify, and output to a single file.

Default core scripts are:

 * JQuery 2
 * Foundation core scripts, module specific scripts will need to be added to the
   list as needed.
 * Highland, for Functional Reactive Programming
 * Handlebars, for templating
 * `assets/scripts/app.js` - The base JS file for the app

Each folder in the root is counted as a module. For each of these folders, all
.js files are concatenated and minified as above, and output to
`<folder-name>.min.js`.

Currently a single react file is compiled to app.min.js, using browserify,
reactify, and uglify. This is likely to change as I work with react more.

 * `paths.scripts`: Array of core scripts to be compiled to a single file
 * `paths.scripts_react_source`: Source file for react app
 * `paths.scripts_folder_root`: Each sub-folder in this directory will be a
   separate javascript 'module'; i.e. the contained .js files are compiled to a
   single .js file.
 * `paths.scripts_destination`: The folder that the core, react, and module
   files will be output to.
 * `paths.scripts_core_filename`: The filename for the outputted core .min.js
   file.

Fonts
-----

This can be used to put fonts required by external dependencies, or the
application styles into the public directory. Fonts already available from
dependencies are directly copied, e.g. font-awesome. `gulp-google-webfonts` is
used to download Google Web Fonts into the directory, along with a `fonts.css`
file to make them available.

 * `paths.fonts`: Array of already downloaded font directories.
 * `paths.fonts_list`: File containing list of fonts in the format expected by
   `gulp-google-webfonts`.
 * `paths.fonts_destination`: The output directory for fonts.
