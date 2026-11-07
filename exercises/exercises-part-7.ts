/**
 * Exercises – Part 7: Error handling
 * (concepts 7.1–7.2 in JS-TS-Concepts.md)
 *
 * How to work through this file:
 *   1. Solve the exercises from top to bottom. Each one explains what to write; look for "TODO".
 *   2. Run the file to see which checks pass. Node.js 22.18 or newer runs TypeScript directly:
 *        node exercises-part-7.ts
 *      (On an older Node.js version, use: npx tsx exercises-part-7.ts)
 *   3. Check your types too. Your editor underlines type errors in red, using the settings in
 *      tsconfig.json (in this folder). To check just this file in the terminal, run:
 *        npx -p typescript tsc --ignoreConfig --noEmit exercises-part-7.ts
 *      Type errors in exercises you haven't solved yet are normal. Some exercises are about
 *      fixing exactly those errors.
 *   4. You're done when every check shows ✅ and the type check reports no errors.
 *
 * Stuck? Compare your code with exercises-part-7-solved.ts.
 */

export {}; // makes this file a module, so its names don't clash with other exercise files

// ---------------------------------------------------------------------------
// Exercise 1: throw, try/catch and finally (concept 7.1)
// ---------------------------------------------------------------------------
// `throw` stops a function right away. The error travels up to the code that called the
// function, and further up, until a try/catch catches it. If nothing catches it, the program
// stops.
//
// a) Implement `parseAge`. It turns a text into an age, and throws an error when that isn't
//    possible. Built-in error types like RangeError tell the caller what kind of problem it was.
//      - not a number (Number(text) is NaN): throw new Error('Not a number: <text>')
//      - below 0 or above 150: throw new RangeError('Age must be between 0 and 150')
//      parseAge('42') -> 42
//      parseAge('abc') -> throws Error: Not a number: abc
//      parseAge('200') -> throws RangeError: Age must be between 0 and 150
//
// b) A loading indicator has to disappear when the work is done, even when the work fails.
//    Implement `withLoading`. It already sets page.loading to true. Run task() and return its
//    result, and use try/finally to set page.loading back to false in every case. Don't catch
//    the error: the code that called withLoading() should still receive it. In both examples,
//    page.loading is false afterwards:
//      withLoading(() => 'done') -> 'done'
//      withLoading(() => { throw new Error('Boom'); }) -> throws Error: Boom

function parseAge(text: string): number {
  // TODO
  throw new Error('TODO: implement parseAge');
}

const page = { loading: false };

function withLoading(task: () => string): string {
  page.loading = true;
  // TODO: run task() and return its result. Set page.loading back to false in a finally block.
  throw new Error('TODO: implement withLoading');
}

// ---------------------------------------------------------------------------
// Exercise 2: Custom error classes and cause (concept 7.1)
// ---------------------------------------------------------------------------
// a) Implement the constructor of `ValidationError`, an error class for invalid input. It
//    extends Error, so it must call super(message) first: the constructor of Error stores the
//    message. TypeScript reports an error until the constructor calls super(). Then set
//    this.name to 'ValidationError' (otherwise the name stays 'Error') and store the field.
//      const error = new ValidationError('email', 'Email must contain @');
//      error.name -> 'ValidationError'    error.field -> 'email'
//      error.message -> 'Email must contain @'
//      error instanceof ValidationError -> true    error instanceof Error -> true
//
// b) When you catch a low-level error, you often want to throw a clearer one instead, without
//    losing the original. The second argument of Error does that:
//    new Error(message, { cause: error }) keeps the original error in error.cause.
//    JSON.parse(text) turns a text like '{"theme": "dark"}' into an object, and throws a
//    SyntaxError when the text isn't valid JSON. Implement `loadSettings`: return the result of
//    JSON.parse(text). When JSON.parse() throws, throw new Error('Could not load settings')
//    instead, with the SyntaxError as its cause.
//      loadSettings('{"theme": "dark"}') -> { theme: 'dark' }
//      loadSettings('{oops') -> throws Error: Could not load settings, whose cause is a SyntaxError

class ValidationError extends Error {
  field: string;

  constructor(field: string, message: string) {
    // TODO: call super(message), then set this.name and this.field
    throw new Error('TODO: implement the ValidationError constructor');
  }
}

function loadSettings(text: string): unknown {
  // TODO
  throw new Error('TODO: implement loadSettings');
}

