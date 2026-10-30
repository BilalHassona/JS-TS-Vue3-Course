/**
 * Exercises – Part 3: Functions in depth
 * (concepts 3.1–3.3 in JS-TS-Concepts.md)
 *
 * How to work through this file:
 *   1. Solve the exercises from top to bottom. Each one explains what to write; look for "TODO".
 *   2. Run the file to see which checks pass. Node.js 22.18 or newer runs TypeScript directly:
 *        node exercises-part-3.ts
 *      (On an older Node.js version, use: npx tsx exercises-part-3.ts)
 *   3. Check your types too. Your editor underlines type errors in red, using the settings in
 *      tsconfig.json (in this folder). To check just this file in the terminal, run:
 *        npx -p typescript tsc --ignoreConfig --noEmit exercises-part-3.ts
 *      Type errors in exercises you haven't solved yet are normal. Some exercises are about
 *      fixing exactly those errors.
 *   4. You're done when every check shows ✅ and the type check reports no errors.
 *
 * Stuck? Compare your code with exercises-part-3-solved.ts.
 */

export {}; // makes this file a module, so its names don't clash with other exercise files

// ---------------------------------------------------------------------------
// Exercise 1: First-class and higher-order functions (concept 3.1)
// ---------------------------------------------------------------------------
// a) Implement `filterNumbers` WITHOUT the built-in filter(): loop over the numbers and keep
//    those for which `test(n)` returns true. This is how filter() works on the inside.
//      filterNumbers([1, 2, 3, 4], (n) => n % 2 === 0) -> [2, 4]
//
// b) Implement `makeMultiplier`. It returns a NEW function that multiplies its argument by
//    `factor`. The return type `(n: number) => number` means "a function from number to number".
//      const triple = makeMultiplier(3);    triple(5) -> 15
//
// c) Passing a function instead of a value delays the work until the function is called.
//    Implement `createGreeter`: it returns a function that calls `getName()` EVERY time it runs,
//    so it always greets the current name, even after the name has changed.
//      const user = { name: 'Ada' };
//      const greet = createGreeter(() => user.name);
//      greet() -> 'Hello, Ada!'      ...after user.name = 'Grace':      greet() -> 'Hello, Grace!'

function filterNumbers(numbers: number[], test: (n: number) => boolean): number[] {
  // TODO
  throw new Error('TODO: implement filterNumbers');
}

function makeMultiplier(factor: number): (n: number) => number {
  // TODO
  throw new Error('TODO: implement makeMultiplier');
}

function createGreeter(getName: () => string): () => string {
  // TODO
  throw new Error('TODO: implement createGreeter');
}

// ---------------------------------------------------------------------------
// Exercise 2: Scope and closures (concept 3.2)
// ---------------------------------------------------------------------------
// a) Implement `makeCounter`. The variable `count` lives inside makeCounter, so only the two
//    functions you return can reach it. Nobody else can read or change it: it is private state.
//    increment() adds 1 and returns the new count, and reset() sets the count back to 0.
//    Every call of makeCounter() creates its own, independent count.
//      const counter = makeCounter();
//      counter.increment() -> 1    counter.increment() -> 2    counter.reset();    counter.increment() -> 1
//
// b) Bug hunt: `makeGreeters` should return one greeting function per name, but every function
//    says 'Hi, undefined'. The loop uses `var`, so all the functions share ONE variable `i`. When
//    they finally run, the loop is over and `i` equals names.length. With `let`, every loop
//    round gets its own `i`. Fix the bug by changing one word.
//      makeGreeters(['Ada', 'Alan']) -> two functions that return 'Hi, Ada' and 'Hi, Alan'

interface Counter {
  increment: () => number;
  reset: () => void;
}

function makeCounter(): Counter {
  let count = 0;
  // TODO: return an object with increment() and reset(), both using `count`
  throw new Error('TODO: implement makeCounter');
}

function makeGreeters(names: string[]): Array<() => string> {
  const greeters: Array<() => string> = [];
  for (var i = 0; i < names.length; i++) {
    greeters.push(() => `Hi, ${names[i]}`);
  }
  return greeters;
}

// ---------------------------------------------------------------------------
// Exercise 3: this, bind and arrow functions (concept 3.3)
// ---------------------------------------------------------------------------
// a) `clickCounter.increment` uses `this`. When the method is passed on its own as a callback,
//    it loses its object: `this` becomes undefined, and the call crashes. TypeScript doesn't
//    notice this mistake, but the check below does. Fix `boundIncrement` with bind(), so that
//    `this` always points to clickCounter.
//      callTwice(boundIncrement) -> 2
//
// b) `labels()` uses a regular `function` as the map() callback. A regular function gets its own
//    `this` (undefined here), so `this.owner` crashes, and TypeScript reports "'this' implicitly
//    has type 'any'". Turn the callback into an arrow function: an arrow function has no `this`
//    of its own and uses the `this` of the method around it.
//      basket.labels() -> ["Ada's apple", "Ada's pear"]

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

const boundIncrement = clickCounter.increment; // TODO: use bind() so `this` stays clickCounter

const basket = {
  owner: 'Ada',
  items: ['apple', 'pear'],
  labels(): string[] {
    // TODO: turn the callback below into an arrow function
    return this.items.map(function (item) {
      return `${this.owner}'s ${item}`;
    });
  },
};

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
