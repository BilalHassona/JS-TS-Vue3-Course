/**
 * Exercises – Part 12: Proxies and the observer pattern
 * (concepts 12.1–12.2 in JS-TS-Concepts.md)
 *
 * How to work through this file:
 *   1. Solve the exercises from top to bottom. Each one explains what to write; look for "TODO".
 *   2. Run the file to see which checks pass. Node.js 22.18 or newer runs TypeScript directly:
 *        node exercises-part-12.ts
 *      (On an older Node.js version, use: npx tsx exercises-part-12.ts)
 *   3. Check your types too. Your editor underlines type errors in red, using the settings in
 *      tsconfig.json (in this folder). To check just this file in the terminal, run:
 *        npx -p typescript tsc --ignoreConfig --noEmit exercises-part-12.ts
 *      Type errors in exercises you haven't solved yet are normal. Some exercises are about
 *      fixing exactly those errors.
 *   4. You're done when every check shows ✅ and the type check reports no errors.
 *
 * Stuck? Compare your code with exercises-part-12-solved.ts.
 */

'use strict'; // strict mode, also when you run this file with npx tsx (see Exercise 1b)

export {}; // makes this file a module, so its names don't clash with other exercise files

// ---------------------------------------------------------------------------
// Exercise 1: Proxy and Reflect (concept 12.1)
// ---------------------------------------------------------------------------
// A Proxy wraps another object, its target. Each operation on the proxy goes to a "trap" in the
// handler, if the handler has one: get for reading a property, set for writing one, has for
// `in`, deleteProperty for `delete`, and a few more. Operations without a trap go straight to
// the target.
//   const proxy = new Proxy(target, {
//     get(target, property, receiver) { ... }, // proxy.name or proxy['name']
//     set(target, property, value, receiver) { ... }, // proxy.name = value
//   });
// Inside a trap, Reflect does the normal operation, as if there were no proxy:
// Reflect.get(target, property, receiver) reads the property, and
// Reflect.set(target, property, value, receiver) writes it. Reflect has a function for every
// trap, with the same parameters.
//
// a) Implement `withDefault`: a proxy for `dictionary`, whose get trap returns `fallback` for
//    every property that the dictionary doesn't have (`property in target` tells you whether it
//    has it). For all other properties, it returns what Reflect.get(...) returns.
//      const german = withDefault({ hello: 'Hallo', thanks: 'Danke' }, '???');
//      german.hello -> 'Hallo'    german.goodbye -> '???'
//    Try it: uncomment the line `// new Proxy('text', {});`. Only objects can have a proxy, so
//    TypeScript reports an error, and running the file stops with a TypeError. Comment it out
//    again afterwards.
//
// b) Bug hunt: `logAccess` writes every read and every write into `log`. Reading works, but
//    writing throws a TypeError, and TypeScript reports an error at `set`. A set trap must
//    return true when the write worked. Returning false, or nothing (undefined), means that it
//    failed, and in strict mode that throws a TypeError. Reflect.set(...) returns true or
//    false, so return its result. TypeScript knows this rule because new Proxy() checks the
//    handler with the type ProxyHandler<T>.
//      const user = logAccess({ name: 'Ada', age: 36 }, log);
//      user.age = user.age + 1;  -> log: ['get age', 'set age = 37'], and user.age is 37

function withDefault(dictionary: Record<string, string>, fallback: string): Record<string, string> {
  // TODO
  throw new Error('TODO: implement withDefault');
}

// new Proxy('text', {});

function logAccess<T extends object>(target: T, log: string[]): T {
  return new Proxy(target, {
    get(target, property, receiver) {
      log.push(`get ${String(property)}`); // String(), because a property can also be a symbol
      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      log.push(`set ${String(property)} = ${value}`);
      Reflect.set(target, property, value, receiver);
    },
  });
}

