// credits https://gist.githubusercontent.com/jgornick/3786127/raw/86ef8cd4891b9b8f1853b1600c18efc4011f879c/gistfile1.js
module.exports = function (data) {
  data = (data && data.toString()) || ''
  data = data.replace('\n', '', 'g')

  var start = data.indexOf('{')
  var open = 0
  var i = start
  var len = data.length
  var result = []

  for (; i < len; i++) {
    if (data[i] === '{') {
      open++
    } else if (data[i] === '}') {
      open--
      if (open === 0) {
        result.push(JSON.parse(data.substring(start, i + 1)))
        start = i + 1
      }
    }
  }

  return result
}
