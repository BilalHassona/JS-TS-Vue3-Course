/**
 * Exercises – Part 1: TypeScript basics for what you already know
 * (concepts 1.1–1.7 in JS-TS-Concepts.md)
 *
 * How to work through this file:
 *   1. Solve the exercises from top to bottom. Each one explains what to write; look for "TODO".
 *   2. Run the file to see which checks pass. Node.js 22.18 or newer runs TypeScript directly:
 *        node exercises-part-1.ts
 *      (On an older Node.js version, use: npx tsx exercises-part-1.ts)
 *   3. Check your types too. Your editor underlines type errors in red, using the settings in
 *      tsconfig.json (in this folder). To check just this file in the terminal, run:
 *        npx -p typescript tsc --ignoreConfig --noEmit exercises-part-1.ts
 *      Type errors in exercises you haven't solved yet are normal. Some exercises are about
 *      fixing exactly those errors.
 *   4. You're done when every check shows ✅ and the type check reports no errors.
 *
 * Stuck? Compare your code with exercises-part-1-solved.ts.
 */

export {}; // makes this file a module, so its names don't clash with other exercise files

// ---------------------------------------------------------------------------
// Exercise 1: Type annotations and inference (concepts 1.1 and 1.2)
// ---------------------------------------------------------------------------
// a) `formatPrice` has no types yet, so TypeScript reports "implicitly has an 'any' type".
//    Add the types: `amount` is a number, `currency` is a string, and the function returns a
//    string. Then implement it: the amount with exactly 2 decimals, a space, and the currency.
//      formatPrice(12.5, 'EUR') -> '12.50 EUR'                      (hint: toFixed)
//
// b) Text from an input field is always a string, and in JavaScript '10' + 5 is '105'.
//    Add the types to `parseQuantity` (it takes a string and returns a number), then implement
//    it: convert the text with Number(), and return 0 when the result is NaN.
//      parseQuantity('3') -> 3    parseQuantity(' 7 ') -> 7    parseQuantity('abc') -> 0
//                                                                (hint: Number.isNaN)
//
// c) Inference: TypeScript works out a type from the value. Hover over the two variables below
//    in your editor. `courseName` has the literal type 'TypeScript 101', because a const can
//    never change. `attempts` has the type number. Uncomment the last line, read the error,
//    then comment it out again.

function formatPrice(amount, currency) {
  // TODO
  throw new Error('TODO: implement formatPrice');
}

function parseQuantity(text) {
  // TODO
  throw new Error('TODO: implement parseQuantity');
}

const courseName = 'TypeScript 101';
let attempts = 0;
// attempts = 'three';

// ---------------------------------------------------------------------------
// Exercise 2: typeof quirks and the unknown type (concepts 1.1 and 1.3)
// ---------------------------------------------------------------------------
// a) Implement `describeValue`. Its parameter has the type `unknown`: the value could be
//    anything. Return 'null' for null, 'array' for arrays, and otherwise the result of
//    `typeof value` ('string', 'number', 'boolean', 'undefined', 'object', ...).
//    Careful: typeof null is 'object', and so is typeof []. Check for those two first
//    (hint: value === null, Array.isArray(value)).
//
// b) Implement `shout`. If `value` is a string, return it in upper case followed by '!'.
//    Otherwise return 'Not a string'.
//      shout('hello') -> 'HELLO!'    shout(42) -> 'Not a string'
//    TypeScript won't let you call value.toUpperCase() on an unknown value until you have
//    checked typeof value === 'string'. A check like this is called narrowing.

function describeValue(value: unknown): string {
  // TODO
  throw new Error('TODO: implement describeValue');
}

function shout(value: unknown): string {
  // TODO
  throw new Error('TODO: implement shout');
}

// ---------------------------------------------------------------------------
// Exercise 3: Arrays, tuples and null (concepts 1.3 and 1.4)
// ---------------------------------------------------------------------------
// a) Implement `minMax`. It returns a tuple [smallest, largest], or null for an empty array.
//    The return type `[number, number] | null` says exactly that.
//      minMax([4, 2, 9, 7]) -> [2, 9]    minMax([5]) -> [5, 5]    minMax([]) -> null
//
// b) Implement `rangeLabel` using `minMax`. Return 'from 2 to 9' for [4, 2, 9], or
//    'no numbers' for an empty array. TypeScript makes you handle null before you can use the
//    tuple: check for null first, then read both values (for example: const [min, max] = result).

function minMax(numbers: number[]): [number, number] | null {
  // TODO
  throw new Error('TODO: implement minMax');
}

function rangeLabel(numbers: number[]): string {
  // TODO
  throw new Error('TODO: implement rangeLabel');
}

