# single-event-emitter

[![Version npm](https://img.shields.io/npm/v/single-event-emitter.svg?style=flat-square)](https://www.npmjs.com/package/single-event-emitter)
[![Build Status](https://img.shields.io/travis/cspotcode/single-event-emitter/master.svg?style=flat-square)](https://travis-ci.org/cspotcode/single-event-emitter)
[![Dependencies](https://img.shields.io/david/cspotcode/single-event-emitter.svg?style=flat-square)](https://david-dm.org/cspotcode/single-event-emitter)
[![Coverage Status](https://img.shields.io/coveralls/cspotcode/single-event-emitter/master.svg?style=flat-square)](https://coveralls.io/r/cspotcode/single-event-emitter?branch=master)

single-event-emitter is a fork of [EventEmitter3](https://github.com/primus/eventemitter3), with one difference: you create a single emitter for each event.
This is the pattern used in C# events & delegates, and it's very similar to RxJS multicast observables.
It's easier to setup and use with typechecked APIs.  It plays nice with composition, since each event is an object
that you can pass a reference to.

```typescript
class MyFoo {
  onClick = new EventEmitter();
  onDispose = new EventEmitter();
  onFoo = new EventEmitter();
  onBar = new EventEmitter();
}
const t = new MyFoo();
t.onClick.once(() => {/* event handler */});
t.onClick.emit();
```

The EventEmitter3 README is below, mostly unmodified.  I might update it to fully match this project's API, but probably not.
The API differences are pretty obvious: If an eventemitter would ask for an event name, this API doesn't.  Each emitter emits a
single event; no event names required.  Parts of the API that e.g. return a list of all event names have obviously been removed.

TypeScript declarations are included; use them if you're confused.

---

EventEmitter3 is a high performance EventEmitter. It has been micro-optimized
for various of code paths making this, one of, if not the fastest EventEmitter
available for Node.js and browsers. The module is API compatible with the
EventEmitter that ships by default with Node.js but there are some slight
differences:

- Domain support has been removed.
- We do not `throw` an error when you emit an `error` event and nobody is
  listening.
- The `newListener` and `removeListener` events have been removed as they
  are useful only in some uncommon use-cases.
- The `setMaxListeners`, `getMaxListeners`, `prependListener` and
  `prependOnceListener` methods are not available.
- Support for custom context for events so there is no need to use `fn.bind`.
- The `removeListener` method removes all matching listeners, not only the
  first.

It's a drop in replacement for existing EventEmitters, but just faster. Free
performance, who wouldn't want that? The EventEmitter is written in EcmaScript 3
so it will work in the oldest browsers and node versions that you need to
support.

## Installation

```bash
$ npm install --save single-event-emitter
```

## CDN

Recommended CDN:

```text
https://unpkg.com/single-event-emitter@latest/umd/single-event-emitter.min.js
```

## Usage

After installation the only thing you need to do is require the module:

```js
var EventEmitter = require('single-event-emitter');
```

And you're ready to create your own EventEmitter instances. For the API
documentation, please follow the official Node.js documentation:

http://nodejs.org/api/events.html

### Contextual emits

We've upgraded the API of the `EventEmitter.on`, `EventEmitter.once` and
`EventEmitter.removeListener` to accept an extra argument which is the `context`
or `this` value that should be set for the emitted events. This means you no
longer have the overhead of an event that required `fn.bind` in order to get a
custom `this` value.

```js
var EE = new EventEmitter()
  , context = { foo: 'bar' };

function emitted() {
  console.log(this === context); // true
}

EE.once(emitted, context);
EE.removeListener(emitted, context);
```

### Tests and benchmarks

This module is well tested. You can run:

- `npm test` to run the tests under Node.js.
- `npm run test-browser` to run the tests in real browsers via Sauce Labs.

We also have a set of benchmarks to compare EventEmitter3 with some available
alternatives. To run the benchmarks run `cd benchmarks ; npm install ; cd .. ; npm run benchmark`.

Tests and benchmarks are not included in the npm package. If you want to play
with them you have to clone the GitHub repository.

## License

[MIT](LICENSE)
