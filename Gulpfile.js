var path            = require('path'),
    gulp            = require('gulp'),
    plugins         = require('gulp-load-plugins')(),
    nib             = require('nib'),
    browserify      = require('browserify'),
    source          = require('vinyl-source-stream'),
    buffer          = require('vinyl-buffer'),
    Router          = require('router'),
    bodyParser      = require('body-parser'),
    send            = require('connect-send-json'),
    del             = require('del'),
    minimist        = require('minimist'),

    defaultOptions = {
        minify:     false,
        importance: null,
        write:      false,
        version:    null
    },

    options = minimist(process.argv.slice(2), {default: defaultOptions})

plugins.util.log('Options:', options)

gulp.task('clean:js', function(cb) {
    del(['dist/*.js']).then(function() {
        cb()
    })
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
            'Explorer >= 10',
            'Chrome >= 34',
            'Firefox ESR',
            'iOS >= 6', 'android >= 4'
        ))
        // always minify otherwise it gets broken with line-breaks
        // when surrounded with `'s when injected
        // todo: fix this, so that it also works when not minified, this
        // for faster builds during development
        .pipe(plugins.cssnano())
        .pipe(plugins.rename({suffix: '.min', extname: '.css.js'}))
        .pipe(plugins.injectString.wrap('module.exports=\'', '\''))
        // todo: location is bad, should be in a temp folder or so
        .pipe(gulp.dest('src/assets/css'))
        .pipe(plugins.connect.reload())
})

gulp.task('todo', function() {
    gulp.src(
            ['src/**/*.{js, styl}', 'Gulpfile.js', 'examples/*.html'],
            {base: './'}
        )
        .pipe(plugins.todo({
            fileName: 'TODO.md'
        }))
        .pipe(gulp.dest('./'))
})

gulp.task('browserify', ['clean:js'], function(cb) {
    var entry   = path.join(__dirname, '/src/index.js'),
        bundler = browserify({
            entries: [entry],
            basedir: __dirname,
            globals: false,
            debug:   true // enables source maps
        })

    bundler
        .require(entry, {expose: 'videomail-client'})
        .bundle()
        .on('error',    cb)
        .on('log',      plugins.util.log)
        .pipe(source('./src/')) // gives streaming vinyl file object
        .pipe(buffer()) // required because the next steps do not support streams
        .pipe(plugins.concat('videomail-client.js'))
        .pipe(gulp.dest('dist'))
        .pipe(plugins.if(options.minify, plugins.rename({suffix: '.min'})))
        .pipe(plugins.if(options.minify, plugins.uglify()))
        .pipe(plugins.if(options.minify, gulp.dest('dist')))
        .pipe(plugins.connect.reload())
        .on('end', cb)
})

gulp.task('connect', ['build'], function() {
    // suppress invalid self-signed ssl certificate error
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

    plugins.connect.server({
        root:       ['examples', 'dist'],
        port:       8080,
        debug:      true,
        livereload: true,
        https:      true, // todo: fix expired certificate, see https://github.com/AveVlad/gulp-connect/issues/140
        middleware: function(connect, options) {
            var router = new Router()

            router.use(bodyParser.json())
            router.use(send.json())

            // does not work, see bug https://github.com/AveVlad/gulp-connect/issues/170
            router.post('/contact', function(req, res) {
                console.log('Videomail data received:', req.body)

                // At this stage, a backend could store the videomail_key in req.body
                // into a database for replay functionality

                // Just an example to see that the backend can do anything with the data
                res.json({
                    status: 'Inserted on ' + new Date().toISOString()
                })
            })

            return [router]
        }
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

// get inspired by
// https://www.npmjs.com/package/gulp-tag-version and
// https://github.com/nicksrandall/gulp-release-tasks/blob/master/tasks/release.js
gulp.task('bumpVersion', function() {
    var bumpOptions = {}

    if (options.version)
        bumpOptions.version = options.version

    else if (options.importance)
        bumpOptions.type = options.importance

    return gulp.src(['./package.json'])
        .pipe(plugins.bump(bumpOptions))
        .pipe(plugins.if(options.write, gulp.dest('./')))
        .on('error', plugins.util.log)
})

gulp.task('examples',  ['connect', 'watch'])
gulp.task('build',     ['stylus', 'browserify', 'todo'])
gulp.task('default',   ['build'])
