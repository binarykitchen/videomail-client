var superagent = require('superagent'),

    Constants  = require('./constants')

module.exports = function(options) {

    var cache = {}

    function packError(err, res) {
        if (res.body && res.body.error) {
            // use the server generated text instead of the superagent's default text
            err = res.body.error

            if (!err.message)
                err.message = res.text
        }

        return err
    }

    function fetch(identifier, cb) {
        superagent
            .get('/videomail/' + identifier + '/snapshot')
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
                        cache[identifier] = videomail

                    cb(null, videomail)
                }
            })
    }

    this.get = function(identifier, cb) {
        if (options.cache && cache[identifier])
            cb(null, cache[identifier])
        else
            fetch(identifier, cb)
    }

    this.post = function(videomail, cb) {
        var queryParams = {}
        queryParams[Constants.SITE_NAME_LABEL] = options.siteName

        superagent
            .post(options.baseUrl + '/videomail/')
            .query(queryParams)
            .send(videomail)
            .timeout(options.timeout)
            .end(function(err, res) {

                err = packError(err, res)

                if (err)
                    cb(err)
                else {
                    if (options.cache)
                        cache[videomail.alias] = res.body.videomail

                    cb(null, res.body.videomail, res.body)
                }
            })
    }

    this.form = function(formData, url, cb) {

        var formType

        switch (options.enctype) {
            case 'application/json':
                formType = 'json'
                break
            case 'application/x-www-form-urlencoded':
                formType = 'form'
                break
            default:
                cb(new Error('Invalid enctype given: ' + options.enctype))
        }

        if (formType) {
            // avgFps is only for the videomail server
            delete formData.avgFps

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
                        cb(null, res.body)
                    }
                })
        }
    }
}
