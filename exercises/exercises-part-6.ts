/**
 * Exercises – Part 6: Generics and deriving types
 * (concepts 6.1–6.3 in JS-TS-Concepts.md)
 *
 * How to work through this file:
 *   1. Solve the exercises from top to bottom. Each one explains what to write; look for "TODO".
 *   2. Run the file to see which checks pass. Node.js 22.18 or newer runs TypeScript directly:
 *        node exercises-part-6.ts
 *      (On an older Node.js version, use: npx tsx exercises-part-6.ts)
 *   3. Check your types too. Your editor underlines type errors in red, using the settings in
 *      tsconfig.json (in this folder). To check just this file in the terminal, run:
 *        npx -p typescript tsc --ignoreConfig --noEmit exercises-part-6.ts
 *      Type errors in exercises you haven't solved yet are normal. Some exercises are about
 *      fixing exactly those errors.
 *   4. You're done when every check shows ✅ and the type check reports no errors.
 *
 * Stuck? Compare your code with exercises-part-6-solved.ts.
 */

export {}; // makes this file a module, so its names don't clash with other exercise files

// ---------------------------------------------------------------------------
// Exercise 1: Generic functions and constraints (concept 6.1)
// ---------------------------------------------------------------------------
// a) `first` returns the first item of an array, or undefined when the array is empty. With
//    the type unknown, it accepts any array, but TypeScript forgets what was in the array:
//    that's why `firstLetter` below has a type error. Make first generic, with a type
//    parameter T:
//      function first<T>(items: T[]): T | undefined
//    TypeScript then infers T from the argument: for first(['Ada', 'Grace']), T is string, and
//    the error in firstLetter disappears. Then implement first.
//      first([3, 1, 2]) -> 3    first([]) -> undefined
//
// b) Implement `longest`: it returns the longer of two values, or `a` when both are equally
//    long. It should work for everything that has a length, like strings and arrays. When you
//    use a.length, TypeScript reports an error: T could be anything, even a number, and a
//    number has no length. Add a constraint, so that T must have a length:
//      function longest<T extends { length: number }>(a: T, b: T): T
//      longest('apple', 'fig') -> 'apple'    longest([1, 2], [1, 2, 3]) -> [1, 2, 3]
//    Try it: when you're done, uncomment the line `// longest(10, 20);`. TypeScript reports an
//    error, because a number has no length. Comment it out again afterwards.

function first(items: unknown[]): unknown {
  // TODO
  throw new Error('TODO: implement first');
}

// Uses first(). TypeScript accepts this code only once first() is generic.
function firstLetter(names: string[]): string {
  const name: string | undefined = first(names);
  return name?.charAt(0) ?? '';
}

function longest<T>(a: T, b: T): T {
  // TODO
  throw new Error('TODO: implement longest');
}

// longest(10, 20);

// ---------------------------------------------------------------------------
// Exercise 2: Generic types and type arguments (concept 6.1)
// ---------------------------------------------------------------------------
// a) Interfaces and classes can have type parameters too. Page<T> is one page of a longer
//    list, for example Page<string> or Page<Book>. Complete the interface with three
//    properties: items (an array of T), page (the page number) and hasMore (true when more
//    items follow). `pageLabel` below shows type errors until then. Then implement
//    `paginate`: page number `page` of `items` (counting from 1), with `size` items per page.
//    Hint: items.slice(start, end).
//      paginate(['a', 'b', 'c', 'd', 'e'], 1, 2) -> { items: ['a', 'b'], page: 1, hasMore: true }
//      paginate(['a', 'b', 'c', 'd', 'e'], 3, 2) -> { items: ['e'], page: 3, hasMore: false }
//
// b) This task is checked by TypeScript only (there is no check for it below). `Stack<T>` is a
//    generic class. TypeScript infers T from the arguments, but `new Stack()` has none, so T
//    falls back to unknown. That's why `lastVisited` has a type error. Pass the type argument
//    yourself: new Stack<string>(). Built-in generic classes work the same way, for example
//    new Map<string, number>() or new Set<string>().

interface Page<T> {
  // TODO: items, page and hasMore
}

function paginate<T>(items: T[], page: number, size: number): Page<T> {
  // TODO
  throw new Error('TODO: implement paginate');
}

// Uses Page<T>. TypeScript accepts this code only once Page<T> is complete.
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
  const visited = new Stack(); // TODO: pass the type argument string
  for (const page of pages) visited.push(page);
  const last: string | undefined = visited.peek();
  return last ?? 'nothing';
}

