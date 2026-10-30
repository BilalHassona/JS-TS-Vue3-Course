/**
 * Exercises – Part 4: Unions, narrowing and modeling data
 * (concepts 4.1–4.5 in JS-TS-Concepts.md)
 *
 * How to work through this file:
 *   1. Solve the exercises from top to bottom. Each one explains what to write; look for "TODO".
 *   2. Run the file to see which checks pass. Node.js 22.18 or newer runs TypeScript directly:
 *        node exercises-part-4.ts
 *      (On an older Node.js version, use: npx tsx exercises-part-4.ts)
 *   3. Check your types too. Your editor underlines type errors in red, using the settings in
 *      tsconfig.json (in this folder). To check just this file in the terminal, run:
 *        npx -p typescript tsc --ignoreConfig --noEmit exercises-part-4.ts
 *      Type errors in exercises you haven't solved yet are normal. Some exercises are about
 *      fixing exactly those errors.
 *   4. You're done when every check shows ✅ and the type check reports no errors.
 *
 * Stuck? Compare your code with exercises-part-4-solved.ts.
 */

export {}; // makes this file a module, so its names don't clash with other exercise files

// ---------------------------------------------------------------------------
// Exercise 1: Literal unions and `as const` objects (concepts 4.1 and 4.4)
// ---------------------------------------------------------------------------
// a) Replace `string` with a union of literal types, so that a Size can only be 'sm', 'md' or
//    'lg'. Then implement `sizeToPixels`: 'sm' -> 12, 'md' -> 16, 'lg' -> 20.
//    Try it: when you're done, uncomment the line `// sizeToPixels('xl');`. TypeScript reports
//    an error, because 'xl' is not a Size. Comment the line out again afterwards.
//
// b) `Status` below is an `as const` object, so its values are fixed literal types. The type
//    with the same name means "one of the values of the Status object":
//    'draft' | 'published' | 'archived'.
//    Implement `nextStatus` with Status.Draft, Status.Published and Status.Archived instead of
//    typing the strings by hand: draft -> published, published -> archived, and archived stays
//    archived.
//
// c) Complete `statusLabels` with the labels 'Draft', 'Published' and 'Archived'. Its type
//    Record<Status, string> requires exactly one label per status, so TypeScript reports the
//    missing ones until all three are there.
//
// TypeScript also has enums, which would look like this:
//   enum Status { Draft = 'draft', Published = 'published', Archived = 'archived' }
// Unlike everything else in this file, an enum generates extra JavaScript code, and Node.js
// can't run it without a build step: with an enum in it, this file would no longer start with
// `node`. A literal union or an `as const` object gives you the same safety in plain JavaScript.

type Size = string; // TODO: allow only 'sm', 'md' and 'lg'

function sizeToPixels(size: Size): number {
  // TODO
  throw new Error('TODO: implement sizeToPixels');
}

// sizeToPixels('xl');

const Status = {
  Draft: 'draft',
  Published: 'published',
  Archived: 'archived',
} as const;

type Status = (typeof Status)[keyof typeof Status];

function nextStatus(status: Status): Status {
  // TODO
  throw new Error('TODO: implement nextStatus');
}

const statusLabels: Record<Status, string> = {
  [Status.Draft]: 'Draft',
  // TODO: add the labels for the other two statuses
};

// ---------------------------------------------------------------------------
// Exercise 2: Narrowing and type guards (concept 4.2)
// ---------------------------------------------------------------------------
// a) Implement `formatId`. Narrow with typeof: a number becomes '#' followed by the number
//    padded with zeros to 4 digits, and a string becomes '#' followed by the string in upper case.
//      formatId(7) -> '#0007'    formatId('ab12') -> '#AB12'    (hint: String(7).padStart(4, '0'))
//
// b) Implement the type guard `isAdmin`. Its return type `visitor is Admin` tells TypeScript:
//    "when this function returns true, the visitor is an Admin". Use the `in` operator: only
//    admins have a `permissions` property.
//
// c) Implement `adminPermissions`: all the permissions of all the admins in the list, in order.
//    visitors.filter(isAdmin) returns an Admin[], so TypeScript lets you read .permissions.
//      adminPermissions(visitors) -> ['edit', 'delete', 'edit']

function formatId(id: string | number): string {
  // TODO
  throw new Error('TODO: implement formatId');
}

interface Admin {
  name: string;
  permissions: string[];
}

interface Guest {
  name: string;
  expiresAt: string;
}

type Visitor = Admin | Guest;

const visitors: Visitor[] = [
  { name: 'Ada', permissions: ['edit', 'delete'] },
  { name: 'Grace', expiresAt: '2030-01-01' },
  { name: 'Alan', permissions: ['edit'] },
];

function isAdmin(visitor: Visitor): visitor is Admin {
  // TODO
  throw new Error('TODO: implement isAdmin');
}

function adminPermissions(visitors: Visitor[]): string[] {
  // TODO
  throw new Error('TODO: implement adminPermissions');
}

