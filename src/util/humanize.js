import filesize from 'filesize'
import humanizeDuration from 'humanize-duration'

// todo get rid of this class and use those imports directly

export default {
  filesize: function (bytes, round) {
    return filesize(bytes, {
      round: round
    })
  },

  toTime: function (t) {
    return humanizeDuration(t)
  }
}
