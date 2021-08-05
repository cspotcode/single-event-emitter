export {EventEmitter as default};

export type Listener<Params extends unknown[] = []> = (...params: Params) => void

/**
 * Minimal `EventEmitter` interface that is molded against the Node.js
 * `EventEmitter` interface.
 */
export class EventEmitter<Params extends unknown[] = []> {
  /**
   * Return the listeners registered.
   */
  listeners(): Array<Listener<Params>>;

  /**
   * Return the number of listeners listening.
   */
  listenerCount(): number;

  /**
   * Calls each of the listeners registered.
   */
  readonly emit: (...params: Params) => boolean;

  /**
   * Add a listener.
   */
  on(fn: Listener<Params>, context?: any): this;
  addListener(fn: Listener<Params>, context?: any): this;

  /**
   * Add a one-time listener.
   */
  once(fn: Listener<Params>, context?: any): this;

  /**
   * Remove the listeners.
   */
  removeListener(fn?: Listener<Params>, context?: any, once?: boolean): this;
  off(fn?: Listener<Params>, context?: any, once?: boolean): this;

  /**
   * Remove all listeners.
   */
  removeAllListeners(): this;
}

/**
 * Meant for users who want to expose only the listening API, not the emitting API, of an 
 * `EventEmitter`.
 */
export type Observable<Params extends unknown[] = []> = {
  [K in 'removeListener' | 'off' | 'once' | 'on' | 'addListener']: EventEmitter<Params>[K];
}

export as namespace SingleEventEmitter;
