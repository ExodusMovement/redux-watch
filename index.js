var getValue = require('object-path').get

function defaultCompare (a, b) {
  return a === b
}

function watch (getState, objectPath, compare) {
  compare = compare || defaultCompare
  var baseVal = getValue(getState(), objectPath)
  return function w (fn) {
    return function () {
      var newVal = getValue(getState(), objectPath)
      if (compare(baseVal, newVal)) return
      fn(newVal, baseVal)
      baseVal = newVal
    }
  }
}

module.exports = watch
