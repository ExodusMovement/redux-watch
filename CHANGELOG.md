2020-20-21 / 1.2.0
------------------
- chore: update object-path `^0.9.2` to `^0.11.5`: [#15](https://github.com/ExodusMovement/redux-watch/pull/15) \
  Non-own properties are not reachable via `objectPath` argument now.

2016-05-03 / 1.1.1
------------------
- bug fix: infinite loop: [#4][#4]

2015-12-14 / 1.1.0
------------------
- pass `objectPath` to watch callback (access in `subscribe()`)

2015-12-14 / 1.0.0
------------------
- initial release

[#5]: https://github.com/jprichardson/redux-watch/issues/5    "Any unwatch feature?"
[#4]: https://github.com/jprichardson/redux-watch/pull/4      "call function after changing base value [enhancement]"
[#3]: https://github.com/jprichardson/redux-watch/issues/3    "Problem when subscriber dispatch action"
[#2]: https://github.com/jprichardson/redux-watch/issues/2    "Does not seem to work with Immutable.js"
[#1]: https://github.com/jprichardson/redux-watch/issues/1    "tx for a GREAT lib... if possible please add TypeScript support..."