// ---------------------------------------------------------------------------
// Exercise 2: Validating and watching changes with a proxy (concept 12.1)
// ---------------------------------------------------------------------------
// A set trap sees every write to the proxy, so it can check a value before it writes it, or
// tell someone about the change after it has written it. That only works for writes through
// the proxy: the proxy and its target are two different objects, and changing the target
// directly bypasses all traps. So once you have the proxy, use only the proxy.
//
// a) TypeScript checks types, but not ranges: for `volume: number`, it allows 150, -3 and 2.5.
//    Implement `checkedSettings`: a proxy whose set trap throws a RangeError with the message
//    'volume must be a whole number from 0 to 100' when someone sets volume to anything else
//    (Number.isInteger() checks for a whole number). All other writes go through to the
//    target with Reflect.set(...).
//      const settings = checkedSettings({ volume: 50, muted: false });
//      settings.volume = 80;   (works)
//      settings.volume = 150;  -> throws RangeError: volume must be a whole number from 0 to 100
//
// b) Implement `watch`: a proxy whose set trap remembers the old value, writes the new one with
//    Reflect.set(...), and then calls onChange(property, value, oldValue). But it calls
//    onChange only when the value really changes: Object.is(oldValue, value) is true when it
//    stays the same.
//      const counter = watch({ count: 0 }, (property, value, oldValue) => ...);
//      counter.count = 1;  -> calls onChange('count', 1, 0)
//      counter.count = 1;  -> no call: count is 1 already
//    watch() only sees writes to the properties of its own target. If you watch
//    { user: { name: 'Ada' } }, then watched.user.name = 'Grace' changes the nested user
//    object, which has no proxy, so onChange isn't called.

interface PlayerSettings {
  volume: number; // a whole number from 0 to 100
  muted: boolean;
}

function checkedSettings(settings: PlayerSettings): PlayerSettings {
  // TODO
  throw new Error('TODO: implement checkedSettings');
}

// Gets the name of the changed property, its new value and its old value
type ChangeListener = (property: string | symbol, value: unknown, oldValue: unknown) => void;

function watch<T extends object>(target: T, onChange: ChangeListener): T {
  // TODO
  throw new Error('TODO: implement watch');
}

// ---------------------------------------------------------------------------
// Exercise 3: The observer pattern (concept 12.2)
// ---------------------------------------------------------------------------
// In the observer pattern, a subject keeps a list of observers: functions that it calls when
// something happens. The subject doesn't need to know who is listening, and observers can come
// and go at any time. Events in the browser work the same way: a button is a subject, and
// addEventListener('click', handler) adds an observer to it. (This pattern is also called
// "publish/subscribe".)
//
// a) Implement `Subject`. subscribe(observer) adds the observer to #observers, and returns a
//    function that removes exactly this observer again (a closure remembers which one).
//    notify(value) calls every observer with the value, in the order they subscribed.
//      const temperature = new Subject<number>();
//      const unsubscribe = temperature.subscribe((celsius) => console.log(celsius));
//      temperature.notify(21);  (logs 21)
//      unsubscribe();
//      temperature.notify(22);  (logs nothing)
//
// b) `Emitter` has a Subject for each event name: #subjectFor(event) gives you the Subject of
//    an event. Implement on() and emit() with it. Then fix their types: right now, TypeScript
//    accepts any event name and any payload. Give both methods a type parameter K that must be
//    one of the event names (K extends keyof Events), and use Events[K] as the type of the
//    payload. The type tests in `emitterTypeTests` show errors until the types are right.
//      cart.on('added', (payload) => ...)  -> payload is { item: string; price: number }
//      cart.on('bought', ...)              -> error: CartEvents has no event 'bought'
//
// c) Put it all together: implement `createStore`. It returns `state`, a watched version of
//    initialState (use watch() from Exercise 2), and `subscribe`. Every change of the state
//    notifies a Subject<Change>, and store.subscribe(observer) subscribes to that subject. So
//    the code that changes the state doesn't need to know who reacts to the changes.
//      const store = createStore({ count: 0 });
//      store.subscribe((change) => console.log(change));
//      store.state.count++;  (logs { property: 'count', value: 1, oldValue: 0 })
//    Careful: `subscribe: subject.subscribe` would lose its `this`, as in Exercise 3 of Part 3.
//    Wrap the call in an arrow function instead.

class Subject<T> {
  #observers = new Set<(value: T) => void>(); // a Set keeps the order in which you add things