// ---------------------------------------------------------------------------
// Exercise 4: Object types and interfaces (concepts 1.5 and 1.6)
// ---------------------------------------------------------------------------
// a) Complete the `Student` interface:
//      id      a number that can never change (read-only)
//      name    a string
//      grades  an array of numbers
//      email   a string, optional (not every student has one)
// b) Complete the `Tutor` interface: a Tutor is a Student (use `extends`) with an extra
//    `subject` (a string). When you're done, the sample data below must fit both interfaces
//    without type errors.
// c) Implement `averageGrade`: the average of the grades, or 0 when there are no grades.
//      averageGrade(ada) -> 90
// d) Implement `contactLine`:
//      contactLine(ada)  -> 'Ada Lovelace <ada@example.com>'
//      contactLine(alan) -> 'Alan Turing (no email)'
//    Passing `alan` works even though it is a Tutor, because every Tutor is also a Student.

interface Student {
  // TODO
}

interface Tutor {
  // TODO
}

const ada: Student = { id: 1, name: 'Ada Lovelace', grades: [90, 85, 95], email: 'ada@example.com' };
const alan: Tutor = { id: 2, name: 'Alan Turing', grades: [], subject: 'Mathematics' };

// Try it: once `id` is read-only, uncomment the next line. TypeScript reports an error.
// ada.id = 3;

function averageGrade(student: Student): number {
  // TODO
  throw new Error('TODO: implement averageGrade');
}

function contactLine(student: Student): string {
  // TODO
  throw new Error('TODO: implement contactLine');
}

// ---------------------------------------------------------------------------
// Exercise 5: Typing functions (concept 1.7)
// ---------------------------------------------------------------------------
// a) Replace `unknown` with a function type: a function that takes a number and returns a string.
//    As long as the type is unknown, TypeScript won't let you call `format` in b.
// b) Implement `formatAll`: call `format` on every value and return the results as a new array.
//      formatAll([1, 2.5], (n) => n.toFixed(2)) -> ['1.00', '2.50']
// c) `maxLength?: number` makes the parameter optional, but a left-out argument is undefined.
//    Replace it with a default value instead: `maxLength = 10`. Then implement `truncate`: if
//    the text is longer than maxLength, cut it to maxLength characters and add '...'.
//      truncate('TypeScript')                -> 'TypeScript'
//      truncate('JavaScript and TypeScript') -> 'JavaScript...'
//      truncate('Hello world', 5)            -> 'Hello...'

type Formatter = unknown; // TODO: replace `unknown` with a function type

function formatAll(values: number[], format: Formatter): string[] {
  // TODO
  throw new Error('TODO: implement formatAll');
}

function truncate(text: string, maxLength?: number): string {
  // TODO: replace `maxLength?: number` with a default value of 10, then implement truncate
  throw new Error('TODO: implement truncate');
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

// Exercise 1
check("1a formatPrice(12.5, 'EUR')", () => formatPrice(12.5, 'EUR'), '12.50 EUR');
check("1a formatPrice(3, 'USD')", () => formatPrice(3, 'USD'), '3.00 USD');
check("1b parseQuantity('3')", () => parseQuantity('3'), 3);
check("1b parseQuantity(' 7 ')", () => parseQuantity(' 7 '), 7);
check("1b parseQuantity('abc')", () => parseQuantity('abc'), 0);

// Exercise 2
check('2a describeValue(null)', () => describeValue(null), 'null');
check('2a describeValue([1, 2])', () => describeValue([1, 2]), 'array');
check("2a describeValue('hi')", () => describeValue('hi'), 'string');
check('2a describeValue(42)', () => describeValue(42), 'number');
check('2a describeValue(undefined)', () => describeValue(undefined), 'undefined');
check('2a describeValue({})', () => describeValue({}), 'object');
check("2b shout('hello')", () => shout('hello'), 'HELLO!');
check('2b shout(42)', () => shout(42), 'Not a string');

// Exercise 3
check('3a minMax([4, 2, 9, 7])', () => minMax([4, 2, 9, 7]), [2, 9]);
check('3a minMax([5])', () => minMax([5]), [5, 5]);
check('3a minMax([])', () => minMax([]), null);
check('3b rangeLabel([4, 2, 9])', () => rangeLabel([4, 2, 9]), 'from 2 to 9');
check('3b rangeLabel([])', () => rangeLabel([]), 'no numbers');

// Exercise 4
check('4c averageGrade(ada)', () => averageGrade(ada), 90);
check('4c averageGrade(alan)', () => averageGrade(alan), 0);
check('4d contactLine(ada)', () => contactLine(ada), 'Ada Lovelace <ada@example.com>');
check('4d contactLine(alan)', () => contactLine(alan), 'Alan Turing (no email)');

// Exercise 5
check(
  '5b formatAll([1, 2.5], (n) => n.toFixed(2))',
  () => formatAll([1, 2.5], (n: number) => n.toFixed(2)),
  ['1.00', '2.50'],
);
check('5b formatAll([3], (n) => `#${n}`)', () => formatAll([3], (n: number) => `#${n}`), ['#3']);
check("5c truncate('TypeScript')", () => truncate('TypeScript'), 'TypeScript');
check("5c truncate('JavaScript and TypeScript')", () => truncate('JavaScript and TypeScript'), 'JavaScript...');
check("5c truncate('Hello world', 5)", () => truncate('Hello world', 5), 'Hello...');

console.log(`\n${passed} passed, ${failed} failed`);
if (failed === 0) console.log('All checks pass. Well done! 🎉');
