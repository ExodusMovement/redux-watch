var test = require('ava')
var redux = require('redux')
var reselect = require('reselect')
var watch = require('./')
var createStore = redux.createStore
var createSelector = reselect.createSelector

// ava, this is lame
test = test.cb

function setup ({ initial, reducerUpdate }) {
  let app = (state = initial, { type, payload }) => {
    if (type === 'UPDATE') return reducerUpdate(state, payload)
    else return state
  }
  let store = createStore(app)
  store.update = (payload) => store.dispatch({ type: 'UPDATE', payload })
  return store
}

test('simple path observer', function (t) {
  let store = setup({
    initial: { person: { name: 'jp' } },
    reducerUpdate: (state, payload) => ({ person: { name: payload } })
  })

  let w = watch(() => store.getState(), ['person', 'name'])

  store.subscribe(w((newVal, oldVal) => {
    t.is(newVal, 'joe')
    t.is(oldVal, 'jp')
    t.end()
  }))

  store.update('joe')
})

test('simple observer w/selector', function (t) {
  let store = setup({
    initial: { person: { name: 'jp' } },
    reducerUpdate: (state, payload) => ({ person: { name: payload } })
  })

  let selector = createSelector(
    state => state.person.name,
    (name) => name.toUpperCase()
  )

  let w = watch(() => selector(store.getState()))

  store.subscribe(w((newVal, oldVal) => {
    t.is(newVal, 'JOE')
    t.is(oldVal, 'JP')
    t.end()
  }))

  store.update('joe')
})

test('array observer (updated)', function (t) {
  let store = setup({
    initial: { accounts: [{ name: 'jp' }, { name: 'joe' }] },
    reducerUpdate: (state, payload) => ({ accounts: [payload] })

  })

  let w = watch(() => store.getState(), 'accounts.0.name')

  store.subscribe(w((newVal, oldVal) => {
    t.same(newVal, 'steve')
    t.same(oldVal, 'jp')
    t.end()
  }))

  store.update({name: 'steve'})
})

test('array observer (concatted)', function (t) {
  let store = setup({
    initial: { accounts: [{ name: 'jp' }, { name: 'joe' }] },
    reducerUpdate: (state, payload) => ({ accounts: [...state.accounts, payload] })

  })

  let w = watch(() => store.getState(), 'accounts.length')

  store.subscribe(w((newVal, oldVal) => {
    t.same(newVal, 3)
    t.same(oldVal, 2)
    t.end()
  }))

  store.update({name: 'steve'})
})