  subscribe(observer: (value: T) => void): () => void {
    // TODO: add the observer, and return a function that removes it again
    throw new Error('TODO: implement subscribe');
  }

  notify(value: T): void {
    // TODO
    throw new Error('TODO: implement notify');
  }
}

interface CartEvents {
  added: { item: string; price: number };
  removed: { item: string };
}

class Emitter<Events> {
  // `any`, because every event has its own payload type. The types of on() and emit() make
  // sure that every payload fits its event.
  #subjects = new Map<PropertyKey, Subject<any>>();

  #subjectFor(event: PropertyKey): Subject<any> {
    let subject = this.#subjects.get(event);
    if (subject === undefined) {
      subject = new Subject();
      this.#subjects.set(event, subject);
    }
    return subject;
  }

  // TODO: let TypeScript check the event name and the payload
  on(event: string, listener: (payload: any) => void): () => void {
    // TODO
    throw new Error('TODO: implement on');
  }

  // TODO: let TypeScript check the event name and the payload
  emit(event: string, payload: any): void {
    // TODO
    throw new Error('TODO: implement emit');
  }
}

// Type tests: TypeScript checks this function, but it never runs. A @ts-expect-error comment
// says that the line after it must be an error; if that line is fine, TypeScript complains.
function emitterTypeTests(cart: Emitter<CartEvents>): void {
  cart.on('added', (payload) => {
    const price: number = payload.price;
  });
  cart.emit('added', { item: 'Lamp', price: 30 });
  // @ts-expect-error: CartEvents has no event 'bought'
  cart.on('bought', () => {});
  // @ts-expect-error: the payload of 'added' needs a price
  cart.emit('added', { item: 'Lamp' });
  // @ts-expect-error: the payload of 'removed' is an object, not a text
  cart.emit('removed', 'Lamp');
}

// One change of the state
interface Change {
  property: string | symbol;
  value: unknown;
  oldValue: unknown;
}

interface Store<T> {
  state: T;
  subscribe: (observer: (change: Change) => void) => () => void;
}

function createStore<T extends object>(initialState: T): Store<T> {
  // TODO
  throw new Error('TODO: implement createStore');
}

// ===========================================================================
// Checks: run this file to see which exercises pass. You don't need to change anything below.
// ===========================================================================

let passed = 0;
let failed = 0;

function isEqual(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true;
  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  const entriesA = Object.entries(a);
  const entriesB = new Map(Object.entries(b));
  return (
    entriesA.length === entriesB.size &&
    entriesA.every(([key, value]) => entriesB.has(key) && isEqual(value, entriesB.get(key)))
  );
}

function show(value: unknown): string {
  return JSON.stringify(value) ?? String(value);
}

function check(label: string, run: () => unknown, expected: unknown): void {
  try {
    const actual = run();
    if (isEqual(actual, expected)) {
      passed++;
      console.log(`✅ ${label}`);
    } else {
      failed++;
      console.log(`❌ ${label}\n     expected: ${show(expected)}\n     received: ${show(actual)}`);
    }
  } catch (error) {
    failed++;
    console.log(`❌ ${label}\n     ${error instanceof Error ? error.message : String(error)}`);
  }
}

// Calls `run` and describes the error it throws as a text like 'RangeError: Too big'
function errorOf(run: () => unknown): unknown {
  try {
    run();
  } catch (error) {
    return error instanceof Error ? `${error.name}: ${error.message}` : error;
  }
  return 'nothing was thrown';
}

// Exercise 1
check(
  "1a withDefault({ hello: 'Hallo', thanks: 'Danke' }, '???').hello",
  () => withDefault({ hello: 'Hallo', thanks: 'Danke' }, '???').hello,
  'Hallo',
);
check(
  "1a withDefault({ hello: 'Hallo', thanks: 'Danke' }, '???').goodbye",
  () => withDefault({ hello: 'Hallo', thanks: 'Danke' }, '???').goodbye,
  '???',
);
check(
  "1b user.age = user.age + 1: [the log, the target's age]",
  () => {
    const log: string[] = [];
    const target = { name: 'Ada', age: 36 };
    const user = logAccess(target, log);
    user.age = user.age + 1;
    return [log, target.age];
  },
  [['get age', 'set age = 37'], 37],
);

