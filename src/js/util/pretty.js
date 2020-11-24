import stringify from 'safe-json-stringify'

const DASH = '- '
const SEPARATOR = '<br/>' + DASH

function arrayToString(array) {
  if (array && array.length > 0) {
    const lines = []

    array.forEach(function (element) {
      if (element) {
        lines.push(stringify(element))
      }
    })

    return DASH + lines.join(SEPARATOR)
  }
}

function objectToString(object, options) {
  const propertyNames = Object.getOwnPropertyNames(object)
  const excludes = (options && options.excludes) || []
  const lines = []
  let sLines

  // always ignore these
  excludes.push('stack')

  if (propertyNames && propertyNames.length > 0) {
    let exclude = false

    propertyNames.forEach(function (name) {
      if (excludes) {
        exclude = excludes.indexOf(name) >= 0
      }

      if (!exclude && object[name]) {
        // this to cover this problem:
        // https://github.com/binarykitchen/videomail-client/issues/157
        lines.push(stringify(object[name]))
      }
    })
  }

  if (lines.length === 1) {
    sLines = lines.join()
  } else if (lines.length > 1) {
    sLines = DASH + lines.join(SEPARATOR)
  }

  return sLines
}

export default function (anything, options) {
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
  }

  return anything.toString()
}
