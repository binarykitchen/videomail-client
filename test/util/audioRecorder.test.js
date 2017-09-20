import test from 'tape-catch'

import AudioRecorder from './../../src/util/audioRecorder'

test('AudioRecorder:', function (t) {
  t.test('can be instantiated', function (tt) {
    tt.plan(1)

    tt.doesNotThrow(function () {
      return new AudioRecorder()
    })
  })
})
