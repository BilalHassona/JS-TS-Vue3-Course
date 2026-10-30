/**
 * Solutions – Part 2: Modern JavaScript for working with data
 * (concepts 2.1–2.6 in JS-TS-Concepts.md)
 *
 * Try exercises-part-2.ts on your own first. Your solution doesn't have to match this one
 * exactly: if all checks pass and the type check reports no errors, your solution is fine.
 *
 *   Run:        node exercises-part-2-solved.ts
 *   Type check: npx -p typescript tsc --ignoreConfig --noEmit exercises-part-2-solved.ts
 */

export {}; // makes this file a module, so its names don't clash with other exercise files

// ---------------------------------------------------------------------------
// Exercise 1: Destructuring (concept 2.1)
// ---------------------------------------------------------------------------

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

// The pattern unpacks the book right in the parameter list. `rating = 0` is used when the
// book has no rating, and `author: { firstName, lastName }` unpacks the nested object.
function describeBook({ title, year, rating = 0, author: { firstName, lastName } }: Book): string {
  return `${title} by ${firstName} ${lastName} (${year}), rating: ${rating}`;
}

function parseCoordinates(text: string): { lat: number; lng: number } {
  const [lat, lng] = text.split(','); // the first two parts of the array
  return { lat: Number(lat), lng: Number(lng) }; // Number() ignores the space in ' -0.12'
}

// ---------------------------------------------------------------------------
// Exercise 2: Spread and rest (concept 2.2)
// ---------------------------------------------------------------------------

function sumAll(...numbers: number[]): number {
  // All arguments arrive as one array: sumAll(4, 5, 6) -> numbers is [4, 5, 6]
  let total = 0;
  for (const n of numbers) total += n;
  return total;
}

const scores = [10, 20, 30];

interface Settings {
  theme: string;
  fontSize: number;
  showHints: boolean;
}

const defaultSettings: Settings = { theme: 'light', fontSize: 14, showHints: true };

function withSettings(defaults: Settings, overrides: Partial<Settings>): Settings {
  // Later properties win, so the overrides replace the defaults. Neither object is changed.
  return { ...defaults, ...overrides };
}

// ---------------------------------------------------------------------------
// Exercise 3: Working with objects (concept 2.3)
// ---------------------------------------------------------------------------

function applyDiscount(prices: Record<string, number>, percent: number): Record<string, number> {
  // Object.entries({ book: 20 }) -> [['book', 20]]. The return type [string, number] tells
  // TypeScript that each new entry is a key/value pair (a tuple, concept 1.4).
  const discounted = Object.entries(prices).map(
    ([item, price]): [string, number] => [item, (price * (100 - percent)) / 100],
  );
  return Object.fromEntries(discounted);
}

function countWords(words: string[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const word of words) {
    counts[word] = (counts[word] ?? 0) + 1; // a word seen for the first time has no count yet
  }
  return counts;
}

// ---------------------------------------------------------------------------
// Exercise 4: Optional chaining and nullish coalescing (concept 2.4)
// ---------------------------------------------------------------------------

interface Customer {
  name: string;
  address?: { city?: string };
}

function cityOf(customer?: Customer): string {
  // ?. stops and gives undefined as soon as something is missing; ?? then supplies the fallback.
  return customer?.address?.city ?? 'Unknown city';
}

interface AudioSettings {
  volume?: number;
}

function getVolume(settings: AudioSettings): number {
  return settings.volume ?? 50; // `||` would turn a volume of 0 into 50, `??` keeps the 0
}

// ---------------------------------------------------------------------------
// Exercise 5: Array methods (concept 2.5)
// ---------------------------------------------------------------------------

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
  return products.filter((product) => product.inStock).map((product) => product.name);
}

function totalPrice(products: Product[]): number {
  return products.reduce((sum, product) => sum + product.price, 0); // 0 is the starting sum
}

function cheapestFirst(products: Product[]): Product[] {
  return products.toSorted((a, b) => a.price - b.price); // a sorted copy; the original keeps its order
}

// ---------------------------------------------------------------------------
// Exercise 6: References, copying and immutability (concept 2.6)
// ---------------------------------------------------------------------------

interface Post {
  title: string;
  tags: string[];
}

const post: Post = { title: 'Hello', tags: ['intro'] };

function addTag(post: Post, tag: string): Post {
  // A new object with a new tags array. post.tags.push(tag) would change the original post.
  return { ...post, tags: [...post.tags, tag] };
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
  return structuredClone(team); // copies every level, including the nested arrays
}

// function addScore(scores: readonly number[]): void {
//   scores.push(100); // Error: Property 'push' does not exist on type 'readonly number[]'.
// }

// ===========================================================================
// Checks: the same checks as in exercises-part-2.ts
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
