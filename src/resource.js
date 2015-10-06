var superagent = require('superagent'),
    Constants  = require('./constants'),
    CACHE_KEY  = 'alias'

module.exports = function(options) {

    var cache = {}

    function packError(err, res) {
        if (res && res.body && res.body.error) {
            // use the server generated text instead of the superagent's default text
            err = res.body.error

            if (!err.message && res.text)
                err.message = res.text
        }

        return err
    }

    function fetch(alias, cb) {
        superagent
            .get('/videomail/' + alias + '/snapshot')
            .set('Accept', 'application/json')
            .set(Constants.SITE_NAME_LABEL, options.siteName)
            .timeout(options.timeouts.connection)
            .end(function(err, res) {

                err = packError(err, res)

                if (err)
                    cb(err)
                else {
                    var videomail = res.body

                    if (options.cache)
                        cache[CACHE_KEY] = videomail

                    cb(null, videomail)
                }
            })
    }

    function write(method, videomail, identifier, cb) {

        if (!cb) {
            cb = identifier
            identifier = null
        }

        var url         = options.baseUrl + '/videomail/',
            queryParams = {},

            request

        if (identifier)
            url += identifier

        request = superagent(method, url)

        queryParams[Constants.SITE_NAME_LABEL] = options.siteName

        request
            .query(queryParams)
            .send(videomail)
            .timeout(options.timeout)
            .end(function(err, res) {

                err = packError(err, res)

                if (err)
                    cb(err)
                else {
                    if (options.cache && videomail[CACHE_KEY])
                        cache[videomail[CACHE_KEY]] = res.body.videomail

                    cb(null, res.body.videomail, res.body)
                }
            })
    }

    this.get = function(alias, cb) {
        if (options.cache && cache[alias])
            cb(null, cache[alias])
        else
            fetch(alias, cb)
    }

    this.post = function(videomail, cb) {
        write('post', videomail, cb)
    }

    this.put = function(videomail, cb) {
        write('put', videomail, videomail.key, cb)
    }

    this.form = function(formData, url, cb) {

        var formType

        switch (options.enctype) {
            case Constants.public.ENC_TYPE_APP_JSON:
                formType = 'json'
                break
            case Constants.public.ENC_TYPE_FORM:
                formType = 'form'
                break
            default:
                cb(new Error('Invalid enctype given: ' + options.enctype))
        }

        if (formType) {
            superagent
                .post(url)
                .type(formType)
                .send(formData)
                .timeout(options.timeout)
                .end(function(err, res) {

                    err = packError(err, res)

                    if (err)
                        cb(err)
                    else {
                        cb(null, res)
                    }
                })
        }
    }
}