// Exercise 2
check(
  '2a settings.volume = 0, then = 100, then settings.muted = true: the target afterwards',
  () => {
    const target = { volume: 50, muted: false };
    const settings = checkedSettings(target);
    settings.volume = 0;
    settings.volume = 100;
    settings.muted = true;
    return target;
  },
  { volume: 100, muted: true },
);
check(
  '2a settings.volume = 150, -3 and 2.5: [the errors, the volume afterwards]',
  () => {
    const settings = checkedSettings({ volume: 50, muted: false });
    const errors = [150, -3, 2.5].map((volume: number) =>
      errorOf(() => {
        settings.volume = volume;
      }),
    );
    return [errors, settings.volume];
  },
  [
    [
      'RangeError: volume must be a whole number from 0 to 100',
      'RangeError: volume must be a whole number from 0 to 100',
      'RangeError: volume must be a whole number from 0 to 100',
    ],
    50,
  ],
);
check(
  '2b counter.count = 1, = 2, and = 2 again: [the onChange calls, the target afterwards]',
  () => {
    const calls: unknown[] = [];
    const target = { count: 0 };
    const counter = watch(target, (property: unknown, value: unknown, oldValue: unknown) => {
      calls.push([property, value, oldValue]);
    });
    counter.count = 1;
    counter.count = 2;
    counter.count = 2;
    return [calls, target];
  },
  [
    [
      ['count', 1, 0],
      ['count', 2, 1],
    ],
    { count: 2 },
  ],
);

// Exercise 3
check(
  '3a notify(21) with the observers A and B: what they received',
  () => {
    const received: string[] = [];
    const temperature = new Subject<number>();
    temperature.subscribe((celsius: number) => received.push(`A: ${celsius}`));
    temperature.subscribe((celsius: number) => received.push(`B: ${celsius}`));
    temperature.notify(21);
    return received;
  },
  ['A: 21', 'B: 21'],
);
check(
  '3a after A unsubscribes, notify(22) only reaches B',
  () => {
    const received: string[] = [];
    const temperature = new Subject<number>();
    const unsubscribeA = temperature.subscribe((celsius: number) => received.push(`A: ${celsius}`));
    temperature.subscribe((celsius: number) => received.push(`B: ${celsius}`));
    unsubscribeA();
    temperature.notify(22);
    return received;
  },
  ['B: 22'],
);
check(
  "3b cart.on('added') and cart.on('removed'), emit(), stop listening, emit() again: [added, removed]",
  () => {
    const added: unknown[] = [];
    const removed: unknown[] = [];
    const cart = new Emitter<CartEvents>();
    const stopAdded = cart.on('added', (payload: unknown) => added.push(payload));
    cart.on('removed', (payload: unknown) => removed.push(payload));
    cart.emit('added', { item: 'Lamp', price: 30 });
    cart.emit('removed', { item: 'Lamp' });
    stopAdded();
    cart.emit('added', { item: 'Desk', price: 120 });
    return [added, removed];
  },
  [[{ item: 'Lamp', price: 30 }], [{ item: 'Lamp' }]],
);
check(
  '3c store.state.count++ twice: [the changes that a subscriber saw, the state]',
  () => {
    const seen: Change[] = [];
    const store = createStore({ count: 0 });
    store.subscribe((change: Change) => seen.push(change));
    store.state.count++;
    store.state.count++;
    return [seen, store.state];
  },
  [
    [
      { property: 'count', value: 1, oldValue: 0 },
      { property: 'count', value: 2, oldValue: 1 },
    ],
    { count: 2 },
  ],
);
check(
  '3c after unsubscribing, a subscriber sees no more changes: [changes seen, state.count]',
  () => {
    const seen: Change[] = [];
    const store = createStore({ count: 0 });
    const unsubscribe = store.subscribe((change: Change) => seen.push(change));
    store.state.count = 5;
    unsubscribe();
    store.state.count = 6;
    return [seen.length, store.state.count];
  },
  [1, 6],
);

console.log(`\n${passed} passed, ${failed} failed`);
if (failed === 0) console.log('All checks pass. Well done! 🎉');
