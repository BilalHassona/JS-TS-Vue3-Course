/**
 * Solutions – Part 9: Data from the outside world
 * (concepts 9.1–9.4 in JS-TS-Concepts.md)
 *
 * Try exercises-part-9.ts on your own first. Your solution doesn't have to match this one
 * exactly: if all checks pass and the type check reports no errors, your solution is fine.
 *
 *   Run:        node exercises-part-9-solved.ts
 *   Type check: npx -p typescript tsc --ignoreConfig --noEmit exercises-part-9-solved.ts
 */

export {}; // makes this file a module, so its names don't clash with other exercise files

// ---------------------------------------------------------------------------
// Exercise 1: JSON (concept 9.1)
// ---------------------------------------------------------------------------

// Double quotes around every name and every text, no trailing commas, and no comments
const profileJson: string = `{
  "name": "Ada Lovelace",
  "born": 1815,
  "languages": ["English", "French"]
}`;

interface Meeting {
  title: string;
  start: Date;
}

const codeReview: Meeting = { title: 'Code review', start: new Date('2026-11-20T09:30:00.000Z') };

function parseMeeting(text: string): Meeting {
  // The reviver gets every key and value that JSON.parse() reads, and returns the value to keep.
  // Another way: parse into a type whose start is a string, and build the Meeting from that.
  return JSON.parse(text, (key, value) => (key === 'start' ? new Date(value) : value));
}

// console.log(JSON.stringify({ tags: new Set(['js', 'ts']), note: undefined, greet() {} }));
// -> {"tags":{}}  A Set becomes {} (a Map too), and JSON leaves out undefined and functions.

// ---------------------------------------------------------------------------
// Exercise 2: fetch() and HTTP (concept 9.2)
// ---------------------------------------------------------------------------

const API_URL = 'https://api.example.com'; // the address of the fake server

interface User {
  id: number;
  name: string;
}

interface Todo {
  id: number;
  title: string;
  done: boolean;
}

async function getUser(id: number): Promise<User> {
  const response = await fetch(`${API_URL}/users/${id}`);
  if (!response.ok) throw new Error(`Response status: ${response.status}`); // a 404 doesn't reject
  return response.json(); // `any`: TypeScript trusts that the body is a User (see Exercise 3)
}

async function createTodo(title: string): Promise<Todo> {
  const response = await fetch(`${API_URL}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }, // tells the server that the body is JSON
    body: JSON.stringify({ title }), // the body is a text
  });
  if (!response.ok) throw new Error(`Response status: ${response.status}`);
  return response.json();
}

const searchBox: { results: string[] } = { results: [] }; // the names that the search box shows

let runningSearch: AbortController | undefined; // the controller of the latest search

// The search box calls this after every key press
async function search(text: string): Promise<void> {
  runningSearch?.abort(); // cancels the previous search, if it's still running
  const controller = new AbortController();
  runningSearch = controller;
  try {
    const response = await fetch(`${API_URL}/users?search=${encodeURIComponent(text)}`, {
      signal: controller.signal,
    });
    const found: User[] = await response.json();
    searchBox.results = found.map((user) => user.name);
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') return; // a newer search took over
    throw error;
  }
}

// ---------------------------------------------------------------------------
// Exercise 3: Typing and validating API data (concept 9.3)
// ---------------------------------------------------------------------------

function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null && // typeof null is 'object' too
    'id' in value &&
    typeof value.id === 'number' &&
    'name' in value &&
    typeof value.name === 'string'
  );
}

async function fetchJson<T>(url: string, isValid: (data: unknown) => data is T): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Response status: ${response.status}`);
  const data: unknown = await response.json(); // unknown: TypeScript allows no use before a check
  if (!isValid(data)) throw new Error(`Unexpected data from ${url}`);
  return data; // isValid(data) returned true, so TypeScript knows that data is a T here
}

// ---------------------------------------------------------------------------
// Exercise 4: Web Storage (concept 9.4)
// ---------------------------------------------------------------------------

function saveDarkMode(storage: Storage, on: boolean): void {
  storage.setItem('darkMode', String(on)); // stores 'true' or 'false'
}