// ---------------------------------------------------------------------------
// Exercise 3: keyof, typeof and indexed access types (concept 6.2)
// ---------------------------------------------------------------------------
// a) `pluck` returns the value of one property from every item:
//      pluck(books, 'title') -> ['Dune', 'Emma', 'Ulysses']
//      pluck(books, 'year') -> [1965, 1815, 1922]
//    With these parameter types, TypeScript can't check that the key exists, and it doesn't
//    know the type of the values: that's why `oldestYear` below has a type error. Make pluck
//    generic, with a type parameter for the items and one for the key:
//      function pluck<T, K extends keyof T>(items: T[], key: K): T[K][]
//    keyof T is the union of T's property names, so `K extends keyof T` allows only existing
//    keys. T[K] is the type of that property: pluck(books, 'year') returns a number[].
//    Then implement pluck.
//    Try it: when you're done, uncomment the line `// pluck(books, 'price');`. TypeScript
//    reports an error, because a Book has no price. Comment it out again afterwards.
//
// b) A type that repeats a value can get out of sync with it. Derive the types from the value
//    instead, so that `defaultSettings` stays the only place that lists the settings:
//      - Settings: replace Record<string, unknown> with `typeof defaultSettings`. Used in a
//        type, typeof gives you the type of a value:
//        { theme: string; fontSize: number; autoSave: boolean }
//      - SettingName: replace string with `keyof Settings`: 'theme' | 'fontSize' | 'autoSave'
//    `largerFont` below shows a type error until both types are derived. Then implement
//    `changeSetting`: return a NEW settings object in which `name` has the new value
//    (hint: { ...settings, [name]: value }). The parameter type Settings[K] makes sure that
//    the value fits the setting.
//      changeSetting(defaultSettings, 'fontSize', 16)
//        -> { theme: 'light', fontSize: 16, autoSave: true }
//    Try it: when you're done, uncomment `// changeSetting(defaultSettings, 'fontSize', 'big');`.
//    TypeScript reports an error, because a font size must be a number.

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

function pluck(items: object[], key: string): unknown[] {
  // TODO
  throw new Error('TODO: implement pluck');
}

// Uses pluck(). TypeScript accepts this code only once pluck() is generic.
function oldestYear(books: Book[]): number {
  return Math.min(...pluck(books, 'year'));
}

// pluck(books, 'price');

const defaultSettings = { theme: 'light', fontSize: 14, autoSave: true };

type Settings = Record<string, unknown>; // TODO: derive it from defaultSettings
type SettingName = string; // TODO: derive it from Settings

function changeSetting<K extends SettingName>(settings: Settings, name: K, value: Settings[K]): Settings {
  // TODO
  throw new Error('TODO: implement changeSetting');
}

// Uses Settings. TypeScript accepts this code only once Settings and SettingName are derived.
function largerFont(settings: Settings): Settings {
  return changeSetting(settings, 'fontSize', settings.fontSize + 2);
}

// changeSetting(defaultSettings, 'fontSize', 'big');

// ---------------------------------------------------------------------------
// Exercise 4: Utility types (concept 6.3)
// ---------------------------------------------------------------------------
// Utility types build new types from existing ones. Then `Product` stays the only place that
// lists the fields, and every type built from it follows its changes automatically:
//   Omit<T, Keys>    T without some of its properties
//   Pick<T, Keys>    only some of the properties of T
//   Partial<T>       all the properties of T, but optional
//   Readonly<T>      all the properties of T, but read-only
//   ReturnType<F>    the type that the function type F returns
//
// a) Replace unknown in the two types below with utility types based on Product:
//      - NewProduct: a Product without its id, because the shop assigns the id.
//      - ProductChanges: the fields that may change (all except id), each one optional.
//        Combine two utility types for this one.
//    The sample data below the types also tests them: it shows errors until your types are
//    right. The line after `// @ts-expect-error` MUST be a type error. If it isn't, TypeScript
//    reports "Unused '@ts-expect-error' directive", which means that your type still allows
//    too much.
//    Then implement `createProduct` (the product with the given id) and `updateProduct` (a NEW
//    product with the changes applied).
//      createProduct(2, newDesk) -> { id: 2, name: 'Desk', price: 120, inStock: false }
//      updateProduct(lamp, priceChange) -> { id: 1, name: 'Lamp', price: 25, inStock: true }
//
// b) Sometimes a type exists only as the return type of a function, for example a function
//    from a library that doesn't export a type for its result. ReturnType<typeof createSession>
//    gives you that type, without writing it again. Replace unknown in `Session` with it.
//    Then implement `describeSession`.
//      describeSession(createSession('Ada')) -> 'Ada (reader, writer)'

interface Product {
  id: number;
  name: string;
  price: number;
  inStock: boolean;
}

type NewProduct = unknown; // TODO: a Product without id
type ProductChanges = unknown; // TODO: all the fields except id, each one optional

// Sample data. It also tests your types: once they are right, TypeScript reports no errors here.
const lamp: Product = { id: 1, name: 'Lamp', price: 30, inStock: true };
const newDesk: NewProduct = { name: 'Desk', price: 120, inStock: false };
// @ts-expect-error: a NewProduct has no id
const newDeskWithId: NewProduct = { id: 2, name: 'Desk', price: 120, inStock: false };
const priceChange: ProductChanges = { price: 25 };
// @ts-expect-error: the id can't change
const idChange: ProductChanges = { id: 3 };

function createProduct(id: number, data: NewProduct): Product {
  // TODO
  throw new Error('TODO: implement createProduct');
}

function updateProduct(product: Product, changes: ProductChanges): Product {
  // TODO
  throw new Error('TODO: implement updateProduct');
}

function createSession(user: string) {
  return { user, roles: ['reader', 'writer'], expiresInMinutes: 30 };
}

type Session = unknown; // TODO: the type that createSession returns

function describeSession(session: Session): string {
  // TODO
  throw new Error('TODO: implement describeSession');
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
