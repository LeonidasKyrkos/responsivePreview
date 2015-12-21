//jslint node: true

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')({
	pattern: '*',
	rename: {
		'vinyl-source-stream': 'source'
	}
});

var srcDir = "app/";
var buildDir = srcDir+"build/";
var task = plugins.util.env._[0];
var bourbon = require('node-bourbon').includePaths;

gulp.task('styles', function() {

	return gulp.src(srcDir + 'scss/**/*.scss')
		.pipe(plugins.sass({
			outputStyle: task === 'build' ? 'compressed' : 'expanded',
			includePaths: [bourbon],
			errLogToConsole: false
		}).on('error', reportError))
		.pipe(gulp.dest(buildDir+'/css/'))
		.pipe(plugins.browserSync.reload({
			stream: true
		}));
});

gulp.task('scripts', function() {
	var b;
	var watch = typeof task === "undefined";

	var config = {
		entries: srcDir +'js/src/app.js'
	}
	if(watch){
		config.debug = true;
		config.cache = {};
		config.packageCache = {};
		config.plugin =  [plugins.watchify];
	}
	b = plugins.browserify(config);
	b.transform("babelify", {presets: ["es2015"]});

	if(watch){
		b.on('update', rebundle);
	}
	
	function rebundle(){
		b.bundle().on('error',reportError)
			.pipe(plugins.source('app.js'))
			.pipe(!watch ? plugins.streamify(plugins.uglify()) : plugins.util.noop())
			.pipe(gulp.dest(buildDir + 'js'))
			.pipe(plugins.browserSync.reload({
				stream: true
			}));
	}

	return rebundle();
});

function reportError() {
	var errors,slice = [].slice;
	errors = 1 <= arguments.length ? slice.call(arguments, 0) : [];
	console.log(errors);
	plugins.notify.onError({
		title: "Compile Error",
		message: "<%= error.message %>"
	}).apply(this, errors);
	return this.emit('end');
}

gulp.task('browser-sync', function() {
	return plugins.browserSync.init(null, {
		server: {
			baseDir: srcDir
		}
	});
});

gulp.task('bs-reload', function() {
	return plugins.browserSync.reload();
});

gulp.task('default', ['styles', 'scripts', 'browser-sync'], function() {
	gulp.watch(srcDir + '*.html', ['bs-reload']);
	gulp.watch(srcDir + 'scss/**/*.scss', ['styles']);
});

gulp.task('build', ['styles', 'scripts']);