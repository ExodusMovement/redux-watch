var test = require('tape').test
var createStore = require('redux').createStore
var createSelector = require('reselect').createSelector
var watch = require('../')

function setup (initialState, reducerUpdate) {
  var store = createStore(function (state, action) {
    state = state || initialState
    switch (action.type) {
      case 'UPDATE': return reducerUpdate(state, action.payload)
      default: return state
    }
  })
  store.update = function (payload) {
    store.dispatch({ type: 'UPDATE', payload: payload })
  }
  return store
}

test('simple path observer', function (t) {
  var store = setup(
    { person: { name: 'jp' } },
    function (state, payload) {
      return { person: { name: payload } }
    }
  )

  var op = ['person', 'name']
  var w = watch(store.getState, op)

  store.subscribe(w(function (newValue, oldValue, objectPath) {
    t.same(newValue, 'joe')
    t.same(oldValue, 'jp')
    t.same(objectPath, op, 'object paths are the same')
    t.end()
  }))

  store.update('joe')
})

test('simple observer w/selector', function (t) {
  var store = setup(
    { person: { name: 'jp' } },
    function (state, payload) {
      return { person: { name: payload } }
    }
  )

  var selector = createSelector(
    function (state) { return state.person.name },
    function (name) { return name.toUpperCase() }
  )

  var w = watch(function () { return selector(store.getState()) })

  store.subscribe(w(function (newValue, oldValue) {
    t.same(newValue, 'JOE')
    t.same(oldValue, 'JP')
    t.end()
  }))

  store.update('joe')
})

test('array observer (updated)', function (t) {
  var store = setup(
    { accounts: [{ name: 'jp' }, { name: 'joe' }] },
    function (state, payload) {
      return { accounts: payload }
    }
  )

  var w = watch(function () { return store.getState() }, 'accounts.0.name')

  store.subscribe(w(function (newValue, oldValue) {
    t.same(newValue, 'steve')
    t.same(oldValue, 'jp')
    t.end()
  }))

  store.update([{ name: 'steve' }])
})

test('array observer (concatted)', function (t) {
  var store = setup(
    { accounts: [{ name: 'jp' }, { name: 'joe' }] },
    function (state, payload) {
      return { accounts: state.accounts.concat(payload) }
    }
  )

  var w = watch(function () { return store.getState() }, 'accounts.length')

  store.subscribe(w(function (newValue, oldValue) {
    t.same(newValue, 3)
    t.same(oldValue, 2)
    t.end()
  }))

  store.update({ name: 'steve' })
})

test('prevent endless recursion', function (t) {
  var store = setup(
    { answer: null },
    function (state, payload) {
      return { answer: payload }
    }
  )

  var w = watch(store.getState, 'answer')

  t.plan(2)
  store.subscribe(w(function (newVal, oldVal) {
    store.update(42)
    t.same(newVal, 42)
    t.same(oldVal, null)
  }))

  store.update(42)
})