// ---------------------------------------------------------------------------
// Exercise 3: Errors in TypeScript: unknown and instanceof (concept 7.2)
// ---------------------------------------------------------------------------
// JavaScript lets you throw anything, not only Error objects: `throw 'Oops'` and `throw 42` work
// too. So TypeScript can't know what a catch block receives, and the error in `catch (error)`
// has the type unknown. Before you can read error.message, you have to narrow the type,
// usually with `error instanceof Error`.
//
// a) Implement `getErrorMessage`: the message of an Error, the text itself when a string was
//    thrown, and 'Unknown error' for anything else.
//      getErrorMessage(new RangeError('Too big')) -> 'Too big'    getErrorMessage('Oops') -> 'Oops'
//      getErrorMessage(42) -> 'Unknown error'
//    Then use it to fix `safeDivide`. legacyDivide() is old code that throws a string, so
//    error.message is undefined there, and TypeScript reports "'error' is of type 'unknown'".
//      safeDivide(1, 0) -> 'Failed: Division by zero'
//
// b) Implement `describeError`. For a ValidationError (from Exercise 2), return
//    'Invalid <field>: <message>'. The check `error instanceof ValidationError` narrows the
//    type, so TypeScript lets you read error.field. For anything else, return
//    getErrorMessage(error).
//      describeError(new ValidationError('email', 'Email must contain @'))
//        -> 'Invalid email: Email must contain @'
//      describeError(new Error('Server unavailable')) -> 'Server unavailable'

function getErrorMessage(error: unknown): string {
  // TODO
  throw new Error('TODO: implement getErrorMessage');
}

function legacyDivide(a: number, b: number): number {
  if (b === 0) throw 'Division by zero'; // a string, not an Error object
  return a / b;
}

function safeDivide(a: number, b: number): string {
  try {
    return `Result: ${legacyDivide(a, b)}`;
  } catch (error) {
    // TODO: use getErrorMessage(error)
    return `Failed: ${error.message}`;
  }
}

function describeError(error: unknown): string {
  // TODO
  throw new Error('TODO: implement describeError');
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
    if (!(error instanceof Error)) return error;
    const cause = error.cause instanceof Error ? ` (cause: ${error.cause.name})` : '';
    return `${error.name}: ${error.message}${cause}`;
  }
  return 'nothing was thrown';
}

// Exercise 1
check("1a parseAge('42')", () => parseAge('42'), 42);
check("1a parseAge('abc')", () => errorOf(() => parseAge('abc')), 'Error: Not a number: abc');
check("1a parseAge('200')", () => errorOf(() => parseAge('200')), 'RangeError: Age must be between 0 and 150');
check("1a parseAge('-1')", () => errorOf(() => parseAge('-1')), 'RangeError: Age must be between 0 and 150');
check("1b withLoading(() => 'done'): [result, page.loading]", () => [withLoading(() => 'done'), page.loading], [
  'done',
  false,
]);
check(
  '1b withLoading(a task that throws): [error, page.loading]',
  () => {
    const error = errorOf(() =>
      withLoading(() => {
        throw new Error('Boom');
      }),
    );
    return [error, page.loading];
  },
  ['Error: Boom', false],
);

// Exercise 2
check(
  "2a new ValidationError('email', 'Email must contain @')",
  () => {
    const error = new ValidationError('email', 'Email must contain @');
    return { name: error.name, message: error.message, field: error.field };
  },
  { name: 'ValidationError', message: 'Email must contain @', field: 'email' },
);
check(`2b loadSettings('{"theme": "dark"}')`, () => loadSettings('{"theme": "dark"}'), { theme: 'dark' });
check(
  "2b loadSettings('{oops')",
  () => errorOf(() => loadSettings('{oops')),
  'Error: Could not load settings (cause: SyntaxError)',
);

// Exercise 3
check("3a getErrorMessage(new RangeError('Too big'))", () => getErrorMessage(new RangeError('Too big')), 'Too big');
check("3a getErrorMessage('Oops')", () => getErrorMessage('Oops'), 'Oops');
check('3a getErrorMessage(42)', () => getErrorMessage(42), 'Unknown error');
check('3a safeDivide(1, 0)', () => safeDivide(1, 0), 'Failed: Division by zero');
check(
  "3b describeError(new ValidationError('email', 'Email must contain @'))",
  () => describeError(new ValidationError('email', 'Email must contain @')),
  'Invalid email: Email must contain @',
);
check(
  "3b describeError(new Error('Server unavailable'))",
  () => describeError(new Error('Server unavailable')),
  'Server unavailable',
);

console.log(`\n${passed} passed, ${failed} failed`);
if (failed === 0) console.log('All checks pass. Well done! 🎉');
