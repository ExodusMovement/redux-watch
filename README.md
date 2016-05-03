# redux-watch

[![NPM Package](https://img.shields.io/npm/v/redux-watch.svg?style=flat-square)](https://www.npmjs.org/package/redux-watch)
[![Build Status](https://img.shields.io/travis/jprichardson/redux-watch.svg?branch=master&style=flat-square)](https://travis-ci.org/jprichardson/redux-watch)

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

Watch/observe [Redux](http://redux.js.org/) store state changes.

## Why?

Redux provides you with a `subscribe()` method so that you can be notified when the state changes. However, it does not let you know what changed. `redux-watch` will let you know what changed.


## Install

```
npm i --save redux-watch
```

## Usage

`watch(getState [, objectPath [, comparison]])` -> `function`

- `getState`: A `function` that is used to return the state. Also useful in conjunction with selectors.
- `objectPath`: An **optional** `string` or `Array` that represents the path in an object. Uses [object-path](https://www.npmjs.com/package/object-path) ([mariocasciaro/object-path](https://github.com/mariocasciaro/object-path)) for value extraction.
- `comparison`: An **optional** function to pass for comparison of the fields. Defaults to strict equal comparison (`===`).

## Example

##### basic example

```js
// ... other imports/requires
import watch from 'redux-watch'

// assuming you have an admin reducer / state slice
console.log(store.getState().admin.name) // 'JP'

// store is THE redux store
let w = watch(store.getState, 'admin.name')
store.subscribe(w((newVal, oldVal, objectPath) => {
  console.log('%s changed from %s to %s', objectPath, oldVal, newVal)
  // admin.name changed from JP to JOE
}))

// somewhere else, admin reducer handles ADMIN_UPDATE
store.dispatch({ type: 'ADMIN_UPDATE', payload: { name: 'JOE' }})
```

##### example (w/ [reselect](https://www.npmjs.com/package/reselect) ([reactjs/reselect](https://github.com/reactjs/reselect)) selectors)

When using with selectors, you often times won't need to pass the object path. Most times the selectors will handle this for you.

```js
// ... other imports requires
import watch from 'redux-watch'

// assuming mySelector is a reselect selector defined somewhere
let w = watch(() => mySelector(store.getState()))
store.subscribe(w((newVal, oldVal) => {
  console.log(newval)
  console.log(oldVal)
}))
```

#### Note on Comparisons.

By default, `redux-watch` uses `===` (strict equal) operator to check for changes. This may not be want you want. Sometimes you may want to do a deep inspection. You should use either [deep-equal](https://www.npmjs.com/package/deep-equal) ([substack/node-deep-equal](https://github.com/substack/node-deep-equal)) or [is-equal](https://www.npmjs.com/package/is-equal) ([ljharb/is-equal](https://github.com/ljharb/is-equal)). `is-equal` is better since it supports ES6 types like Maps/Sets.

##### deep equal example

```js
import isEqual from 'is-equal'
import watch from 'redux-watch'

let w = watch(store.getState, 'admin', isEqual)
store.subscribe(w((newVal, oldVal, objectPath) => {
  // response to changes
}))
```

## License

MIT

Copyright (c) [JP Richardson](https://github.com/jprichardson)
