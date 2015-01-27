module.exports = function(recorder) {

    var recordNote

    this.build = function() {
        recordNote = recorder.querySelector('.recordNote')

        if (!recordNote) {
            recordNote = document.createElement('p')
            recordNote.classList.add('recordNote')

            this.hide()

            recorder.appendChild(recordNote)
        } else
            this.hide()
    }

    this.hide = function() {
        recordNote.classList.add('hide')
    }

    this.show = function() {
        recordNote.classList.remove('hide')
    }
}
