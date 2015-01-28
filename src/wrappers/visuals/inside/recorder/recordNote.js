module.exports = function(visuals) {

    var recordNoteElement

    this.build = function() {
        recordNoteElement = visuals.querySelector('.recordNote')

        if (!recordNoteElement) {
            recordNoteElement = document.createElement('p')
            recordNoteElement.classList.add('recordNote')

            this.hide()

            visuals.appendChild(recordNoteElement)
        } else
            this.hide()
    }

    this.stop = function() {
        this.hide()
        recordNoteElement.classList.remove('near')
        recordNoteElement.classList.remove('nigh')
    }

    this.setNear = function() {
        recordNoteElement.classList.add('near')
    }

    this.setNigh = function() {
        recordNoteElement.classList.add('nigh')
    }

    this.hide = function() {
        recordNoteElement.classList.add('hide')
    }

    this.show = function() {
        recordNoteElement.classList.remove('hide')
    }
}
