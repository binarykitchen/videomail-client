var util         = require('util'),
    EventEmitter = require('./../util/eventEmitter')

var Form = function(container, formElement, options) {

    this.validate = function() {
        return formElement.checkValidity()
    }

    function setDisabled(disabled) {
        var limit = formElement.elements.length

        for (var i = 0; i < limit; i++) {
            formElement.elements[i].disabled = disabled
        }
    }

    this.disable = function() {
        setDisabled(true)
    }

    this.enable = function() {
        setDisabled(false)
    }

    this.build = function(cb) {

        if (options.enableAutoValidation) {
            var textElements = formElement.querySelectorAll('input, textarea')

            for (var i = 0, len = textElements.length; i < len; i++) {
                textElements[i].addEventListener('input', function() {
                    container.validate()
                })
            }

            var selectElements = formElement.querySelectorAll('select')

            for (var i = 0, len = selectElements.length; i < len; i++) {
                selectElements[i].addEventListener('change', function() {
                    container.validate()
                })
            }
        }

        cb()
    }

    this.getSubmitButton = function() {
        return formElement.querySelector("[type='submit']")
    }
}

util.inherits(Form, EventEmitter)

module.exports = Form
