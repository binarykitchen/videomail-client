// todo write this in ES6 once i have figured out how to
// transpile it with babelify itself without adding babel-core

const path = require('path')
const fs = require('fs')
const gulp = require('gulp')
const plugins = require('gulp-load-plugins')()
const nib = require('nib')
const browserify = require('browserify')
const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer')
const Router = require('router')
const bodyParser = require('body-parser')
const send = require('connect-send-json')
const del = require('del')
const minimist = require('minimist')
const sslRootCas = require('ssl-root-cas')
const watchify = require('watchify')
const babelify = require('babelify')
const tapeRun = require('tape-run')
const tapSummarize = require('tap-summary')
const glob = require('glob')

const packageJson = require('./package.json')

const defaultOptions = {
  minify: false,
  importance: null,
  write: false,
  version: null
}

const options = minimist(process.argv.slice(2), {default: defaultOptions})

plugins.util.log('Options:', options)

gulp.task('clean:js', (cb) => {
  return del(['dist/*.js', 'dist/*.js.map'])
})

gulp.task('stylus', () => {
  gulp.src('src/styles/styl/main.styl')
    .pipe(plugins.plumber()) // with the plumber the gulp task won't crash on errors
    .pipe(plugins.stylus({
      use: [nib()],
      errors: true
    }))
    // https://github.com/ai/autoprefixer#browsers
    .pipe(plugins.autoprefixer(
      'last 5 versions',
      '> 1%',
      'Explorer >= 11',
      'Firefox ESR',
      'iOS >= 9',
      'android >= 4'
    ))
    // always minify otherwise it gets broken with line-breaks
    // when surrounded with `'s when injected
    // todo: fix this, so that it also works when not minified, this
    // for faster builds during development
    .pipe(plugins.cssnano())
    .pipe(plugins.rename({suffix: '.min', extname: '.css.js'}))
    .pipe(plugins.injectString.wrap('module.exports=\'', '\''))
    // todo: location is bad, should be in a temp folder or so
    .pipe(gulp.dest('src/styles/css'))
    .pipe(plugins.connect.reload())
})

gulp.task('todo', () => {
  gulp.src(
    ['src/**/*.{js, styl}', 'gulpfile.js', 'examples/*.html'],
    {base: './'}
  )
    .pipe(plugins.todo({
      fileName: 'TODO.md'
    }))
    .pipe(gulp.dest('./'))
})

let cache = {}
let packageCache = {}

function bundle (watching) {
  const entry = path.join(__dirname, packageJson.module)
  const bundler = browserify({
    entries: [entry],
    cache: cache,
    standalone: 'VideomailClient',
    packageCache: packageCache,
    plugin: (watching) ? [watchify] : null,
    debug: !options.minify // enables inline source maps
  })
  .on('update', () => {
    pump()
    plugins.util.log('Re-bundling ...')
  })
  .on('log', (msg) => {
    plugins.util.log(msg)
  })
  .require(entry, {expose: 'videomail-client'})
  .transform(babelify)

  function pump () {
    return bundler
      .bundle()
      .on('error', function (err) {
        console.error(err.toString())
        this.emit('end')
      })
      .pipe(source('./src/')) // gives streaming vinyl file object
      .pipe(buffer()) // required because the next steps do not support streams
      .pipe(plugins.concat('videomail-client.js'))
      .pipe(plugins.derequire())
      .pipe(gulp.dest('dist'))
      .pipe(plugins.if(options.minify, plugins.sourcemaps.init()))
      .pipe(plugins.if(options.minify, plugins.bytediff.start()))
      .pipe(plugins.if(options.minify, plugins.uglify()))
      .pipe(plugins.if(options.minify, plugins.rename({suffix: '.min'})))
      .pipe(plugins.if(options.minify, plugins.bytediff.stop()))
      .pipe(plugins.if(options.minify, plugins.sourcemaps.write('/')))
      .pipe(plugins.if(options.minify, gulp.dest('dist')))
      .pipe(plugins.connect.reload())
  }

  return pump()
}

gulp.task('scripts', ['clean:js'], () => {
  return bundle()
})

gulp.task('test', () => {
  const testFiles = glob.sync('test/**/*.test.js')
  const bundler = browserify({
    entries: testFiles
  })
  .transform(babelify)

  return bundler
    .bundle()
    .on('error', function (err) {
      console.error(err.toString())
      this.emit('end')
    })
    .pipe(tapeRun({
      wait: 4e3
    }))
    .pipe(tapSummarize({
      ansi: true,
      progress: true
    }))
    .pipe(process.stdout)
})

gulp.task('connect', ['build'], () => {
  const SSL_CERTS_PATH = path.join(__dirname, '/env/dev/ssl-certs/')

  sslRootCas
    .inject()
    .addFile(path.join(SSL_CERTS_PATH, 'server', 'my-root-ca.crt.pem'))

  plugins.connect.server({
    root: ['examples', 'dist'],
    port: 8080,
    debug: true,
    livereload: true,
    https: {
      key: fs.readFileSync(path.join(SSL_CERTS_PATH, 'server', 'my-server.key.pem')),
      cert: fs.readFileSync(path.join(SSL_CERTS_PATH, 'server', 'my-server.crt.pem'))
    },
    middleware: function () {
      const router = new Router()

      router.use(bodyParser.json())
      router.use(send.json())

      // does not work, see bug https://github.com/AveVlad/gulp-connect/issues/170
      router.post('/contact', function (req, res) {
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

gulp.task('reload', () => {
  plugins.connect.reload()
})

gulp.task('lint', () => {
  return gulp.src(['src/**/*.js', 'gulpfile.js', '!src/styles/css/main.min.css.js'])
    .pipe(plugins.standard())
    .pipe(plugins.standard.reporter('default', {
      breakOnError: true,
      quiet: true
    }))
})

gulp.task('watch', ['connect'], () => {
  bundle(true)

  gulp.watch(['src/styles/styl/**/*.styl'], ['stylus'])
  // commented out so that it reloads faster
  // gulp.watch(['src/**/*.js', 'gulpfile.js', '!src/styles/css/main.min.css.js'], ['lint'])
  gulp.watch(['examples/*.html'], ['reload'])
})

// get inspired by
// https://www.npmjs.com/package/gulp-tag-version and
// https://github.com/nicksrandall/gulp-release-tasks/blob/master/tasks/release.js
gulp.task('bumpVersion', () => {
  const bumpOptions = {}

  if (options.version) {
    bumpOptions.version = options.version
  } else if (options.importance) {
    bumpOptions.type = options.importance
  }

  return gulp.src(['./package.json'])
    .pipe(plugins.bump(bumpOptions))
    .pipe(plugins.if(options.write, gulp.dest('./')))
    .on('error', plugins.util.log)
})

gulp.task('examples', ['connect', 'watch'])
gulp.task('build', ['lint', 'stylus', 'scripts', 'todo'])
gulp.task('default', ['build'])
