var toBuffer = require('typedarray-to-buffer')

// todo: turn this into an npm module, but only when it's working

module.exports = function(float32Array) {

    // todo: change to MP3 to save lots of bytes but that's for the future
    // as there is no solution out there yet for manual mp3 encoding

    // inspired by:
    // http://blog.groupbuddies.com/posts/39-tutorial-html-audio-capture-streaming-to-node-js-no-browser-extensions

    if (float32Array.constructor !== Float32Array)
        throw new Error('The parameter is not a Float32Array')

    /*
        Raw WebAudio samples are in Float32Array's.
        If you choose to send them like this, you need to know that endianness does matter!
        Better convert them to 16 bit signed integers:
    */
    this.toBuffer = function() {

        var l       = float32Array.length,
            arr     = new Int16Array(l),
            amplify = 2 // see http://ffmpeg.gusari.org/viewtopic.php?f=26&t=2208&p=6404#p6404

        // this uses lots of CPU and should be optimized
        for (var i = 0; i < l; i++) {
            arr[i] = Math.max(-1, Math.min(1, amplify * float32Array[i])) * 0x7FFF
        }

        // TODO: audio samples seem to be a bit too fast compared to the video
        // Try signing and talking at the same time. You will see that sound preceeds audio

        // TODO: Also study PCM specs if these really have to be converted to 16 bit signed integers???

        return toBuffer(arr)
    }
}
