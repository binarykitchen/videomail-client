
var gulp            = require('gulp'),
    plugins         = require('gulp-load-plugins')(),
    nib             = require('nib')

// todo: add mocha test runner along with lots of solid tests!

gulp.task('stylus', function(cb) {
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
        .on('end', function() {
            cb()
        })
})

gulp.task('todo', function() {
    gulp.src('src/**/*.{js, jade, styl}', {base: './'})
        .pipe(plugins.todo({
            fileName: 'TODO.md'
        }))
        .pipe(gulp.dest('./'))
})

gulp.task('default', ['stylus', 'todo'])
