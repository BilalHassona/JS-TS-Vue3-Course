/**
 * Exercises – Part 2: Modern JavaScript for working with data
 * (concepts 2.1–2.6 in JS-TS-Concepts.md)
 *
 * How to work through this file:
 *   1. Solve the exercises from top to bottom. Each one explains what to write; look for "TODO".
 *   2. Run the file to see which checks pass. Node.js 22.18 or newer runs TypeScript directly:
 *        node exercises-part-2.ts
 *      (On an older Node.js version, use: npx tsx exercises-part-2.ts)
 *   3. Check your types too. Your editor underlines type errors in red, using the settings in
 *      tsconfig.json (in this folder). To check just this file in the terminal, run:
 *        npx -p typescript tsc --ignoreConfig --noEmit exercises-part-2.ts
 *      Type errors in exercises you haven't solved yet are normal. Some exercises are about
 *      fixing exactly those errors.
 *   4. You're done when every check shows ✅ and the type check reports no errors.
 *
 * Stuck? Compare your code with exercises-part-2-solved.ts.
 */

export {}; // makes this file a module, so its names don't clash with other exercise files

// ---------------------------------------------------------------------------
// Exercise 1: Destructuring (concept 2.1)
// ---------------------------------------------------------------------------
// a) Replace the parameter `book: Book` of `describeBook` with a destructuring pattern, so you
//    can use title, year, rating, firstName and lastName directly. Give `rating` a default
//    value of 0. Nested objects can be destructured too: { author: { firstName } }.
//      describeBook(dune) -> 'Dune by Frank Herbert (1965), rating: 0'
//
// b) Implement `parseCoordinates`: split the text at the comma, use array destructuring to
//    get the two parts, and convert them with Number().
//      parseCoordinates('48.21,16.37') -> { lat: 48.21, lng: 16.37 }

interface Book {
  title: string;
  year: number;
  rating?: number;
  author: { firstName: string; lastName: string };
}

const dune: Book = { title: 'Dune', year: 1965, author: { firstName: 'Frank', lastName: 'Herbert' } };
const hobbit: Book = {
  title: 'The Hobbit',
  year: 1937,
  rating: 5,
  author: { firstName: 'J.R.R.', lastName: 'Tolkien' },
};

function describeBook(book: Book): string {
  // TODO
  throw new Error('TODO: implement describeBook');
}

function parseCoordinates(text: string): { lat: number; lng: number } {
  // TODO
  throw new Error('TODO: implement parseCoordinates');
}

// ---------------------------------------------------------------------------
// Exercise 2: Spread and rest (concept 2.2)
// ---------------------------------------------------------------------------
// a) Implement `sumAll`. Its rest parameter `...numbers: number[]` collects all the arguments
//    into one array, so the function accepts any number of them: sumAll(4, 5, 6) gives you
//    numbers = [4, 5, 6]. In the third example, spread syntax does the opposite: it turns the
//    array `scores` into separate arguments.
//      sumAll() -> 0    sumAll(4, 5, 6) -> 15    sumAll(...scores) -> 60
//
// b) Implement `withSettings`: return a NEW object that starts with all the defaults and
//    replaces only the values given in `overrides`. Use object spread, and don't change
//    `defaults`. `Partial<Settings>` means "the properties of Settings, all optional".
//      withSettings(defaultSettings, { fontSize: 18 })
//        -> { theme: 'light', fontSize: 18, showHints: true }

function sumAll(...numbers: number[]): number {
  // TODO
  throw new Error('TODO: implement sumAll');
}

const scores = [10, 20, 30];

interface Settings {
  theme: string;
  fontSize: number;
  showHints: boolean;
}

const defaultSettings: Settings = { theme: 'light', fontSize: 14, showHints: true };

function withSettings(defaults: Settings, overrides: Partial<Settings>): Settings {
  // TODO
  throw new Error('TODO: implement withSettings');
}

// ---------------------------------------------------------------------------
// Exercise 3: Working with objects (concept 2.3)
// ---------------------------------------------------------------------------
// a) Implement `applyDiscount`: return a NEW object with the same keys, where every price is
//    reduced by `percent` percent. Turn the object into [key, value] pairs with
//    Object.entries(), change the prices with map(), and turn the pairs back into an object
//    with Object.fromEntries(). To avoid rounding problems, calculate a new price as
//    price * (100 - percent) / 100.
//      applyDiscount({ book: 20, pen: 4.5 }, 10) -> { book: 18, pen: 4.05 }
//
// b) Implement `countWords`: count how often each word appears, using the word as a key.
//      countWords(['tea', 'coffee', 'tea']) -> { tea: 2, coffee: 1 }

