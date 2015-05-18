var gulp            = require('gulp'),
    plugins         = require('gulp-load-plugins')(),
    nib             = require('nib'),
    browserify      = require('browserify'),
    source          = require('vinyl-source-stream'),
    buffer          = require('vinyl-buffer'),
    del             = require('del')

gulp.task('clean:js', function(cb) {
    del(['dist/*.js'], cb)
})

gulp.task('stylus', function() {
    gulp.src('src/assets/styl/main.styl')
        .pipe(plugins.plumber()) // with the plumber the gulp task won't crash on errors
        .pipe(plugins.stylus({
            use:    [nib()],
            errors: true
        }))
        // https://github.com/ai/autoprefixer#browsers
        .pipe(plugins.autoprefixer(
            'last 3 versions',
            '> 1%',
            'Explorer >= 9',
            'Chrome >= 30',
            'Firefox ESR',
            'iOS >= 6', 'android >= 4'
        ))
        .pipe(plugins.minifyCss())
        .pipe(plugins.rename({suffix: '.min', extname: '.css.js'}))
        .pipe(plugins.injectString.wrap('module.exports=\'', '\''))
        .pipe(gulp.dest('src/assets/css'))
        .pipe(plugins.connect.reload())
})

gulp.task('todo', function() {
    gulp.src('src/**/*.{js, styl}', {base: './'})
        .pipe(plugins.todo({
            fileName: 'TODO.md'
        }))
        .pipe(gulp.dest('./'))
})

// todo: change when https://github.com/substack/node-browserify/issues/1271 is fixed
gulp.task('browserify', ['clean:js'], function(cb) {
    var bundler = browserify({
            entries:    ['./src/index.js'],
            globals:    false,
            debug:      true // enables source maps
        })

    bundler
        .require('./src/index.js', {expose: 'videomail-client'})
        .bundle()
        .on('error',    cb)
        .on('log',      plugins.util.log)
        .pipe(source('./src/')) // gives streaming vinyl file object
        .pipe(buffer()) // required because the next steps do not support streams
        .pipe(plugins.concat('videomail-client.js'))
        .pipe(gulp.dest('dist'))
        /* TODO: add this back when we are stable. commented out now for speed.
        .pipe(plugins.rename({suffix: '.min'}))
        .pipe(plugins.uglify())
        .pipe(gulp.dest('dist'))
        */
        .pipe(plugins.connect.reload())
        .on('end', cb)
})

gulp.task('connect', ['build'], function() {
    plugins.connect.server({
        root:       ['examples', 'dist'],
        port:       8080,
        livereload: true
    })
})

gulp.task('reload', function() {
    plugins.connect.reload()
})

gulp.task('watch', ['connect'], function() {
    gulp.watch(['src/assets/styl/**/*.styl'],   ['stylus'])
    gulp.watch(['src/**/*.js'],                 ['browserify'])
    gulp.watch(['examples/*.html'],             ['reload'])
})

gulp.task('examples',  ['connect', 'watch'])
gulp.task('build',     ['stylus', 'browserify', 'todo'])
gulp.task('default',   ['build'])
