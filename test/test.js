describe('EventEmitter', function tests() {
  'use strict';

  var EventEmitter = require('../')
    , _assume = require('assume');

  /** @type (v: any) => any */
  var assume = _assume;

  it('exposes a module namespace object', function() {
    assume(EventEmitter.EventEmitter).equals(EventEmitter);
  });

  it('inherits when used with `require("util").inherits`', function () {
    function Beast() {
      EventEmitter.call(this);
    }

    require('util').inherits(Beast, EventEmitter);

    var moop = new Beast()
      , meap = new Beast();

    assume(moop).is.instanceOf(Beast);
    assume(moop).is.instanceOf(EventEmitter);

    moop.listeners();
    meap.listeners();

    moop.on(function () {
      throw new Error('I should not emit');
    });

    meap.emit('rawr');
    meap.removeListener();
    meap.removeAllListeners();
  });

  if ('undefined' !== typeof Symbol) it('works with ES6 symbols', function (next) {
    var e = new EventEmitter()
      , eUnknown = new EventEmitter()
      , event = Symbol('cows')
      , unknown = Symbol('moo');

    e.on(function foo(arg) {
      assume(eUnknown.listenerCount()).equals(0);
      assume(eUnknown.listeners()).deep.equals([]);
      assume(arg).equals('bar');

      function bar(onced) {
        assume(eUnknown.listenerCount()).equals(0);
        assume(eUnknown.listeners()).deep.equals([]);
        assume(onced).equals('foo');
        next();
      }

      eUnknown.once(bar);

      assume(e.listenerCount()).equals(1);
      assume(e.listeners()).deep.equals([foo]);
      assume(eUnknown.listenerCount()).equals(1);
      assume(eUnknown.listeners()).deep.equals([bar]);

      e.removeListener();

      assume(e.listenerCount()).equals(0);
      assume(e.listeners()).deep.equals([]);
      assume(eUnknown.emit('foo')).equals(true);
    });

    assume(eUnknown.emit('bar')).equals(false);
    assume(e.emit('bar')).equals(true);
  });

  describe('EventEmitter#emit', function () {
    it('should return false when there are not events to emit', function () {
      var e = new EventEmitter();

      assume(e.emit()).equals(false);
      assume(e.emit()).equals(false);
    });

    it('emits with context', function (done) {
      var context = { bar: 'baz' }
        , e = new EventEmitter();

      e.on(function (bar) {
        assume(bar).equals('bar');
        assume(this).equals(context);

        done();
      }, context).emit('bar');
    });

    it('emits with context, multiple arguments (force apply)', function (done) {
      var context = { bar: 'baz' }
        , e = new EventEmitter();

      e.on(function (bar) {
        assume(bar).equals('bar');
        assume(this).equals(context);

        done();
      }, context).emit('bar', 1, 2, 3, 4, 5, 6, 7, 8, 9, 0);
    });

    it('can emit the function with multiple arguments', function () {
      var e = new EventEmitter();

      for (var i = 0; i < 100; i++) {
        (function (j) {
          for (var i = 0, args = []; i < j; i++) {
            args.push(j);
          }

          e.once(function () {
            assume(arguments.length).equals(args.length);
          });

          e.emit.apply(e, [].concat(args));
        })(i);
      }
    });

    it('can emit the function with multiple arguments, multiple listeners', function () {
      var e = new EventEmitter();

      for (var i = 0; i < 100; i++) {
        (function (j) {
          for (var i = 0, args = []; i < j; i++) {
            args.push(j);
          }

          e.once(function () {
            assume(arguments.length).equals(args.length);
          });

          e.once(function () {
            assume(arguments.length).equals(args.length);
          });

          e.once(function () {
            assume(arguments.length).equals(args.length);
          });

          e.once(function () {
            assume(arguments.length).equals(args.length);
          });

          e.emit.apply(e, [].concat(args));
        })(i);
      }
    });

    it('emits with context, multiple listeners (force loop)', function () {
      var e = new EventEmitter();

      e.on(function (bar) {
        assume(this).eqls({ foo: 'bar' });
        assume(bar).equals('bar');
      }, { foo: 'bar' });

      e.on(function (bar) {
        assume(this).eqls({ bar: 'baz' });
        assume(bar).equals('bar');
      }, { bar: 'baz' });

      e.emit('bar');
    });

    it('emits with different contexts', function () {
      var e = new EventEmitter()
        , pattern = '';

      function writer() {
        pattern += this;
      }

      e.on(writer, 'foo');
      e.on(writer, 'baz');
      e.once(writer, 'bar');
      e.once(writer, 'banana');

      e.emit();
      assume(pattern).equals('foobazbarbanana');
    });

    it('should return true when there are events to emit', function () {
      var eFoo = new EventEmitter()
        , eFoob = new EventEmitter()
        , called = 0;

      eFoo.on(function () {
        called++;
      });

      assume(eFoo.emit()).equals(true);
      assume(eFoob.emit()).equals(false);
      assume(called).equals(1);
    });

    it('receives the emitted events', function (done) {
      var e = new EventEmitter();

      e.on(function (a, b, c, d, undef) {
        assume(a).equals('foo');
        assume(b).equals(e);
        assume(c).is.instanceOf(Date);
        assume(undef).equals(undefined);
        assume(arguments.length).equals(3);

        done();
      });

      e.emit('foo', e, new Date());
    });

    it('emits to all event listeners', function () {
      var e = new EventEmitter()
        , pattern = [];

      e.on(function () {
        pattern.push('foo1');
      });

      e.on(function () {
        pattern.push('foo2');
      });

      e.emit();

      assume(pattern.join(';')).equals('foo1;foo2');
    });

    [
      'hasOwnProperty',
      'constructor',
      '__proto__',
      'toString',
      'toValue',
      'unwatch',
      'watch'
    ].forEach(function(key) {
      it('can store event which is a known property: '+ key, function (done) {
        var e = new EventEmitter();

        e.on(function (k) {
          assume(k).equals(key);
          done();
        }).emit(key);
      });
    });
  });

  describe('EventEmitter#listeners', function () {
    it('returns an empty array if no listeners are specified', function () {
      var e = new EventEmitter();

      assume(e.listeners()).is.a('array');
      assume(e.listeners().length).equals(0);
    });

    it('returns an array of function', function () {
      var e = new EventEmitter();

      function foo() {}

      e.on(foo);
      assume(e.listeners()).is.a('array');
      assume(e.listeners().length).equals(1);
      assume(e.listeners()).deep.equals([foo]);
    });

    it('is not vulnerable to modifications', function () {
      var e = new EventEmitter();

      function foo() {}

      e.on(foo);

      assume(e.listeners()).deep.equals([foo]);

      e.listeners().length = 0;
      assume(e.listeners()).deep.equals([foo]);
    });
  });

  describe('EventEmitter#listenerCount', function () {
    it('returns the number of listeners for a given event', function () {
      var e = new EventEmitter();

      assume(e.listenerCount()).equals(0);

      e.on(function () {});
      assume(e.listenerCount()).equals(1);
      e.on(function () {});
      assume(e.listenerCount()).equals(2);
    });
  });

  describe('EventEmitter#on', function () {
    it('throws an error if the listener is not a function', function () {
      var e = new EventEmitter();

      try {
        e.on('bar');
      } catch (ex) {
        assume(ex).is.instanceOf(TypeError);
        assume(ex.message).equals('The listener must be a function');
        return;
      }

      throw new Error('oops');
    });
  });

  describe('EventEmitter#once', function () {
    it('only emits it once', function () {
      var e = new EventEmitter()
        , calls = 0;

      e.once(function () {
        calls++;
      });

      e.emit('foo');
      e.emit('foo');
      e.emit('foo');
      e.emit('foo');
      e.emit('foo');

      assume(e.listeners().length).equals(0);
      assume(calls).equals(1);
    });

    it('only emits once if emits are nested inside the listener', function () {
      var e = new EventEmitter()
        , calls = 0;

      e.once(function () {
        calls++;
        e.emit('foo');
      });

      e.emit();
      assume(e.listeners().length).equals(0);
      assume(calls).equals(1);
    });

    it('only emits once for multiple events', function () {
      var e = new EventEmitter()
        , multi = 0
        , foo = 0
        , bar = 0;

      e.once(function () {
        foo++;
      });

      e.once(function () {
        bar++;
      });

      e.on(function () {
        multi++;
      });

      e.emit();
      e.emit();
      e.emit();
      e.emit();
      e.emit();

      assume(e.listeners().length).equals(1);
      assume(multi).equals(5);
      assume(foo).equals(1);
      assume(bar).equals(1);
    });

    it('only emits once with context', function (done) {
      var context = { foo: 'bar' }
        , e = new EventEmitter();

      e.once(function (bar) {
        assume(this).equals(context);
        assume(bar).equals('bar');

        done();
      }, context).emit('bar');
    });
  });

  describe('EventEmitter#removeListener', function () {
    it('removes all listeners when the listener is not specified', function () {
      var e = new EventEmitter();

      e.on(function () {});
      e.on(function () {});

      assume(e.removeListener()).equals(e);
      assume(e.listeners()).eql([]);
    });

    it('removes only the listeners matching the specified listener', function () {
      var eFoo = new EventEmitter();
      var eBar = new EventEmitter();

      function foo() {}
      function bar() {}
      function baz() {}

      eFoo.on(foo);
      eBar.on(bar);
      eBar.on(baz);

      assume(eFoo.removeListener(bar)).equals(eFoo);
      assume(eBar.listeners()).eql([bar, baz]);
      assume(eFoo.listeners()).eql([foo]);

      assume(eFoo.removeListener(foo)).equals(eFoo);
      assume(eBar.listeners()).eql([bar, baz]);
      assume(eFoo.listeners()).eql([]);

      assume(eBar.removeListener(bar)).equals(eBar);
      assume(eBar.listeners()).eql([baz]);

      assume(eBar.removeListener(baz)).equals(eBar);
      assume(eBar.listeners()).eql([]);

      eFoo.on(foo);
      eFoo.on(foo);
      eBar.on(bar);

      assume(eFoo.removeListener(foo)).equals(eFoo);
      assume(eBar.listeners()).eql([bar]);
      assume(eFoo.listeners()).eql([]);
    });

    it('removes only the once listeners when using the once flag', function () {
      var e = new EventEmitter();

      function foo() {}

      e.on(foo);

      assume(e.removeListener(function () {}, undefined, true)).equals(e);
      assume(e.listeners()).eql([foo]);

      assume(e.removeListener(foo, undefined, true)).equals(e);
      assume(e.listeners()).eql([foo]);

      assume(e.removeListener(foo)).equals(e);
      assume(e.listeners()).eql([]);

      e.once(foo);
      e.on(foo);

      assume(e.removeListener(function () {}, undefined, true)).equals(e);
      assume(e.listeners()).eql([foo, foo]);

      assume(e.removeListener(foo, undefined, true)).equals(e);
      assume(e.listeners()).eql([foo]);

      e.once(foo);

      assume(e.removeListener(foo)).equals(e);
      assume(e.listeners()).eql([]);
    });

    it('removes only the listeners matching the correct context', function () {
      var context = { foo: 'bar' }
        , e = new EventEmitter();

      function foo() {}
      function bar() {}

      e.on(foo, context);

      assume(e.removeListener(function () {}, context)).equals(e);
      assume(e.listeners()).eql([foo]);

      assume(e.removeListener(foo, { baz: 'quux' })).equals(e);
      assume(e.listeners()).eql([foo]);

      assume(e.removeListener(foo, context)).equals(e);
      assume(e.listeners()).eql([]);

      e.on(foo, context);
      e.on(bar);

      assume(e.removeListener(foo, { baz: 'quux' })).equals(e);
      assume(e.listeners()).eql([foo, bar]);

      assume(e.removeListener(foo, context)).equals(e);
      assume(e.listeners()).eql([bar]);

      e.on(bar, context);

      assume(e.removeListener(bar)).equals(e);
      assume(e.listeners()).eql([]);
    });
  });

  describe('EventEmitter#removeAllListeners', function () {
    it('removes all events for the specified events', function () {
      var e = new EventEmitter();
      var eBar = new EventEmitter();
      var eAaa = new EventEmitter();

      e.on(function () { throw new Error('oops'); });
      e.on(function () { throw new Error('oops'); });
      eBar.on(function () { throw new Error('oops'); });
      eAaa.on(function () { throw new Error('oops'); });

      assume(e.removeAllListeners()).equals(e);
      assume(e.listeners().length).equals(0);
      assume(eBar.listeners().length).equals(1);
      assume(eAaa.listeners().length).equals(1);

      assume(eBar.removeAllListeners()).equals(eBar);
      assume(eAaa.removeAllListeners()).equals(eAaa);

      assume(e.emit()).equals(false);
      assume(eBar.emit()).equals(false);
      assume(eAaa.emit()).equals(false);
    });

    it('removes every single listener from emitter', function () {
      var e = new EventEmitter();

      e.on(function () { throw new Error('oops'); });
      e.on(function () { throw new Error('oops'); });

      assume(e.removeAllListeners()).equals(e);
      assume(e.listeners().length).equals(0);

      assume(e.emit()).equals(false);
    });
  });
});