function applyDiscount(prices: Record<string, number>, percent: number): Record<string, number> {
  // TODO
  throw new Error('TODO: implement applyDiscount');
}

function countWords(words: string[]): Record<string, number> {
  // TODO
  throw new Error('TODO: implement countWords');
}

// ---------------------------------------------------------------------------
// Exercise 4: Optional chaining and nullish coalescing (concept 2.4)
// ---------------------------------------------------------------------------
// a) Implement `cityOf`: return the customer's city, or 'Unknown city' when the customer, the
//    address or the city is missing. With ?. and ?? this takes a single line.
//
// b) Implement `getVolume`: return settings.volume, or 50 when no volume is set.
//    Careful: a volume of 0 is a valid choice (muted). `settings.volume || 50` would turn 0
//    into 50, because 0 is falsy. `??` only falls back for null and undefined.
//      getVolume({}) -> 50    getVolume({ volume: 0 }) -> 0    getVolume({ volume: 80 }) -> 80

interface Customer {
  name: string;
  address?: { city?: string };
}

function cityOf(customer?: Customer): string {
  // TODO
  throw new Error('TODO: implement cityOf');
}

interface AudioSettings {
  volume?: number;
}

function getVolume(settings: AudioSettings): number {
  // TODO
  throw new Error('TODO: implement getVolume');
}

// ---------------------------------------------------------------------------
// Exercise 5: Array methods (concept 2.5)
// ---------------------------------------------------------------------------
// Use array methods (filter, map, reduce, toSorted, ...) instead of for loops.
// a) `inStockNames`: the names of the products that are in stock.
//      inStockNames(products) -> ['Keyboard', 'Mouse', 'Laptop']
// b) `totalPrice`: the sum of all prices.
//      totalPrice(products) -> 1272
// c) `cheapestFirst`: a NEW array sorted by price, lowest first. The original array must keep
//    its order, so use toSorted() instead of sort(): sort() changes the array it is called on.
//      cheapestFirst(products) -> Mouse, Keyboard, Monitor, Laptop

interface Product {
  name: string;
  price: number;
  inStock: boolean;
}

const products: Product[] = [
  { name: 'Keyboard', price: 49, inStock: true },
  { name: 'Monitor', price: 199, inStock: false },
  { name: 'Mouse', price: 25, inStock: true },
  { name: 'Laptop', price: 999, inStock: true },
];

function inStockNames(products: Product[]): string[] {
  // TODO
  throw new Error('TODO: implement inStockNames');
}

function totalPrice(products: Product[]): number {
  // TODO
  throw new Error('TODO: implement totalPrice');
}

function cheapestFirst(products: Product[]): Product[] {
  // TODO
  throw new Error('TODO: implement cheapestFirst');
}

// ---------------------------------------------------------------------------
// Exercise 6: References, copying and immutability (concept 2.6)
// ---------------------------------------------------------------------------
// a) Implement `addTag`: return a NEW post with `tag` added at the end of `tags`. The original
//    post and its tags array must stay unchanged, so don't call push() on them. Copy the
//    object with spread, and build the new tags array with spread as well.
//
// b) Implement `copyTeam`: return a deep copy of the team, so that changing the copy (even the
//    skills of a member) never changes the original. A spread copy ({ ...team }) is not enough
//    here: it only copies the top level, so the copy would share the members array.
//    Use structuredClone().
//
// c) Try it: TypeScript can block changes at compile time. Uncomment the function below.
//    TypeScript reports an error on push(), because the parameter is a readonly array.

interface Post {
  title: string;
  tags: string[];
}

const post: Post = { title: 'Hello', tags: ['intro'] };

function addTag(post: Post, tag: string): Post {
  // TODO
  throw new Error('TODO: implement addTag');
}

interface Member {
  name: string;
  skills: string[];
}

interface Team {
  name: string;
  members: Member[];
}

const team: Team = { name: 'Blue', members: [{ name: 'Ada', skills: ['TypeScript'] }] };

function copyTeam(team: Team): Team {
  // TODO
  throw new Error('TODO: implement copyTeam');
}