function loadDarkMode(storage: Storage): boolean {
  const stored = storage.getItem('darkMode'); // 'true', 'false', or null when nothing is stored
  return stored === 'true'; // compares the texts: 'false' and null both give false
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function writeStored(storage: Storage, key: string, value: unknown): void {
  storage.setItem(key, JSON.stringify(value));
}

function readStored<T>(storage: Storage, key: string, isValid: (value: unknown) => value is T, fallback: T): T {
  const text = storage.getItem(key);
  if (text === null) return fallback; // nothing stored under this key
  try {
    const value: unknown = JSON.parse(text);
    return isValid(value) ? value : fallback; // the stored value may come from an older version
  } catch {
    return fallback; // the stored text isn't valid JSON
  }
}

// ===========================================================================
// The fake server and the fake storage. They let this file run without a network and outside
// a browser. You don't need to change anything below, but you're welcome to read how they work.
// ===========================================================================

const server = {
  users: [
    { id: 1, name: 'Ada Lovelace' },
    { id: 2, name: 'Alan Turing' },
    { id: 3, name: 'Grace Hopper' },
  ],
  todos: [
    { id: 1, title: 'Read about fetch()', done: true },
    { id: 2, title: 'Solve the exercises', done: false },
  ],
  cancelled: 0, // how many requests were cancelled with an AbortSignal
};

// Works like the real fetch(), but the fake server answers instead of the internet
async function fetch(input: string | URL | Request, init?: RequestInit): Promise<Response> {
  const request = new Request(input, init); // checks the arguments, like the real fetch()
  const url = new URL(request.url);
  if (url.origin !== API_URL) {
    throw new TypeError(`fetch failed: there is no server at ${url.origin}, only at ${API_URL}`);
  }
  // A real server needs some time to answer. This one needs longer for short search texts.
  const search = url.searchParams.get('search');
  await waitFor(search === null ? 10 : 50 - 10 * Math.min(search.length, 4), request.signal);
  return answer(request, url);
}

// Waits `ms` milliseconds, or rejects as soon as `signal` cancels the request
function waitFor(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const cancel = () => {
      clearTimeout(timer);
      server.cancelled++;
      reject(signal.reason); // a DOMException named 'AbortError', as with the real fetch()
    };
    const timer = setTimeout(() => {
      signal.removeEventListener('abort', cancel);
      resolve();
    }, ms);
    if (signal.aborted) cancel();
    else signal.addEventListener('abort', cancel);
  });
}

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}

// Answers a request like a small web API would
async function answer(request: Request, url: URL): Promise<Response> {
  const path = url.pathname.split('/').filter((part) => part !== ''); // '/v2/users/1' -> ['v2', 'users', '1']
  const v2 = path[0] === 'v2';
  if (v2) path.shift();
  // Version 2 of the API calls the name `fullName`
  const present = (user: User) => (v2 ? { id: user.id, fullName: user.name } : user);

  if (request.method === 'GET' && path.length === 1 && path[0] === 'users') {
    const search = (url.searchParams.get('search') ?? '').toLowerCase();
    const found = server.users.filter((user) => user.name.toLowerCase().includes(search));
    return jsonResponse(200, found.map(present));
  }
  if (request.method === 'GET' && path.length === 2 && path[0] === 'users') {
    const user = server.users.find((candidate) => String(candidate.id) === path[1]);
    return user ? jsonResponse(200, present(user)) : jsonResponse(404, { error: 'User not found' });
  }
  if (request.method === 'POST' && path.length === 1 && path[0] === 'todos') {
    if (!request.headers.get('Content-Type')?.startsWith('application/json')) {
      return jsonResponse(415, { error: 'Send JSON, with the header Content-Type: application/json' });
    }
    let body: unknown;
    try {
      body = JSON.parse(await request.text());
    } catch {
      return jsonResponse(400, { error: 'The body is not valid JSON' });
    }
    const title = typeof body === 'object' && body !== null && 'title' in body ? body.title : undefined;
    if (typeof title !== 'string' || title.trim() === '') {
      return jsonResponse(400, { error: 'A todo needs a title' });
    }
    const todo: Todo = { id: server.todos.length + 1, title, done: false };
    server.todos.push(todo);
    return jsonResponse(201, todo);
  }
  return jsonResponse(404, { error: 'Not found' });
}

// Works like localStorage, but keeps the items only in memory
function createStorage(): Storage {
  const items = new Map<string, string>();
  return {
    get length() {
      return items.size;
    },
    key: (index) => [...items.keys()][index] ?? null,
    getItem: (key) => items.get(key) ?? null,
    setItem: (key, value) => {
      items.set(key, String(value)); // like localStorage, it stores everything as a text
    },
    removeItem: (key) => {
      items.delete(key);
    },
    clear: () => items.clear(),
  };
}

// ===========================================================================
// Checks: the same checks as in exercises-part-9.ts
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

// Waits for `value` if it is a promise, but at most one second, so that a promise that never
// settles can't stop the checks
async function settle(value: unknown): Promise<unknown> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error('still waiting after 1 second')), 1000);
  });
  try {
    return await Promise.race([value, timeout]);
  } finally {
    clearTimeout(timer);
  }
}

