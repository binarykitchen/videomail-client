var superagent = require('superagent')

// this is not finished yet ...

module.exports = function() {

    var cache = {}

    function fetch(identifier, options, cb) {
        superagent
            .get('/videomail/' + identifier + '/snapshot')
            .set('Accept', 'application/json')
            .timeout(options.timeout)
            .end(function(err, res) {

                if (!err && res.error) {
                    err = res.error

                    // use the server generated text instead of the superagent's default text

                    if (res.body && res.body.message)
                        err.message = res.body.message

                    else if (res.text)
                        err.message = res.text
                }

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

    this.get = function(identifier, options, cb) {
        if (options.cache && cache[identifier])
            cb(null, cache[identifier])
        else
            fetch(identifier, options, cb)
    }

    this.post = function(videomail, options, cb) {
        superagent
            .post(options.baseUrl + '/videomail/')
            .send(videomail)
            .timeout(options.timeout)
            // .set('X-API-Key', 'foobar') for later
            .end(function(err, data) {
                if (err)
                    cb(err)
                else {
                    if (options.cache)
                        cache[videomail.alias] = data.body.videomail

                    cb(null, data.body)
                }
            })
    }
}
