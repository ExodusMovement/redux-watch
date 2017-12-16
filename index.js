'use strict'
var dlv = require('dlv')

function defaultCompare (a, b) {
  return a === b
}

function getValue (state, objectPath) {
  return objectPath ? dlv(state, objectPath) : state
}

function watch (getState, objectPath, compare) {
  compare = compare || defaultCompare
  var currentValue = getValue(getState(), objectPath)
  return function w (fn) {
    return function () {
      var newValue = getValue(getState(), objectPath)
      if (!compare(currentValue, newValue)) {
        var oldValue = currentValue
        currentValue = newValue
        fn(newValue, oldValue, objectPath)
      }
    }
  }
}

module.exports = watch
