var DASH = '- '
var SEPARATOR = '<br/>' + DASH

function arrayToString (array) {
  if (array.length > 0) {
    var lines = []

    array.forEach(function (element) {
      if (element && element.toString) { lines.push(element.toString()) }
    })

    return DASH + lines.join(SEPARATOR)
  }
}

function objectToString (object) {
  var propertyNames = Object.getOwnPropertyNames(object)

  if (propertyNames.length > 0) {
    var lines = []

    propertyNames.forEach(function (name) {
      if (object[name] && object[name].toString) { lines.push(object[name].toString()) }
    })

    return DASH + lines.join(SEPARATOR)
  }
}

module.exports = function (anything) {
  if (anything === null) { return 'null' } else if (typeof anything === 'undefined') { return 'undefined' } else if (typeof anything === 'string') { return anything } else if (Array.isArray(anything)) { return arrayToString(anything) } else if (typeof anything === 'object') { return objectToString(anything) } else { return anything.toString() }
}
