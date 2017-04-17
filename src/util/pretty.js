var DASH = '- '
var SEPARATOR = '<br/>' + DASH

function arrayToString (array) {
  if (array.length > 0) {
    var lines = []

    array.forEach(function (element) {
      if (element && element.toString) {
        lines.push(element.toString())
      }
    })

    return DASH + lines.join(SEPARATOR)
  }
}

function objectToString (object, options) {
  var propertyNames = Object.getOwnPropertyNames(object)
  var excludes = (options && options.excludes) || null
  var sLines

  if (propertyNames.length > 0) {
    var lines = []
    var exclude = false

    propertyNames.forEach(function (name) {
      if (excludes) {
        exclude = excludes.indexOf(name) >= 0
      }

      if (!exclude && object[name] && object[name].toString) {
        lines.push(object[name].toString())
      }
    })
  }

  if (lines.length > 0) {
    sLines = DASH + lines.join(SEPARATOR)
  }

  return sLines
}

module.exports = function (anything, options) {
  if (anything === null) {
    return 'null'
  } else if (typeof anything === 'undefined') {
    return 'undefined'
  } else if (typeof anything === 'string') {
    return anything
  } else if (Array.isArray(anything)) {
    return arrayToString(anything)
  } else if (typeof anything === 'object') {
    return objectToString(anything, options)
  } else {
    return anything.toString()
  }
}
