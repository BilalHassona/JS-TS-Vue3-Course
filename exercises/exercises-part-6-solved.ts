/**
 * Solutions – Part 6: Generics and deriving types
 * (concepts 6.1–6.3 in JS-TS-Concepts.md)
 *
 * Try exercises-part-6.ts on your own first. Your solution doesn't have to match this one
 * exactly: if all checks pass and the type check reports no errors, your solution is fine.
 *
 *   Run:        node exercises-part-6-solved.ts
 *   Type check: npx -p typescript tsc --ignoreConfig --noEmit exercises-part-6-solved.ts
 */

export {}; // makes this file a module, so its names don't clash with other exercise files

// ---------------------------------------------------------------------------
// Exercise 1: Generic functions and constraints (concept 6.1)
// ---------------------------------------------------------------------------

function first<T>(items: T[]): T | undefined {
  return items[0]; // undefined for an empty array
}

function firstLetter(names: string[]): string {
  const name: string | undefined = first(names); // T is string here, inferred from `names`
  return name?.charAt(0) ?? '';
}

function longest<T extends { length: number }>(a: T, b: T): T {
  return b.length > a.length ? b : a; // the constraint allows .length: every T has one
}

// longest(10, 20);
// -> Error: Argument of type 'number' is not assignable to parameter of type '{ length: number; }'.

// ---------------------------------------------------------------------------
// Exercise 2: Generic types and type arguments (concept 6.1)
// ---------------------------------------------------------------------------

interface Page<T> {
  items: T[];
  page: number;
  hasMore: boolean;
}

function paginate<T>(items: T[], page: number, size: number): Page<T> {
  const start = (page - 1) * size; // page 1 starts at index 0
  const end = start + size;
  return { items: items.slice(start, end), page, hasMore: end < items.length };
}

function pageLabel(page: Page<string>): string {
  const names: string[] = page.items;
  return `Page ${page.page}: ${names.join(', ')}${page.hasMore ? ', ...' : ''}`;
}

class Stack<T> {
  #items: T[] = [];

  push(item: T): void {
    this.#items.push(item);
  }

  peek(): T | undefined {
    return this.#items[this.#items.length - 1]; // the item on top, without removing it
  }
}

function lastVisited(pages: string[]): string {
  const visited = new Stack<string>(); // no argument to infer T from, so we pass T ourselves
  for (const page of pages) visited.push(page);
  const last: string | undefined = visited.peek();
  return last ?? 'nothing';
}

// ---------------------------------------------------------------------------
// Exercise 3: keyof, typeof and indexed access types (concept 6.2)
// ---------------------------------------------------------------------------

interface Book {
  title: string;
  author: string;
  year: number;
}

const books: Book[] = [
  { title: 'Dune', author: 'Frank Herbert', year: 1965 },
  { title: 'Emma', author: 'Jane Austen', year: 1815 },
  { title: 'Ulysses', author: 'James Joyce', year: 1922 },
];

function pluck<T, K extends keyof T>(items: T[], key: K): T[K][] {
  return items.map((item) => item[key]); // allowed, because K is a key of T
}

function oldestYear(books: Book[]): number {
  return Math.min(...pluck(books, 'year')); // pluck returns number[] here
}

// pluck(books, 'price');
// -> Error: Argument of type '"price"' is not assignable to parameter of type 'keyof Book'.

const defaultSettings = { theme: 'light', fontSize: 14, autoSave: true };

type Settings = typeof defaultSettings; // { theme: string; fontSize: number; autoSave: boolean }
type SettingName = keyof Settings; // 'theme' | 'fontSize' | 'autoSave'

function changeSetting<K extends SettingName>(settings: Settings, name: K, value: Settings[K]): Settings {
  return { ...settings, [name]: value }; // a copy, with the new value for `name`
}

function largerFont(settings: Settings): Settings {
  return changeSetting(settings, 'fontSize', settings.fontSize + 2); // settings.fontSize is a number
}

// changeSetting(defaultSettings, 'fontSize', 'big');
// -> Error: Argument of type 'string' is not assignable to parameter of type 'number'.

