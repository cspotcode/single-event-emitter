'use strict';

/**
 * Representation of a single event listener.
 *
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
 * @constructor
 * @private
 */
function EE(fn, context, once) {
  this.fn = fn;
  this.context = context;
  this.once = once || false;
}

/**
 * Add a listener for a given event.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} once Specify if the listener is a one-time listener.
 * @returns {EventEmitter}
 * @private
 */
function addListener(emitter, fn, context, once) {
  if (typeof fn !== 'function') {
    throw new TypeError('The listener must be a function');
  }

  var listener = new EE(fn, context || emitter, once)

  if (!emitter._event) emitter._event = listener;
  else if (!emitter._event.fn) emitter._event.push(listener);
  else emitter._event = [emitter._event, listener];

  return emitter;
}

/**
 * Clear event by name.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @private
 */
function clearEvent(emitter) {
  emitter._event = undefined;
}

/**
 * Minimal `EventEmitter` interface that is molded against the Node.js
 * `EventEmitter` interface.
 *
 * @constructor
 * @public
 */
function EventEmitter() {
  this._event = undefined;
}

/**
 * Return the listeners registered for a given event.
 *
 * @returns {Array} The registered listeners.
 * @public
 */
EventEmitter.prototype.listeners = function listeners() {
  var handlers = this._event;

  if (!handlers) return [];
  if (handlers.fn) return [handlers.fn];

  for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
    ee[i] = handlers[i].fn;
  }

  return ee;
};

/**
 * Return the number of listeners listening to a given event.
 *
 * @returns {Number} The number of listeners.
 * @public
 */
EventEmitter.prototype.listenerCount = function listenerCount() {
  var listeners = this._event;

  if (!listeners) return 0;
  if (listeners.fn) return 1;
  return listeners.length;
};

/**
 * Calls each of the listeners registered for a given event.
 *
 * @returns {Boolean} `true` if the event had listeners, else `false`.
 * @public
 */
EventEmitter.prototype.emit = function emit(a1, a2, a3, a4, a5) {
  if (!this._event) return false;

  var listeners = this._event
    , len = arguments.length
    , i;

  if (listeners.fn) {
    if (listeners.once) this.removeListener(listeners.fn, undefined, true);

    switch (len) {
      case 0: return listeners.fn.call(listeners.context), true;
      case 1: return listeners.fn.call(listeners.context, a1), true;
      case 2: return listeners.fn.call(listeners.context, a1, a2), true;
      case 3: return listeners.fn.call(listeners.context, a1, a2, a3), true;
      case 4: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
      case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
    }

    listeners.fn.apply(listeners.context, arguments);
  } else {
    var length = listeners.length;

    for (i = 0; i < length; i++) {
      if (listeners[i].once) this.removeListener(listeners[i].fn, undefined, true);

      switch (len) {
        case 0: listeners[i].fn.call(listeners[i].context); break;
        case 1: listeners[i].fn.call(listeners[i].context, a1); break;
        case 2: listeners[i].fn.call(listeners[i].context, a1, a2); break;
        case 3: listeners[i].fn.call(listeners[i].context, a1, a2, a3); break;
        default:
          listeners[i].fn.apply(listeners[i].context, arguments);
      }
    }
  }

  return true;
};

/**
 * Add a listener for a given event.
 *
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.on = function on(fn, context) {
  return addListener(this, fn, context, false);
};

/**
 * Add a one-time listener for a given event.
 *
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.once = function once(fn, context) {
  return addListener(this, fn, context, true);
};

/**
 * Remove the listeners of a given event.
 *
 * @param {Function} fn Only remove the listeners that match this function.
 * @param {*} context Only remove the listeners that have this context.
 * @param {Boolean} once Only remove one-time listeners.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.removeListener = function removeListener(fn, context, once) {
  if (!this._event) return this;
  if (!fn) {
    clearEvent(this);
    return this;
  }

  var listeners = this._event;

  if (listeners.fn) {
    if (
      listeners.fn === fn &&
      (!once || listeners.once) &&
      (!context || listeners.context === context)
    ) {
      clearEvent(this);
    }
  } else {
    for (var i = 0, events = [], length = listeners.length; i < length; i++) {
      if (
        listeners[i].fn !== fn ||
        (once && !listeners[i].once) ||
        (context && listeners[i].context !== context)
      ) {
        events.push(listeners[i]);
      }
    }

    //
    // Reset the array, or remove it completely if we have no more listeners.
    //
    if (events.length) this._event = events.length === 1 ? events[0] : events;
    else clearEvent(this);
  }

  return this;
};

/**
 * Remove all listeners, or those of the specified event.
 *
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.removeAllListeners = function removeAllListeners() {
  this._event = undefined;

  return this;
};

//
// Alias methods names because people roll like that.
//
EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
EventEmitter.prototype.addListener = EventEmitter.prototype.on;

//
// Allow `EventEmitter` to be imported as module namespace.
//
EventEmitter.EventEmitter = EventEmitter;

//
// Expose the module.
//
if ('undefined' !== typeof module) {
  module.exports = EventEmitter;
}
