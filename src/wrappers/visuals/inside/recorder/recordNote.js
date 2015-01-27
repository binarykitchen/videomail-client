module.exports = function(visuals) {

    var recordNote

    this.build = function() {
        recordNote = visuals.querySelector('.recordNote')

        if (!recordNote) {
            recordNote = document.createElement('p')
            recordNote.classList.add('recordNote')

            this.hide()

            visuals.appendChild(recordNote)
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
