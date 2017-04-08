var filesize = require('filesize')
var humanizeDuration = require('humanize-duration')

module.exports = {
  filesize: function (bytes, round) {
    return filesize(bytes, {
      round: round
    })
  },

  toTime: function (t) {
    return humanizeDuration(t)
  }
}