// Like check() in the earlier parts, but it waits for promises
async function check(label: string, run: () => unknown, expected: unknown): Promise<void> {
  try {
    const actual = await settle(run());
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

// Calls `run`, waits for it, and describes the error it throws or rejects with, like 'Error: Boom'
async function errorOf(run: () => unknown): Promise<unknown> {
  try {
    await settle(run());
  } catch (error) {
    return error instanceof Error ? `${error.name}: ${error.message}` : error;
  }
  return 'no error';
}

// The checks wait for promises, and `await` works only inside an async function, so they run in one
async function runChecks(): Promise<void> {
  // Exercise 1
  await check('1a JSON.parse(profileJson)', () => JSON.parse(profileJson), {
    name: 'Ada Lovelace',
    born: 1815,
    languages: ['English', 'French'],
  });
  await check(
    '1b parseMeeting(JSON.stringify(codeReview)): [title, start.toISOString()]',
    () => {
      const meeting = parseMeeting(JSON.stringify(codeReview));
      return [meeting.title, meeting.start.toISOString()];
    },
    ['Code review', '2026-11-20T09:30:00.000Z'],
  );

  // Exercise 2
  await check('2a await getUser(1)', () => getUser(1), { id: 1, name: 'Ada Lovelace' });
  await check('2a getUser(99) rejects with an Error', () => errorOf(() => getUser(99)), 'Error: Response status: 404');
  await check("2b await createTodo('Learn fetch')", () => createTodo('Learn fetch'), {
    id: 3,
    title: 'Learn fetch',
    done: false,
  });
  await check(
    "2b createTodo('') rejects with an Error",
    () => errorOf(() => createTodo('')),
    'Error: Response status: 400',
  );
  await check(
    "2c search('a'), search('al') and search('ala') at once: searchBox.results afterwards",
    async () => {
      await Promise.allSettled([search('a'), search('al'), search('ala')]);
      return searchBox.results;
    },
    ['Alan Turing'],
  );
  await check(
    '2c the 2 older searches were cancelled, and no search() call rejected',
    async () => {
      server.cancelled = 0;
      const outcomes = await Promise.allSettled([search('a'), search('al'), search('ala')]);
      return [server.cancelled, outcomes.map((outcome) => outcome.status)];
    },
    [2, ['fulfilled', 'fulfilled', 'fulfilled']],
  );

  // Exercise 3
  await check("3a isUser({ id: 1, name: 'Ada Lovelace' })", () => isUser({ id: 1, name: 'Ada Lovelace' }), true);
  await check(
    "3a isUser() for { id: '1', name: 'Ada Lovelace' }, { id: 1 }, null and 'Ada'",
    () => [isUser({ id: '1', name: 'Ada Lovelace' }), isUser({ id: 1 }), isUser(null), isUser('Ada')],
    [false, false, false, false],
  );
  await check('3b await fetchJson(`${API_URL}/users/2`, isUser)', () => fetchJson(`${API_URL}/users/2`, isUser), {
    id: 2,
    name: 'Alan Turing',
  });
  await check(
    '3b fetchJson(`${API_URL}/users/99`, isUser) rejects with an Error',
    () => errorOf(() => fetchJson(`${API_URL}/users/99`, isUser)),
    'Error: Response status: 404',
  );
  await check(
    '3b fetchJson(`${API_URL}/v2/users/2`, isUser) rejects with an Error',
    () => errorOf(() => fetchJson(`${API_URL}/v2/users/2`, isUser)),
    `Error: Unexpected data from ${API_URL}/v2/users/2`,
  );

  // Exercise 4
  await check(
    '4a loadDarkMode(storage): [before saving, after saving true, after saving false]',
    () => {
      const storage = createStorage();
      const before = loadDarkMode(storage);
      saveDarkMode(storage, true);
      const afterTrue = loadDarkMode(storage);
      saveDarkMode(storage, false);
      return [before, afterTrue, loadDarkMode(storage)];
    },
    [false, true, false],
  );
  await check(
    "4b writeStored(storage, 'recentSearches', ['ada', 'grace']): [the stored text, readStored()]",
    () => {
      const storage = createStorage();
      writeStored(storage, 'recentSearches', ['ada', 'grace']);
      return [storage.getItem('recentSearches'), readStored(storage, 'recentSearches', isStringArray, [])];
    },
    ['["ada","grace"]', ['ada', 'grace']],
  );
  await check(
    '4b readStored() returns the fallback: [nothing stored, not JSON, the wrong shape]',
    () => {
      const empty = createStorage();
      const notJson = createStorage();
      notJson.setItem('recentSearches', 'ada,grace'); // what String(['ada', 'grace']) gives
      const wrongShape = createStorage();
      wrongShape.setItem('recentSearches', '"ada"'); // an older version stored only the last search
      const storages: Storage[] = [empty, notJson, wrongShape];
      return storages.map((storage) => readStored(storage, 'recentSearches', isStringArray, []));
    },
    [[], [], []],
  );

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed === 0) console.log('All checks pass. Well done! 🎉');
}

runChecks();
