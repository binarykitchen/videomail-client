module.exports = function(options) {

    var countdownElement = document.getElementById('countdown'),

        countdown,
        intervalId

    function fire(cb) {
        clearInterval(intervalId)

        countdownElement.classList.add('hide')

        cb()
    }

    this.start = function(cb) {
        countdown = options.video.countdown

        countdownElement.innerHTML = countdown
        countdownElement.classList.remove('hide')

        intervalId = setInterval(function() {
            countdown--

            if (countdown < 1)
                fire(cb)
            else
                countdownElement.innerHTML = countdown
        }, 1e3)
    }
}
