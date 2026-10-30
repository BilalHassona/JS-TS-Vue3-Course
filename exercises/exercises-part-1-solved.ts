/**
 * Solutions – Part 1: TypeScript basics for what you already know
 * (concepts 1.1–1.7 in JS-TS-Concepts.md)
 *
 * Try exercises-part-1.ts on your own first. Your solution doesn't have to match this one
 * exactly: if all checks pass and the type check reports no errors, your solution is fine.
 *
 *   Run:        node exercises-part-1-solved.ts
 *   Type check: npx -p typescript tsc --ignoreConfig --noEmit exercises-part-1-solved.ts
 */

export {}; // makes this file a module, so its names don't clash with other exercise files

// ---------------------------------------------------------------------------
// Exercise 1: Type annotations and inference (concepts 1.1 and 1.2)
// ---------------------------------------------------------------------------

function formatPrice(amount: number, currency: string): string {
  return `${amount.toFixed(2)} ${currency}`;
}

function parseQuantity(text: string): number {
  const quantity = Number(text); // Number() ignores spaces around the digits: ' 7 ' -> 7
  return Number.isNaN(quantity) ? 0 : quantity;
}

const courseName = 'TypeScript 101'; // inferred type: 'TypeScript 101' (a const never changes)
let attempts = 0; // inferred type: number
// attempts = 'three'; // Error: Type 'string' is not assignable to type 'number'.

// ---------------------------------------------------------------------------
// Exercise 2: typeof quirks and the unknown type (concepts 1.1 and 1.3)
// ---------------------------------------------------------------------------

function describeValue(value: unknown): string {
  if (value === null) return 'null'; // typeof null is 'object', so check null first
  if (Array.isArray(value)) return 'array'; // typeof [] is 'object' as well
  return typeof value;
}

function shout(value: unknown): string {
  if (typeof value === 'string') {
    return value.toUpperCase() + '!'; // inside this if, TypeScript knows that value is a string
  }
  return 'Not a string';
}

// ---------------------------------------------------------------------------
// Exercise 3: Arrays, tuples and null (concepts 1.3 and 1.4)
// ---------------------------------------------------------------------------

function minMax(numbers: number[]): [number, number] | null {
  if (numbers.length === 0) return null;
  let min = Infinity;
  let max = -Infinity;
  for (const n of numbers) {
    if (n < min) min = n;
    if (n > max) max = n;
  }
  return [min, max];
}

function rangeLabel(numbers: number[]): string {
  const result = minMax(numbers);
  if (result === null) return 'no numbers';
  const [min, max] = result; // after the null check, TypeScript knows result is a tuple
  return `from ${min} to ${max}`;
}

// ---------------------------------------------------------------------------
// Exercise 4: Object types and interfaces (concepts 1.5 and 1.6)
// ---------------------------------------------------------------------------

interface Student {
  readonly id: number;
  name: string;
  grades: number[];
  email?: string;
}

interface Tutor extends Student {
  subject: string;
}

// The same two types written as type aliases, with an intersection (&) instead of extends:
//   type Student = { readonly id: number; name: string; grades: number[]; email?: string };
//   type Tutor = Student & { subject: string };

const ada: Student = { id: 1, name: 'Ada Lovelace', grades: [90, 85, 95], email: 'ada@example.com' };
const alan: Tutor = { id: 2, name: 'Alan Turing', grades: [], subject: 'Mathematics' };

// ada.id = 3; // Error: Cannot assign to 'id' because it is a read-only property.

function averageGrade(student: Student): number {
  if (student.grades.length === 0) return 0;
  let sum = 0;
  for (const grade of student.grades) sum += grade;
  return sum / student.grades.length;
}

function contactLine(student: Student): string {
  if (student.email === undefined) return `${student.name} (no email)`;
  return `${student.name} <${student.email}>`;
}

// ---------------------------------------------------------------------------
// Exercise 5: Typing functions (concept 1.7)
// ---------------------------------------------------------------------------

type Formatter = (value: number) => string;

function formatAll(values: number[], format: Formatter): string[] {
  return values.map((value) => format(value));
}

function truncate(text: string, maxLength = 10): string {
  // Because of the default value, TypeScript infers that maxLength is a number.
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

// ===========================================================================
// Checks: the same checks as in exercises-part-1.ts
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