// function addScore(scores: readonly number[]): void {
//   scores.push(100);
// }

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
check('1a describeBook(dune)', () => describeBook(dune), 'Dune by Frank Herbert (1965), rating: 0');
check('1a describeBook(hobbit)', () => describeBook(hobbit), 'The Hobbit by J.R.R. Tolkien (1937), rating: 5');
check("1b parseCoordinates('48.21,16.37')", () => parseCoordinates('48.21,16.37'), { lat: 48.21, lng: 16.37 });
check("1b parseCoordinates('51.5, -0.12')", () => parseCoordinates('51.5, -0.12'), { lat: 51.5, lng: -0.12 });

// Exercise 2
check('2a sumAll()', () => sumAll(), 0);
check('2a sumAll(4, 5, 6)', () => sumAll(4, 5, 6), 15);
check('2a sumAll(...scores)', () => sumAll(...scores), 60);
check('2b withSettings(defaultSettings, { fontSize: 18 })', () => withSettings(defaultSettings, { fontSize: 18 }), {
  theme: 'light',
  fontSize: 18,
  showHints: true,
});
check(
  "2b withSettings(defaultSettings, { theme: 'dark', showHints: false })",
  () => withSettings(defaultSettings, { theme: 'dark', showHints: false }),
  { theme: 'dark', fontSize: 14, showHints: false },
);
check(
  '2b defaultSettings is unchanged',
  () => {
    withSettings(defaultSettings, { theme: 'dark' });
    return defaultSettings;
  },
  { theme: 'light', fontSize: 14, showHints: true },
);

// Exercise 3
check('3a applyDiscount({ book: 20, pen: 4.5 }, 10)', () => applyDiscount({ book: 20, pen: 4.5 }, 10), {
  book: 18,
  pen: 4.05,
});
check('3a applyDiscount({ mug: 8 }, 50)', () => applyDiscount({ mug: 8 }, 50), { mug: 4 });
check(
  '3a the original prices are unchanged',
  () => {
    const prices = { book: 20 };
    applyDiscount(prices, 10);
    return prices;
  },
  { book: 20 },
);
check("3b countWords(['tea', 'coffee', 'tea'])", () => countWords(['tea', 'coffee', 'tea']), { tea: 2, coffee: 1 });
check('3b countWords([])', () => countWords([]), {});

// Exercise 4
check('4a cityOf(a customer with a city)', () => cityOf({ name: 'Ada', address: { city: 'London' } }), 'London');
check('4a cityOf(a customer without a city)', () => cityOf({ name: 'Alan', address: {} }), 'Unknown city');
check('4a cityOf(a customer without an address)', () => cityOf({ name: 'Grace' }), 'Unknown city');
check('4a cityOf()', () => cityOf(), 'Unknown city');
check('4b getVolume({})', () => getVolume({}), 50);
check('4b getVolume({ volume: 0 })', () => getVolume({ volume: 0 }), 0);
check('4b getVolume({ volume: 80 })', () => getVolume({ volume: 80 }), 80);

// Exercise 5
check('5a inStockNames(products)', () => inStockNames(products), ['Keyboard', 'Mouse', 'Laptop']);
check('5b totalPrice(products)', () => totalPrice(products), 1272);
check(
  '5c cheapestFirst(products)',
  () => cheapestFirst(products).map((product) => product.name),
  ['Mouse', 'Keyboard', 'Monitor', 'Laptop'],
);
check(
  '5c the original array keeps its order',
  () => {
    cheapestFirst(products);
    return products.map((product) => product.name);
  },
  ['Keyboard', 'Monitor', 'Mouse', 'Laptop'],
);

// Exercise 6
check("6a addTag(post, 'news').tags", () => addTag(post, 'news').tags, ['intro', 'news']);
check(
  '6a the original post is unchanged',
  () => {
    addTag(post, 'news');
    return post;
  },
  { title: 'Hello', tags: ['intro'] },
);
check('6a addTag returns a new object', () => addTag(post, 'news') !== post, true);
check('6b copyTeam(team) has the same content', () => copyTeam(team), {
  name: 'Blue',
  members: [{ name: 'Ada', skills: ['TypeScript'] }],
});
check(
  "6b changing the copy doesn't change the original",
  () => {
    const copy = copyTeam(team);
    copy.members[0].skills.push('Rust');
    return team.members[0].skills;
  },
  ['TypeScript'],
);

console.log(`\n${passed} passed, ${failed} failed`);
if (failed === 0) console.log('All checks pass. Well done! 🎉');
