/**
 * Solutions – Part 3: Functions in depth
 * (concepts 3.1–3.3 in JS-TS-Concepts.md)
 *
 * Try exercises-part-3.ts on your own first. Your solution doesn't have to match this one
 * exactly: if all checks pass and the type check reports no errors, your solution is fine.
 *
 *   Run:        node exercises-part-3-solved.ts
 *   Type check: npx -p typescript tsc --ignoreConfig --noEmit exercises-part-3-solved.ts
 */

export {}; // makes this file a module, so its names don't clash with other exercise files

// ---------------------------------------------------------------------------
// Exercise 1: First-class and higher-order functions (concept 3.1)
// ---------------------------------------------------------------------------

function filterNumbers(numbers: number[], test: (n: number) => boolean): number[] {
  const kept: number[] = [];
  for (const n of numbers) {
    if (test(n)) kept.push(n); // `test` is a function we received, so we can call it
  }
  return kept;
}

function makeMultiplier(factor: number): (n: number) => number {
  return (n) => n * factor; // the returned function remembers `factor` (a closure, concept 3.2)
}

function createGreeter(getName: () => string): () => string {
  // getName() runs inside the returned function, so the name is read on every call.
  // `const name = getName();` up here would read it once and keep the old name forever.
  return () => `Hello, ${getName()}!`;
}

// ---------------------------------------------------------------------------
// Exercise 2: Scope and closures (concept 3.2)
// ---------------------------------------------------------------------------

interface Counter {
  increment: () => number;
  reset: () => void;
}

function makeCounter(): Counter {
  let count = 0; // private: only the two functions below can reach this variable
  return {
    increment: () => {
      count++;
      return count;
    },
    reset: () => {
      count = 0;
    },
  };
}

function makeGreeters(names: string[]): Array<() => string> {
  const greeters: Array<() => string> = [];
  for (let i = 0; i < names.length; i++) {
    // `let` gives each loop round its own `i`, so each function remembers its own name
    greeters.push(() => `Hi, ${names[i]}`);
  }
  return greeters;
}

// ---------------------------------------------------------------------------
// Exercise 3: this, bind and arrow functions (concept 3.3)
// ---------------------------------------------------------------------------

const clickCounter = {
  clicks: 0,
  increment(): number {
    this.clicks++;
    return this.clicks;
  },
};

function callTwice(callback: () => number): number {
  callback();
  return callback();
}

// bind() returns a new function whose `this` is fixed to clickCounter, however it is called.
// An arrow function works as well: const boundIncrement = () => clickCounter.increment();
const boundIncrement = clickCounter.increment.bind(clickCounter);

const basket = {
  owner: 'Ada',
  items: ['apple', 'pear'],
  labels(): string[] {
    // The arrow function uses the `this` of labels(), which is basket
    return this.items.map((item) => `${this.owner}'s ${item}`);
  },
};

// ===========================================================================
// Checks: the same checks as in exercises-part-3.ts
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

// Exercise 1
check('1a filterNumbers([1, 2, 3, 4], (n) => n % 2 === 0)', () => filterNumbers([1, 2, 3, 4], (n) => n % 2 === 0), [
  2, 4,
]);
check('1a filterNumbers([5, 12, 8], (n) => n > 6)', () => filterNumbers([5, 12, 8], (n) => n > 6), [12, 8]);
check('1b makeMultiplier(3)(5)', () => makeMultiplier(3)(5), 15);
check('1b makeMultiplier(10)(2.5)', () => makeMultiplier(10)(2.5), 25);
check(
  '1c createGreeter(() => user.name) greets the current name',
  () => {
    const user = { name: 'Ada' };
    const greet = createGreeter(() => user.name);
    const before = greet();
    user.name = 'Grace';
    return [before, greet()];
  },
  ['Hello, Ada!', 'Hello, Grace!'],
);

// Exercise 2
check(
  '2a increment() twice',
  () => {
    const counter = makeCounter();
    counter.increment();
    return counter.increment();
  },
  2,
);
check(
  '2a reset(), then increment()',
  () => {
    const counter = makeCounter();
    counter.increment();
    counter.increment();
    counter.reset();
    return counter.increment();
  },
  1,
);
check(
  '2a two counters are independent',
  () => {
    const first = makeCounter();
    const second = makeCounter();
    first.increment();
    first.increment();
    return second.increment();
  },
  1,
);
check("2b makeGreeters(['Ada', 'Alan'])", () => makeGreeters(['Ada', 'Alan']).map((greet) => greet()), [
  'Hi, Ada',
  'Hi, Alan',
]);

// Exercise 3
check('3a callTwice(boundIncrement)', () => callTwice(boundIncrement), 2);
check('3b basket.labels()', () => basket.labels(), ["Ada's apple", "Ada's pear"]);

console.log(`\n${passed} passed, ${failed} failed`);
if (failed === 0) console.log('All checks pass. Well done! 🎉');
