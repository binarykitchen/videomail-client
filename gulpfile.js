// todo write this in ES6 once i have figured out how to
// transpile it with babelify itself

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
const watchify = require('watchify')
const babelify = require('babelify')
const tapeRun = require('tape-run')
const glob = require('glob')
const log = require('fancy-log')
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')

const packageJson = require('./package.json')

const defaultOptions = {
  minify: true,
  importance: null,
  write: false,
  version: null
}

const options = minimist(process.argv.slice(2), { default: defaultOptions })

log.info('Options:', options)

function cleanJs (cb) {
  return del(['prototype/js/*.js', 'prototype/js/*.js.map'])
}

function stylus () {
  const postCssPlugins = [
    autoprefixer(),
    cssnano()
  ]

  return gulp.src('src/styles/styl/main.styl')
    .pipe(plugins.plumber()) // with the plumber the gulp task won't crash on errors
    .pipe(plugins.stylus({
      use: [nib()],
      errors: true
    }))
    // always minify otherwise it gets broken with line-breaks
    // when surrounded with `'s when injected
    // todo: fix this, so that it also works when not minified, this
    // for faster builds during development
    .pipe(plugins.postcss(postCssPlugins))
    .pipe(plugins.rename({ suffix: '.min', extname: '.css.js' }))
    .pipe(plugins.injectString.wrap('module.exports=\'', '\''))
    // todo: location is bad, should be in a temp folder or so
    .pipe(gulp.dest('src/styles/css'))
    .pipe(plugins.connect.reload())
}

function todo () {
  return gulp.src(
    ['src/**/*.{js, styl}', 'gulpfile.js', 'prototype/*.html'],
    { base: './' }
  )
    .pipe(plugins.todo({
      fileName: 'TODO.md'
    }))
    .pipe(gulp.dest('./'))
}

const cache = {}
const packageCache = {}

function bundle (done, watching) {
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
      log('Re-bundling ...')
    })
    .on('log', log)
    .require(entry, { expose: 'videomail-client' })
    .transform(babelify)

  function pump () {
    return bundler
      .bundle()
      .on('error', function (err) {
        console.error(err.toString())
        this.emit('end')
      })
      .on('end', done)
      .pipe(source('./src/')) // gives streaming vinyl file object
      .pipe(buffer()) // required because the next steps do not support streams
      .pipe(plugins.concat('videomail-client.js'))
      .pipe(plugins.derequire())
      .pipe(gulp.dest('prototype/js'))
      .pipe(plugins.plumber())
      .pipe(plugins.if(options.minify, plugins.rename({ suffix: '.min' })))
      .pipe(plugins.if(options.minify, plugins.sourcemaps.init()))
      .pipe(plugins.if(options.minify, plugins.bytediff.start()))
      .pipe(plugins.if(options.minify, plugins.terser()))
      .pipe(plugins.if(options.minify, plugins.bytediff.stop()))
      .pipe(plugins.if(options.minify, plugins.sourcemaps.write('/')))
      .pipe(plugins.if(options.minify, gulp.dest('prototype/js')))
      .pipe(plugins.connect.reload())
  }

  return pump()
}

function bundleWithWatchify (done) {
  bundle(done, true)
}

function lint () {
  return gulp.src(['src/**/*.js', 'gulpfile.js', '!src/styles/css/main.min.css.js'])
    .pipe(plugins.standard())
    .pipe(plugins.standard.reporter('default', {
      breakOnError: true,
      quiet: true
    }))
}

function middleware () {
  const router = new Router()

  router.use(bodyParser.json())
  router.use(send.json())

  // does not work, see bug https://github.com/AveVlad/gulp-connect/issues/170
  router.post('/contact', function (req, res) {
    log.info('Videomail data received (with meta data):', req.body)

    // At this stage, a backend could store the videomail_key in req.body
    // into a database for replay functionality

    // Just an example to see that the backend can do anything with the data
    res.json({
      status: 'Inserted on ' + new Date().toISOString()
    })
  })

  return [router]
}

const connectOptions = {
  root: ['prototype'],
  port: 8080,
  debug: true,
  livereload: false, // disabled since it's broken unfortunately, see https://github.com/intesso/connect-livereload/issues/79
  middleware: middleware
}

function connectHttp (done) {
  plugins.connect.server(connectOptions)
  done()
}

function connectHttps (done) {
  const SSL_CERTS_PATH = path.join(__dirname, 'env', 'dev')

  plugins.connect.server(Object.assign({}, connectOptions, {
    port: 8443,
    https: {
      key: fs.readFileSync(path.join(SSL_CERTS_PATH, 'key.pem')),
      cert: fs.readFileSync(path.join(SSL_CERTS_PATH, 'cert.pem'))
    }
  }))

  done()
}

function reload (done) {
  plugins.connect.reload()
  done()
}

function watch (done) {
  gulp.watch(['src/styles/styl/**/*.styl'], stylus)
  // commented out so that it reloads faster
  // gulp.watch(['src/**/*.js', 'gulpfile.js', '!src/styles/css/main.min.css.js'], ['lint'])
  gulp.watch(['prototype/*.html'], reload)

  done()
}

exports.test = function (done) {
  const testFiles = glob.sync('test/**/*.test.js')
  const bundler = browserify({
    entries: testFiles
  })
    .transform(babelify)

  bundler
    .bundle()
    .on('error', function (err) {
      console.error(err.toString())
      this.emit('end')
      done()
    })
    .pipe(tapeRun({
      wait: 4e3
    }))
    .on('results', function () {
      done()
    })
    .pipe(process.stdout)
}

// get inspired by
// https://www.npmjs.com/package/gulp-tag-version and
// https://github.com/nicksrandall/gulp-release-tasks/blob/master/tasks/release.js
exports.bumpVersion = function () {
  const bumpOptions = {}

  if (options.version) {
    bumpOptions.version = options.version
  } else if (options.importance) {
    bumpOptions.type = options.importance
  }

  return gulp.src(['./package.json'])
    .pipe(plugins.bump(bumpOptions))
    .pipe(plugins.if(options.write, gulp.dest('./')))
    .on('error', log.error)
}

const build = gulp.series(lint,
  gulp.parallel(
    gulp.series(stylus, cleanJs, bundle),
    todo
  )
)

exports.watch = gulp.series(lint,
  gulp.parallel(
    gulp.series(stylus, cleanJs, bundleWithWatchify),
    todo
  ),
  gulp.parallel(connectHttp, connectHttps),
  watch
)

exports.build = build
exports.default = build
exports.lint = lint
