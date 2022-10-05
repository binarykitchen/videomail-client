import superagent from 'superagent'

import Constants from './constants'

const CACHE_KEY = 'alias'

export default function (options) {
  const cache = {}

  function applyDefaultValue(videomail, name) {
    if (options.defaults[name] && !videomail[name]) {
      videomail[name] = options.defaults[name]
    }

    return videomail
  }

  function applyDefaultValues(videomail) {
    if (options.defaults) {
      videomail = applyDefaultValue(videomail, 'from')
      videomail = applyDefaultValue(videomail, 'to')
      videomail = applyDefaultValue(videomail, 'subject')
      videomail = applyDefaultValue(videomail, 'body')
    }

    return videomail
  }

  function packError(err, res) {
    if (res && res.body && res.body.error) {
      // use the server generated text instead of the superagent's default text
      err = res.body.error

      if (!err.message && res.text) {
        err.message = res.text
      }
    }

    return err
  }

  function fetch(alias, cb) {
    const timezoneId = Intl.DateTimeFormat().resolvedOptions().timeZone

    superagent
      .get('/videomail/' + alias + '/snapshot')
      .set('Accept', 'application/json')
      .set('Accept-Timezone', timezoneId)
      .set(Constants.SITE_NAME_LABEL, options.siteName)
      .timeout(options.timeouts.connection)
      .end(function (err, res) {
        err = packError(err, res)

        if (err) {
          cb(err)
        } else {
          const videomail = res.body ? res.body : null

          if (options.cache) {
            cache[CACHE_KEY] = videomail
          }

          cb(null, videomail)
        }
      })
  }

  function write(method, videomail, identifier, cb) {
    if (!cb) {
      cb = identifier
      identifier = null
    }

    const queryParams = {}

    let url = options.baseUrl + '/videomail/'

    if (identifier) {
      url += identifier
    }

    const request = superagent(method, url)

    queryParams[Constants.SITE_NAME_LABEL] = options.siteName

    request
      .query(queryParams)
      .send(videomail)
      .timeout(options.timeout)
      .end(function (err, res) {
        err = packError(err, res)

        if (err) {
          cb(err)
        } else {
          const returnedVideomail =
            res.body && res.body.videomail ? res.body.videomail : null

          if (options.cache && videomail[CACHE_KEY]) {
            cache[videomail[CACHE_KEY]] = returnedVideomail
          }

          cb(null, returnedVideomail, res.body)
        }
      })
  }

  this.get = function (alias, cb) {
    if (options.cache && cache[alias]) {
      // keep all callbacks async
      setTimeout(() => {
        cb(null, cache[alias])
      }, 0)
    } else {
      fetch(alias, cb)
    }
  }

  this.reportError = function (err, cb) {
    const queryParams = {}
    const url = options.baseUrl + '/client-error/'
    const request = superagent('post', url)

    queryParams[Constants.SITE_NAME_LABEL] = options.siteName

    request
      .query(queryParams)
      .send(err)
      .timeout(options.timeout)
      .end(function (err, res) {
        err = packError(err, res)
        if (err) {
          cb && cb(err)
        } else {
          cb && cb()
        }
      })
  }

  this.post = function (videomail, cb) {
    videomail = applyDefaultValues(videomail)

    // always good to know the version of the client
    // the videomail was submitted with
    videomail[Constants.VERSION_LABEL] = options.version

    if (options.callbacks.adjustFormDataBeforePosting) {
      options.callbacks.adjustFormDataBeforePosting(
        videomail,
        function (err, adjustedVideomail) {
          if (err) {
            cb(err)
          } else {
            write('post', adjustedVideomail, cb)
          }
        }
      )
    } else {
      write('post', videomail, cb)
    }
  }

  this.put = function (videomail, cb) {
    write('put', videomail, videomail.key, cb)
  }

  this.form = function (formData, url, cb) {
    let formType

    switch (options.enctype) {
      case Constants.public.ENC_TYPE_APP_JSON:
        formType = 'json'
        break
      case Constants.public.ENC_TYPE_FORM:
        formType = 'form'
        break
      default:
        // keep all callbacks async
        setTimeout(() => {
          cb(new Error('Invalid enctype given: ' + options.enctype))
        }, 0)
    }

    if (formType) {
      superagent
        .post(url)
        .type(formType)
        .send(formData)
        .timeout(options.timeout)
        .end(function (err, res) {
          err = packError(err, res)

          if (err) {
            cb(err)
          } else {
            cb(null, res)
          }
        })
    }
  }
}
