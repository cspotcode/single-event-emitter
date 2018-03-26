/**
 * Minimal `EventEmitter` interface that is molded against the Node.js
 * `EventEmitter` interface.
 */
declare class EventEmitter<E extends EventEmitter.EmitSpec = [-1]> {
  /**
   * Return the listeners registered.
   */
  listeners(): Array<EventEmitter.ListenerFn<E>>;

  /**
   * Return the number of listeners listening.
   */
  listenerCount(): number;

  /**
   * Calls each of the listeners registered.
   */
  readonly emit: EventEmitter.EmitMethod<E>;

  /**
   * Add a listener.
   */
  on(fn: EventEmitter.ListenerFn<E>, context?: any): this;
  addListener(fn: EventEmitter.ListenerFn<E>, context?: any): this;

  /**
   * Add a one-time listener.
   */
  once(fn: EventEmitter.ListenerFn<E>, context?: any): this;

  /**
   * Remove the listeners.
   */
  removeListener(fn?: EventEmitter.ListenerFn<E>, context?: any, once?: boolean): this;
  off(fn?: EventEmitter.ListenerFn<E>, context?: any, once?: boolean): this;

  /**
   * Remove all listeners.
   */
  removeAllListeners(): this;

  static readonly EventEmitter: typeof EventEmitter;
}

declare namespace EventEmitter {
  export type ListenerFn<E extends EmitSpec = [-1]> = EmitSpecExtract<E>['Callback'];

  export type EmitMethod<E extends EmitSpec = [-1]> =
    EmitSpecExtract<E> extends {Count: infer Count, Arg1: infer A, Arg2: infer B, Arg3: infer C, Arg4: infer D, Rest: infer Rest, Callback: infer Callback}
    ? Count extends -1
    ? (...args: Rest[]) => boolean
    : Count extends 0
    ? () => boolean
    : Count extends 1
    ? (a: A) => boolean
    : Count extends 2
    ? (a: A, b: B) => boolean
    : Count extends 3
    ? (a: A, b: B, c: C) => boolean
    : Count extends 4
    ? (a: A, b: B, c: C, d: D) => boolean
    : never : never;

  export type EmitSpec =
    [0] |
    [0, () => void] |
    [0, () => void, any] |
    [1] |
    [1, (a: any) => void] |
    [1, (a: any) => void, any] |
    [2] |
    [2, (a: any, b: any) => void] |
    [2, (a: any, b: any) => void, any] |
    [3] |
    [3, (a: any, b: any, c: any) => void] |
    [3, (a: any, b: any, c: any) => void, any] |
    [4] |
    [4, (a: any, b: any, c: any, d: any) => void] |
    [4, (a: any, b: any, c: any, d: any) => void, any] |
    [-1] |
    [-1, (...args: any[]) => void] |
    [-1, (...args: any[]) => void, any];

  /**
   * Extract a bunch of types from a EmitSpec so that it's easier to derive other types.
   */
  export type EmitSpecExtract<E extends EmitSpec>
    = E extends [0]
    ? {Count: 0, Arg1: never, Arg2: never, Arg3: never, Arg4: never, Rest: never, Callback: () => void}

    : E extends [0, infer Callback]
    ? {Count: 0, Arg1: never, Arg2: never, Arg3: never, Arg4: never, Rest: never, Callback: Callback}

    : E extends [0, infer Callback, infer Context]
    ? {Count: 0, Arg1: never, Arg2: never, Arg3: never, Arg4: never, Rest: never, Callback: Callback}

    : E extends [1]
    ? {Count: 1, Arg1: any, Arg2: never, Arg3: never, Arg4: never, Rest: never, Callback: (a: any) => void}

    : E extends [1, infer Callback]
    ? (
      Callback extends (a: infer A) => void
      ? {Count: 1, Arg1: A, Arg2: never, Arg3: never, Arg4: never, Rest: never, Callback: Callback}
      : never
    )

    : E extends [1, infer Callback, infer Context]
    ? (
      Callback extends (a: infer A) => void
      ? {Count: 1, Arg1: A, Arg2: never, Arg3: never, Arg4: never, Rest: never, Callback: Callback}
      : never
    )

    : E extends [2]
    ? {Count: 2, Arg1: any, Arg2: any, Arg3: never, Arg4: never, Rest: never, Callback: (a: any, b: any) => void}

    : E extends [2, infer Callback]
    ? (
      Callback extends (a: infer A, b: infer B) => void
      ? {Count: 2, Arg1: A, Arg2: B, Arg3: never, Arg4: never, Rest: never, Callback: Callback}
      : never
    )

    : E extends [2, infer Callback, infer Context]
    ? (
      Callback extends (a: infer A, b: infer B) => void
      ? {Count: 2, Arg1: A, Arg2: B, Arg3: never, Arg4: never, Rest: never, Callback: Callback}
      : never
    )

    : E extends [3]
    ? {Count: 3, Arg1: any, Arg2: any, Arg3: any, Arg4: never, Rest: never, Callback: (a: any, b: any, c: any) => void}

    : E extends [3, infer Callback]
    ? (
      Callback extends (a: infer A, b: infer B, c: infer C) => void
      ? {Count: 3, Arg1: A, Arg2: B, Arg3: C, Arg4: never, Rest: never, Callback: Callback}
      : never
    )

    : E extends [3, infer Callback, infer Context]
    ? (
      Callback extends (a: infer A, b: infer B, c: infer C) => void
      ? {Count: 3, Arg1: A, Arg2: B, Arg3: C, Arg4: never, Rest: never, Callback: Callback}
      : never
    )

    : E extends [4]
    ? {Count: 4, Arg1: any, Arg2: any, Arg3: any, Arg4: any, Rest: never, Callback: (a: any, b: any, c: any, d: any) => void}

    : E extends [4, infer Callback]
    ? (
      Callback extends (a: infer A, b: infer B, c: infer C, d: infer D) => void
      ? {Count: 4, Arg1: A, Arg2: B, Arg3: C, Arg4: D, Rest: never, Callback: Callback}
      : never
    )

    : E extends [4, infer Callback, infer Context]
    ? (
      Callback extends (a: infer A, b: infer B, c: infer C, d: infer D) => void
      ? {Count: 4, Arg1: A, Arg2: B, Arg3: C, Arg4: D, Rest: never, Callback: Callback}
      : never
    )

    : E extends [-1]
    ? {Count: -1, Arg1: any, Arg2: any, Arg3: any, Arg4: any, Rest: any, Callback: (...args: any[]) => void}
    
    : E extends [-1, infer Callback]
    ? (
      Callback extends (...args: (infer Rest)[]) => void
      ? {Count: -1, Arg1: Rest, Arg2: Rest, Arg3: Rest, Arg4: Rest, Rest: Rest, Callback: Callback}
      : never
    )

    : E extends [-1, infer Callback, infer Context]
    ? (
      Callback extends (...args: (infer Rest)[]) => void
      ? {Count: -1, Arg1: Rest, Arg2: Rest, Arg3: Rest, Arg4: Rest, Rest: Rest, Callback: Callback}
      : never
    )
    // If all else fails, `any` defaults
    : {Count: -1, Arg1: any, Arg2: any, Arg3: any, Arg4: any, Rest: any, Callback: (...args: any[]) => void};
}

export = EventEmitter;
