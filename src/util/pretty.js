var SEPARATOR = '<br/>- '

function arrayToString(array) {
    if (array.length > 0) {
        var lines = []

        array.forEach(function(element) {
            if (element.toString)
                lines.push(element.toString())
        })

        return SEPARATOR + lines.join(SEPARATOR)
    }
}

function objectToString(object) {
    var propertyNames = Object.getOwnPropertyNames(object)

    if (propertyNames.length > 0) {
        var lines = []

        propertyNames.forEach(function(name) {
            if (object[name].toString)
                lines.push(object[name].toString())
        })

        return SEPARATOR + lines.join(SEPARATOR)
    }
}

module.exports = function(anything) {
    if (typeof anything === 'string')
        return anything

    else if (Array.isArray(anything)) {
        return arrayToString(anything)

    } else if (typeof anything === 'object')
        return objectToString(anything)
}
