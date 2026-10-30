/**
 * Solutions – Part 4: Unions, narrowing and modeling data
 * (concepts 4.1–4.5 in JS-TS-Concepts.md)
 *
 * Try exercises-part-4.ts on your own first. Your solution doesn't have to match this one
 * exactly: if all checks pass and the type check reports no errors, your solution is fine.
 *
 *   Run:        node exercises-part-4-solved.ts
 *   Type check: npx -p typescript tsc --ignoreConfig --noEmit exercises-part-4-solved.ts
 */

export {}; // makes this file a module, so its names don't clash with other exercise files

// ---------------------------------------------------------------------------
// Exercise 1: Literal unions and `as const` objects (concepts 4.1 and 4.4)
// ---------------------------------------------------------------------------

type Size = 'sm' | 'md' | 'lg';

function sizeToPixels(size: Size): number {
  switch (size) {
    case 'sm':
      return 12;
    case 'md':
      return 16;
    case 'lg':
      return 20;
  }
  // No return needed here: TypeScript knows the three cases cover every possible Size.
}

// sizeToPixels('xl'); // Error: Argument of type '"xl"' is not assignable to parameter of type 'Size'.

const Status = {
  Draft: 'draft',
  Published: 'published',
  Archived: 'archived',
} as const;

type Status = (typeof Status)[keyof typeof Status];

function nextStatus(status: Status): Status {
  if (status === Status.Draft) return Status.Published;
  return Status.Archived; // published moves on to archived, and archived stays archived
}

const statusLabels: Record<Status, string> = {
  [Status.Draft]: 'Draft',
  [Status.Published]: 'Published',
  [Status.Archived]: 'Archived',
};

// ---------------------------------------------------------------------------
// Exercise 2: Narrowing and type guards (concept 4.2)
// ---------------------------------------------------------------------------

function formatId(id: string | number): string {
  if (typeof id === 'number') {
    return '#' + String(id).padStart(4, '0'); // here, id is a number
  }
  return '#' + id.toUpperCase(); // here, id can only be a string
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
  return 'permissions' in visitor;
}

function adminPermissions(visitors: Visitor[]): string[] {
  // filter(isAdmin) narrows the array to Admin[], so .permissions is allowed
  return visitors.filter(isAdmin).flatMap((admin) => admin.permissions);
}

// ---------------------------------------------------------------------------
// Exercise 3: Discriminated unions and exhaustiveness checking (concept 4.3)
// ---------------------------------------------------------------------------

type LoadState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; items: string[] }
  | { status: 'error'; message: string };

function describeState(state: LoadState): string {
  switch (state.status) {
    case 'idle':
      return 'Nothing loaded yet';
    case 'loading':
      return 'Loading...';
    case 'success':
      return `Loaded ${state.items.length} items`; // only this case knows about `items`
    case 'error':
      return `Error: ${state.message}`; // only this case knows about `message`
    default: {
      // Every status is handled above, so `state` has the type never here. A new, unhandled
      // status would make this assignment a type error.
      const unhandled: never = state;
      return unhandled;
    }
  }
}

function itemCount(state: LoadState): number {
  return state.status === 'success' ? state.items.length : 0;
}

// ---------------------------------------------------------------------------
// Exercise 4: Non-null assertions and satisfies (concept 4.5)
// ---------------------------------------------------------------------------

const prices = new Map<string, number>([
  ['apple', 0.5],
  ['pear', 0.75],
]);

function priceOf(product: string): number | null {
  // Handle the undefined case instead of hiding it with `!`
  return prices.get(product) ?? null;
}

interface Config {
  mode: 'development' | 'production';
  retries?: number;
}

const defaults = { mode: 'development', retries: 3 } satisfies Config;

function maxAttempts(): number {
  return defaults.retries + 1; // fine now: TypeScript knows that defaults.retries is a number
}

// ===========================================================================
// Checks: the same checks as in exercises-part-4.ts
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
