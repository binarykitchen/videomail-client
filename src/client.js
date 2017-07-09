import merge from 'merge-recursive'
import readystate from 'readystate'
import util from 'util'

import defaultOptions from './options'
import Constants from './constants'
import Events from './events'
import CollectLogger from './util/collectLogger'
import EventEmitter from './util/eventEmitter'
import Container from './wrappers/container'
import OptionsWrapper from './wrappers/optionsWrapper'
import Replay from './wrappers/visuals/replay'
import Browser from './util/browser'
import Resource from './resource'

var collectLogger
var browser

function adjustOptions (options = {}) {
  const localOptions = merge.recursive(defaultOptions, options)

  collectLogger = collectLogger || new CollectLogger(localOptions)

  localOptions.logger = collectLogger
  localOptions.debug = localOptions.logger.debug

  OptionsWrapper.addFunctions(localOptions)

  return localOptions
}

function getBrowser (localOptions) {
  if (!browser) {
    browser = new Browser(localOptions)
  }

  return browser
}

const VideomailClient = function (options) {
  const localOptions = adjustOptions(options)
  const container = new Container(localOptions)
  const debug = localOptions.debug

  var replay

  EventEmitter.call(this, localOptions, 'VideomailClient')

  // expose all possible events
  this.events = Events

  function build () {
    var building = false

    readystate.interactive((previousState) => {
      debug(
        'Client: interactive(),',
        'previousState =', previousState + ',',
        '!building =', !building + ',',
        '!isBuilt() =', !container.isBuilt()
      )

      // it can happen that it gets called twice, i.E. when an error is thrown
      // in the middle of the build() fn
      if (!building && !container.isBuilt()) {
        building = true
        container.build()
        building = false
      }
    })
  }

  this.show = () => {
    if (container.isBuilt()) {
      container.show()
    } else {
      this.once(Events.BUILT, container.show)
    }
  }

  // automatically adds a <video> element inside the given parentElement and loads
  // it with the videomail
  this.replay = (videomail, parentElement) => {
    function buildReplay () {
      if (typeof parentElement === 'string') {
        parentElement = document.getElementById(parentElement)
      }

      // if there is none, use the automatically generated one
      if (!parentElement) {
        replay = container.getReplay()
        parentElement = replay.getParentElement()
      } else {
        replay = new Replay(parentElement, localOptions)
        replay.build()
      }

      videomail = container.addPlayerDimensions(videomail, parentElement)

      if (videomail) {
        if (container.isOutsideElementOf(parentElement)) {
          // replay element must be outside of the container
          container.hideForm()
        } else {
          container.loadForm(videomail)
        }

        // slight delay needed to avoid HTTP 416 errors (request range unavailable)
        setTimeout(function () {
          replay.setVideomail(videomail)

          container.showReplayOnly()
        }, 2e3)
      }
    }

    readystate.interactive(buildReplay)
  }

  this.startOver = () => {
    replay && replay.hide()
    container.startOver()
  }

  this.unload = (e) => {
    readystate.removeAllListeners()
    container.unload(e)
  }

  this.hide = function () {
    container.hide()
  }

  this.get = function (key, cb) {
    new Resource(localOptions).get(key, function (err, videomail) {
      if (err) {
        cb(err)
      } else {
        cb(null, container.addPlayerDimensions(videomail))
      }
    })
  }

  this.canRecord = function () {
    return getBrowser(localOptions).canRecord()
  }

  // return true when a video has been recorded but is not sent yet
  this.isDirty = function () {
    return container.isDirty()
  }

  this.submit = function () {
    container.submit()
  }

  this.getLogLines = function () {
    if (localOptions.logger && localOptions.logger.getLines) {
      return localOptions.logger.getLines()
    }
  }

  build()
}

util.inherits(VideomailClient, EventEmitter)

Object.keys(Constants.public).forEach(function (name) {
  VideomailClient[name] = Constants.public[name]
})

// just another convenient thing
VideomailClient.events = Events

export default VideomailClient
