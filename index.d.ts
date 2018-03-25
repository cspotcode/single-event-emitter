/**
 * Minimal `EventEmitter` interface that is molded against the Node.js
 * `EventEmitter` interface.
 */
declare class EventEmitter {
  /**
   * Return the listeners registered.
   */
  listeners(): Array<EventEmitter.ListenerFn>;

  /**
   * Return the number of listeners listening.
   */
  listenerCount(): number;

  /**
   * Calls each of the listeners registered.
   */
  emit(...args: Array<any>): boolean;

  /**
   * Add a listener.
   */
  on(fn: EventEmitter.ListenerFn, context?: any): this;
  addListener(fn: EventEmitter.ListenerFn, context?: any): this;

  /**
   * Add a one-time listener.
   */
  once(fn: EventEmitter.ListenerFn, context?: any): this;

  /**
   * Remove the listeners.
   */
  removeListener(fn?: EventEmitter.ListenerFn, context?: any, once?: boolean): this;
  off(fn?: EventEmitter.ListenerFn, context?: any, once?: boolean): this;

  /**
   * Remove all listeners.
   */
  removeAllListeners(): this;
}

declare namespace EventEmitter {
  export interface ListenerFn {
    (...args: Array<any>): void;
  }

  export interface EventEmitterStatic {
    new(): EventEmitter;
  }

  export const EventEmitter: EventEmitterStatic;
}

export = EventEmitter;