// ---------------------------------------------------------------------------
// Exercise 4: Utility types (concept 6.3)
// ---------------------------------------------------------------------------

interface Product {
  id: number;
  name: string;
  price: number;
  inStock: boolean;
}

type NewProduct = Omit<Product, 'id'>;
type ProductChanges = Partial<Omit<Product, 'id'>>;

// Sample data. It also tests your types: once they are right, TypeScript reports no errors here.
const lamp: Product = { id: 1, name: 'Lamp', price: 30, inStock: true };
const newDesk: NewProduct = { name: 'Desk', price: 120, inStock: false };
// @ts-expect-error: a NewProduct has no id
const newDeskWithId: NewProduct = { id: 2, name: 'Desk', price: 120, inStock: false };
const priceChange: ProductChanges = { price: 25 };
// @ts-expect-error: the id can't change
const idChange: ProductChanges = { id: 3 };

function createProduct(id: number, data: NewProduct): Product {
  return { id, ...data };
}

function updateProduct(product: Product, changes: ProductChanges): Product {
  return { ...product, ...changes }; // later properties win, so the changes replace the old values
}

function createSession(user: string) {
  return { user, roles: ['reader', 'writer'], expiresInMinutes: 30 };
}

type Session = ReturnType<typeof createSession>; // { user: string; roles: string[]; expiresInMinutes: number }

function describeSession(session: Session): string {
  return `${session.user} (${session.roles.join(', ')})`;
}

// ===========================================================================
// Checks: the same checks as in exercises-part-6.ts
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
check('1a first([3, 1, 2])', () => first([3, 1, 2]), 3);
check('1a first([])', () => first([]), undefined);
check("1b longest('apple', 'fig')", () => longest('apple', 'fig'), 'apple');
check('1b longest([1, 2], [1, 2, 3])', () => longest([1, 2], [1, 2, 3]), [1, 2, 3]);
check("1b longest('ab', 'cd'), both equally long", () => longest('ab', 'cd'), 'ab');

// Exercise 2
check("2a paginate(['a', 'b', 'c', 'd', 'e'], 1, 2)", () => paginate(['a', 'b', 'c', 'd', 'e'], 1, 2), {
  items: ['a', 'b'],
  page: 1,
  hasMore: true,
});
check("2a paginate(['a', 'b', 'c', 'd', 'e'], 3, 2)", () => paginate(['a', 'b', 'c', 'd', 'e'], 3, 2), {
  items: ['e'],
  page: 3,
  hasMore: false,
});

// Exercise 3
check("3a pluck(books, 'title')", () => pluck(books, 'title'), ['Dune', 'Emma', 'Ulysses']);
check("3a pluck(books, 'year')", () => pluck(books, 'year'), [1965, 1815, 1922]);
check("3b changeSetting(defaultSettings, 'fontSize', 16)", () => changeSetting(defaultSettings, 'fontSize', 16), {
  theme: 'light',
  fontSize: 16,
  autoSave: true,
});
check(
  "3b changeSetting(defaultSettings, 'theme', 'dark') leaves defaultSettings unchanged",
  () => {
    changeSetting(defaultSettings, 'theme', 'dark');
    return defaultSettings;
  },
  { theme: 'light', fontSize: 14, autoSave: true },
);

// Exercise 4
check('4a createProduct(2, newDesk)', () => createProduct(2, newDesk), {
  id: 2,
  name: 'Desk',
  price: 120,
  inStock: false,
});
check('4a updateProduct(lamp, priceChange)', () => updateProduct(lamp, priceChange), {
  id: 1,
  name: 'Lamp',
  price: 25,
  inStock: true,
});
check(
  '4a updateProduct(lamp, priceChange) leaves lamp unchanged',
  () => {
    updateProduct(lamp, priceChange);
    return lamp;
  },
  { id: 1, name: 'Lamp', price: 30, inStock: true },
);
check("4b describeSession(createSession('Ada'))", () => describeSession(createSession('Ada')), 'Ada (reader, writer)');

console.log(`\n${passed} passed, ${failed} failed`);
if (failed === 0) console.log('All checks pass. Well done! 🎉');