// ---------------------------------------------------------------------------
// Exercise 3: Discriminated unions and exhaustiveness checking (concept 4.3)
// ---------------------------------------------------------------------------
// `LoadState` describes data that is being loaded. Instead of several booleans (isLoading,
// hasError, ...) that could contradict each other, every state has a `status`, and only the
// 'success' state has items and only the 'error' state has a message.
//
// a) Implement `describeState` with a switch on state.status:
//      idle    -> 'Nothing loaded yet'
//      loading -> 'Loading...'
//      success -> 'Loaded 2 items'               (the number of items)
//      error   -> 'Error: Server unavailable'    (the message)
//    Inside each case, TypeScript knows which properties exist: state.items is only allowed in
//    the 'success' case. Finish with an exhaustiveness check: in the `default` branch, assign
//    `state` to a variable of type `never`. If a new status is added to LoadState later and
//    nobody handles it here, TypeScript reports an error on that line.
//
// b) Implement `itemCount`: the number of items for a 'success' state, otherwise 0.
//
// Try it: add `| { status: 'cancelled' }` to LoadState. TypeScript now reports an error in the
// default branch of describeState until you handle the new status. Remove it again afterwards.

type LoadState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; items: string[] }
  | { status: 'error'; message: string };

function describeState(state: LoadState): string {
  // TODO
  throw new Error('TODO: implement describeState');
}

function itemCount(state: LoadState): number {
  // TODO
  throw new Error('TODO: implement itemCount');
}

// ---------------------------------------------------------------------------
// Exercise 4: Non-null assertions and satisfies (concept 4.5)
// ---------------------------------------------------------------------------
// a) `prices.get(product)` returns number | undefined, because the product might be unknown.
//    A tempting shortcut is the non-null assertion: `return prices.get(product)!;`. It makes
//    the type error go away by telling TypeScript "trust me, this is never undefined", which is
//    a lie for 'kiwi'. Implement `priceOf` honestly instead: return the price, or null when the
//    product is unknown.
//      priceOf('apple') -> 0.5    priceOf('kiwi') -> null
//
// b) This task is checked by TypeScript only (there is no check for it below). `defaults` is
//    annotated with `: Config`, so TypeScript only remembers that `retries` MIGHT exist, and
//    `defaults.retries + 1` is an error ("possibly 'undefined'"). Remove the annotation and
//    write `satisfies Config` after the object instead. TypeScript still checks the object
//    against Config, but it keeps the exact type of what you wrote, including `retries`.

const prices = new Map<string, number>([
  ['apple', 0.5],
  ['pear', 0.75],
]);

function priceOf(product: string): number | null {
  // TODO
  throw new Error('TODO: implement priceOf');
}

interface Config {
  mode: 'development' | 'production';
  retries?: number;
}

const defaults: Config = { mode: 'development', retries: 3 }; // TODO: use `satisfies Config` instead

function maxAttempts(): number {
  return defaults.retries + 1;
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
check("1a sizeToPixels('sm')", () => sizeToPixels('sm'), 12);
check("1a sizeToPixels('md')", () => sizeToPixels('md'), 16);
check("1a sizeToPixels('lg')", () => sizeToPixels('lg'), 20);
check('1b nextStatus(Status.Draft)', () => nextStatus(Status.Draft), 'published');
check('1b nextStatus(Status.Published)', () => nextStatus(Status.Published), 'archived');
check('1b nextStatus(Status.Archived)', () => nextStatus(Status.Archived), 'archived');
check('1c statusLabels', () => statusLabels, { draft: 'Draft', published: 'Published', archived: 'Archived' });

// Exercise 2
check('2a formatId(7)', () => formatId(7), '#0007');
check('2a formatId(1234)', () => formatId(1234), '#1234');
check("2a formatId('ab12')", () => formatId('ab12'), '#AB12');
check('2b isAdmin(Ada, an admin)', () => isAdmin(visitors[0]), true);
check('2b isAdmin(Grace, a guest)', () => isAdmin(visitors[1]), false);
check('2c adminPermissions(visitors)', () => adminPermissions(visitors), ['edit', 'delete', 'edit']);

// Exercise 3
check("3a describeState({ status: 'idle' })", () => describeState({ status: 'idle' }), 'Nothing loaded yet');
check("3a describeState({ status: 'loading' })", () => describeState({ status: 'loading' }), 'Loading...');
check(
  "3a describeState({ status: 'success', ... })",
  () => describeState({ status: 'success', items: ['a', 'b'] }),
  'Loaded 2 items',
);
check(
  "3a describeState({ status: 'error', ... })",
  () => describeState({ status: 'error', message: 'Server unavailable' }),
  'Error: Server unavailable',
);
check("3b itemCount({ status: 'success', ... })", () => itemCount({ status: 'success', items: ['a', 'b', 'c'] }), 3);
check("3b itemCount({ status: 'error', ... })", () => itemCount({ status: 'error', message: 'Oops' }), 0);

// Exercise 4
check("4a priceOf('apple')", () => priceOf('apple'), 0.5);
check("4a priceOf('kiwi')", () => priceOf('kiwi'), null);

console.log(`\n${passed} passed, ${failed} failed`);
if (failed === 0) console.log('All checks pass. Well done! 🎉');
