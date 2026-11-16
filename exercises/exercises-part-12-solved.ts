/**
 * Solutions – Part 12: Proxies and the observer pattern
 * (concepts 12.1–12.2 in JS-TS-Concepts.md)
 *
 * Try exercises-part-12.ts on your own first. Your solution doesn't have to match this one
 * exactly: if all checks pass and the type check reports no errors, your solution is fine.
 *
 *   Run:        node exercises-part-12-solved.ts
 *   Type check: npx -p typescript tsc --ignoreConfig --noEmit exercises-part-12-solved.ts
 */

'use strict'; // strict mode, also when you run this file with npx tsx (see Exercise 1b)

export {}; // makes this file a module, so its names don't clash with other exercise files

// ---------------------------------------------------------------------------
// Exercise 1: Proxy and Reflect (concept 12.1)
// ---------------------------------------------------------------------------

function withDefault(dictionary: Record<string, string>, fallback: string): Record<string, string> {
  return new Proxy(dictionary, {
    get(target, property, receiver) {
      return property in target ? Reflect.get(target, property, receiver) : fallback;
    },
  });
}

// new Proxy('text', {});
// -> Error: Argument of type 'string' is not assignable to parameter of type 'object'.
//    When it runs: TypeError: Cannot create proxy with a non-object as target or handler

function logAccess<T extends object>(target: T, log: string[]): T {
  return new Proxy(target, {
    get(target, property, receiver) {
      log.push(`get ${String(property)}`); // String(), because a property can also be a symbol
      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      log.push(`set ${String(property)} = ${value}`);
      return Reflect.set(target, property, value, receiver); // true when the write worked
    },
  });
}

// ---------------------------------------------------------------------------
// Exercise 2: Validating and watching changes with a proxy (concept 12.1)
// ---------------------------------------------------------------------------

interface PlayerSettings {
  volume: number; // a whole number from 0 to 100
  muted: boolean;
}

function checkedSettings(settings: PlayerSettings): PlayerSettings {
  return new Proxy(settings, {
    set(target, property, value, receiver) {
      if (property === 'volume' && !(Number.isInteger(value) && value >= 0 && value <= 100)) {
        throw new RangeError('volume must be a whole number from 0 to 100'); // nothing is written
      }
      return Reflect.set(target, property, value, receiver);
    },
  });
}

// Gets the name of the changed property, its new value and its old value
type ChangeListener = (property: string | symbol, value: unknown, oldValue: unknown) => void;

function watch<T extends object>(target: T, onChange: ChangeListener): T {
  return new Proxy(target, {
    set(target, property, value, receiver) {
      const oldValue = Reflect.get(target, property, receiver);
      const written = Reflect.set(target, property, value, receiver);
      if (written && !Object.is(oldValue, value)) onChange(property, value, oldValue); // real changes only
      return written;
    },
  });
}

// ---------------------------------------------------------------------------
// Exercise 3: The observer pattern (concept 12.2)
// ---------------------------------------------------------------------------

class Subject<T> {
  #observers = new Set<(value: T) => void>(); // a Set keeps the order in which you add things

  subscribe(observer: (value: T) => void): () => void {
    this.#observers.add(observer);
    // The arrow function remembers `observer` (a closure) and `this`, so it removes the right one
    return () => {
      this.#observers.delete(observer);
    };
  }

  notify(value: T): void {
    for (const observer of this.#observers) observer(value);
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

  // K is one of the event names, and Events[K] is the payload type of exactly that event
  on<K extends keyof Events>(event: K, listener: (payload: Events[K]) => void): () => void {
    return this.#subjectFor(event).subscribe(listener);
  }

  emit<K extends keyof Events>(event: K, payload: Events[K]): void {
    this.#subjectFor(event).notify(payload);
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
  const changes = new Subject<Change>();
  const state = watch(initialState, (property, value, oldValue) => changes.notify({ property, value, oldValue }));
  // An arrow function, so that subscribe() is called on `changes` and keeps its `this`
  return { state, subscribe: (observer) => changes.subscribe(observer) };
}

// ===========================================================================
// Checks: the same checks as in exercises-part-12.ts
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
