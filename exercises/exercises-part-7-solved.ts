/**
 * Solutions – Part 7: Error handling
 * (concepts 7.1–7.2 in JS-TS-Concepts.md)
 *
 * Try exercises-part-7.ts on your own first. Your solution doesn't have to match this one
 * exactly: if all checks pass and the type check reports no errors, your solution is fine.
 *
 *   Run:        node exercises-part-7-solved.ts
 *   Type check: npx -p typescript tsc --ignoreConfig --noEmit exercises-part-7-solved.ts
 */

export {}; // makes this file a module, so its names don't clash with other exercise files

// ---------------------------------------------------------------------------
// Exercise 1: throw, try/catch and finally (concept 7.1)
// ---------------------------------------------------------------------------

function parseAge(text: string): number {
  const age = Number(text);
  if (Number.isNaN(age)) {
    throw new Error(`Not a number: ${text}`);
  }
  if (age < 0 || age > 150) {
    throw new RangeError('Age must be between 0 and 150'); // RangeError is a built-in subclass of Error
  }
  return age;
}

const page = { loading: false };

function withLoading(task: () => string): string {
  page.loading = true;
  try {
    return task();
  } finally {
    // finally always runs: after the return, and also when task() throws. Without a catch,
    // the error still reaches the code that called withLoading().
    page.loading = false;
  }
}

// ---------------------------------------------------------------------------
// Exercise 2: Custom error classes and cause (concept 7.1)
// ---------------------------------------------------------------------------

class ValidationError extends Error {
  field: string;

  constructor(field: string, message: string) {
    super(message); // the constructor of Error stores the message
    this.name = 'ValidationError';
    this.field = field;
  }
}

function loadSettings(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch (error) {
    // A clearer message for the caller, with the original SyntaxError kept as the cause
    throw new Error('Could not load settings', { cause: error });
  }
}

// ---------------------------------------------------------------------------
// Exercise 3: Errors in TypeScript: unknown and instanceof (concept 7.2)
// ---------------------------------------------------------------------------

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message; // narrowed to Error, so .message is allowed
  if (typeof error === 'string') return error;
  return 'Unknown error';
}

function legacyDivide(a: number, b: number): number {
  if (b === 0) throw 'Division by zero'; // a string, not an Error object
  return a / b;
}

function safeDivide(a: number, b: number): string {
  try {
    return `Result: ${legacyDivide(a, b)}`;
  } catch (error) {
    return `Failed: ${getErrorMessage(error)}`; // works for Error objects, strings and anything else
  }
}

function describeError(error: unknown): string {
  if (error instanceof ValidationError) {
    return `Invalid ${error.field}: ${error.message}`; // narrowed to ValidationError, so .field is allowed
  }
  return getErrorMessage(error);
}

// ===========================================================================
// Checks: the same checks as in exercises-part-7.ts
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
