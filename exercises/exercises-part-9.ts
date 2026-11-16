/**
 * Exercises – Part 9: Data from the outside world
 * (concepts 9.1–9.4 in JS-TS-Concepts.md)
 *
 * How to work through this file:
 *   1. Solve the exercises from top to bottom. Each one explains what to write; look for "TODO".
 *   2. Run the file to see which checks pass. Node.js 22.18 or newer runs TypeScript directly:
 *        node exercises-part-9.ts
 *      (On an older Node.js version, use: npx tsx exercises-part-9.ts)
 *   3. Check your types too. Your editor underlines type errors in red, using the settings in
 *      tsconfig.json (in this folder). To check just this file in the terminal, run:
 *        npx -p typescript tsc --ignoreConfig --noEmit exercises-part-9.ts
 *      Type errors in exercises you haven't solved yet are normal.
 *   4. You're done when every check shows ✅ and the type check reports no errors.
 *
 * Stuck? Compare your code with exercises-part-9-solved.ts.
 */

export {}; // makes this file a module, so its names don't clash with other exercise files

// ---------------------------------------------------------------------------
// Exercise 1: JSON (concept 9.1)
// ---------------------------------------------------------------------------
// JSON is the text format that servers and browsers use to exchange data. It looks like a
// JavaScript object literal, but it's only a text, and its rules are stricter.
// JSON.stringify(value) turns a value into JSON, and JSON.stringify(value, null, 2) indents it,
// so that it's easier to read. JSON.parse(text) turns JSON back into a value. It throws a
// SyntaxError if the text isn't valid JSON.
//
// a) Bug hunt: JSON.parse(profileJson) throws a SyntaxError, because the text is written like a
//    JavaScript object, not like JSON. Fix the text: in JSON, every name and every text needs
//    double quotes, and there are no trailing commas and no comments. Keep the same data.
//      JSON.parse(profileJson)
//        -> { name: 'Ada Lovelace', born: 1815, languages: ['English', 'French'] }
//    (tsconfig.json in this folder has comments. TypeScript allows them there, but JSON.parse()
//    doesn't.)
//
// b) Bug hunt: JSON has no dates. JSON.stringify() turns a Date into a text like
//    '2026-11-20T09:30:00.000Z', and JSON.parse() leaves it a text. So the `start` of the
//    meeting that `parseMeeting` returns is a string, although its type says Date. TypeScript
//    doesn't notice, because JSON.parse() returns `any`, and TypeScript doesn't check what you
//    do with an `any` value. Calling start.getHours() would crash.
//    Fix parseMeeting with a reviver: JSON.parse(text, (key, value) => ...) calls your function
//    for every value it reads, and keeps what the function returns instead. Return a Date for
//    the key 'start', and the value unchanged for all other keys.
//      parseMeeting(JSON.stringify(codeReview)).start.toISOString() -> '2026-11-20T09:30:00.000Z'
//    Try it: uncomment the console.log() line below and run the file, to see what JSON does with
//    a Set, with undefined and with a function.

const profileJson: string = `{
  name: 'Ada Lovelace',
  born: 1815,
  languages: ['English', 'French',],
  // she wrote the first computer program
}`;

interface Meeting {
  title: string;
  start: Date;
}

const codeReview: Meeting = { title: 'Code review', start: new Date('2026-11-20T09:30:00.000Z') };

function parseMeeting(text: string): Meeting {
  return JSON.parse(text); // TODO: turn `start` back into a Date
}

// console.log(JSON.stringify({ tags: new Set(['js', 'ts']), note: undefined, greet() {} }));

// ---------------------------------------------------------------------------
// Exercise 2: fetch() and HTTP (concept 9.2)
// ---------------------------------------------------------------------------
// A web page gets data from a server with HTTP requests. A request has a method (GET reads
// data, POST sends new data; PUT, PATCH and DELETE change or delete data) and a URL. The server
// answers with a status code (200 OK, 201 Created, 400 Bad Request, 404 Not Found, 500 Internal
// Server Error, ...), headers, and a body, often JSON. fetch(url, options) sends a request, and
// returns a promise of the answer: a Response.
//
// This file has its own fetch(), near the end of the file. It works like the real one, but a
// fake server answers instead of the internet, so the file also runs without a network. The
// fake server knows these requests:
//   GET  https://api.example.com/users/1          -> 200, { "id": 1, "name": "Ada Lovelace" }
//   GET  https://api.example.com/users/99         -> 404, { "error": "User not found" }
//   GET  https://api.example.com/users?search=al  -> 200, the users whose name contains "al"
//   POST https://api.example.com/todos            -> 201, the new todo
//
// a) Implement `getUser`. fetch() rejects only when there is no answer at all, for example
//    without a network connection. A 404 or a 500 is an answer too: the promise resolves, and
//    response.ok is false (it is true for the status codes 200 to 299). So check response.ok,
//    and throw an Error with the message `Response status: ${response.status}` when it's false.
//    Otherwise, return the body: await response.json() reads it and parses the JSON.
//      await getUser(1) -> { id: 1, name: 'Ada Lovelace' }
//      await getUser(99) -> rejects with Error: Response status: 404
//
// b) Implement `createTodo`: a POST request to /todos, with the new todo as JSON in the body,
//    like { "title": "Learn fetch" }. Pass the options as the second argument of fetch():
//    method, headers and body. The body must be a text, so use JSON.stringify(). Also send the
//    header 'Content-Type': 'application/json', which tells the server that the body is JSON.
//    Without it, the server answers 415 Unsupported Media Type. Check response.ok as in a): for
//    an empty title, the server answers 400 Bad Request.
//      await createTodo('Learn fetch') -> { id: 3, title: 'Learn fetch', done: false }
//      await createTodo('') -> rejects with Error: Response status: 400
//
// c) Bug hunt: the search box calls `search` after every key press, and shows the names that
//    the server finds. The fake server takes longer for short search texts (they match more
//    users). So when someone types 'a', 'al', 'ala' quickly, the answer for 'a' arrives last,
//    and replaces the results for 'ala'. Fix it: cancel the running search when a new one starts.
//      - In each search, create a new AbortController and store it in `runningSearch`. Before
//        that, cancel the previous one: runningSearch?.abort().
//      - Pass its signal to fetch(): fetch(url, { signal: controller.signal }).
//      - The fetch() of a cancelled search rejects with a DOMException whose name is
//        'AbortError'. That's not a real error: catch it and return. Throw other errors again.
//      search('a'); search('al'); search('ala');
//      once all three have finished: searchBox.results -> ['Alan Turing']
//    (For a timeout, pass AbortSignal.timeout(5000) as the signal: it cancels after 5 seconds.)

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
  // TODO
  throw new Error('TODO: implement getUser');
}

async function createTodo(title: string): Promise<Todo> {
  // TODO
  throw new Error('TODO: implement createTodo');
}

const searchBox: { results: string[] } = { results: [] }; // the names that the search box shows

let runningSearch: AbortController | undefined; // TODO: the controller of the latest search

// The search box calls this after every key press
async function search(text: string): Promise<void> {
  const response = await fetch(`${API_URL}/users?search=${encodeURIComponent(text)}`);
  const found: User[] = await response.json();
  searchBox.results = found.map((user) => user.name);
}

// ---------------------------------------------------------------------------
// Exercise 3: Typing and validating API data (concept 9.3)
// ---------------------------------------------------------------------------
// response.json() and JSON.parse() return `any`, so TypeScript accepts whatever you do with the
// result. `const found: User[] = await response.json()` in Exercise 2 compiles, and so does
// `(await response.json()) as User`. But that's only a promise you make to TypeScript: nothing
// checks the data when the code runs. If the server sends something else, the code carries on
// with the wrong data, and fails later, somewhere else. So treat data from the outside world as
// `unknown`, and check it with a type guard before you use it.
//
// a) Implement the type guard `isUser`: true only for an object (not null) with a number `id`
//    and a string `name`. After typeof value === 'object' && value !== null, the check
//    'id' in value lets you read value.id, so that you can check its type with typeof.
//      isUser({ id: 1, name: 'Ada Lovelace' }) -> true
//      isUser({ id: '1', name: 'Ada Lovelace' }) -> false    isUser(null) -> false
//
// b) Implement `fetchJson`, one helper for all GET requests. It fetches `url`, checks
//    response.ok as in Exercise 2, and stores the parsed body in a variable of type unknown.
//    Then it checks the data with `isValid`: it returns the data if it's valid, and otherwise
//    throws an Error with the message `Unexpected data from ${url}`. isValid is a type guard like
//    isUser, and T is the type it checks for, so fetchJson(url, isUser) returns a Promise<User>.
//    Version 2 of the API renamed `name` to `fullName`, so fetchJson rejects its users:
//      await fetchJson(`${API_URL}/users/2`, isUser) -> { id: 2, name: 'Alan Turing' }
//      await fetchJson(`${API_URL}/v2/users/2`, isUser)
//        -> rejects with Error: Unexpected data from https://api.example.com/v2/users/2
//    Try it: once all checks pass, replace the isValid check with `return data as T;`.
//    TypeScript accepts it, but the check with the version 2 URL fails: `as` checks nothing.
//
// In real projects, a library like Zod often writes these checks for you. You describe the
// data once, and Zod checks it and gives you its type. Zod is a package (npm install zod), so
// this file can't use it, but this is how it looks:
//   const UserSchema = z.object({ id: z.number(), name: z.string() });
//   type User = z.infer<typeof UserSchema>; // { id: number; name: string }
//   const user = UserSchema.parse(data); // a User, or it throws an error

function isUser(value: unknown): value is User {
  // TODO
  throw new Error('TODO: implement isUser');
}

async function fetchJson<T>(url: string, isValid: (data: unknown) => data is T): Promise<T> {
  // TODO
  throw new Error('TODO: implement fetchJson');
}

// ---------------------------------------------------------------------------
// Exercise 4: Web Storage (concept 9.4)
// ---------------------------------------------------------------------------
// localStorage keeps a few megabytes of data in the browser, also after the page is closed.
// sessionStorage works the same way, but forgets everything when the tab is closed. Both store
// texts only: setItem(key, text), getItem(key) (null when nothing is stored under that key) and
// removeItem(key). To store anything else, turn it into JSON first. Every script on the page
// can read the storage, so never store passwords or other secrets in it.
// The functions below get the storage as a parameter. In a browser, you'd pass localStorage.
// The checks pass a fake storage that works the same way, so this file runs outside a browser.
//
// a) Bug hunt: after the user turns dark mode off, `loadDarkMode` still returns true. The
//    storage turned false into the text 'false', and every text except '' is truthy, so
//    Boolean('false') is true. Fix loadDarkMode.
//      saveDarkMode(storage, false);  loadDarkMode(storage) -> false
//    Try it: in saveDarkMode, pass `on` to setItem() without String(). TypeScript reports that
//    a boolean isn't a string. Plain JavaScript would quietly store the text 'true' or 'false'.
//
// b) Implement `writeStored`, which stores any value as JSON, and `readStored`, which reads it
//    back. readStored returns `fallback` when nothing is stored under `key`, when the stored
//    text isn't valid JSON (use try/catch), or when isValid says that the parsed value has the
//    wrong shape. That happens, for example, when an older version of your app stored something
//    else under the same key.
//      writeStored(storage, 'recentSearches', ['ada', 'grace']);
//      readStored(storage, 'recentSearches', isStringArray, []) -> ['ada', 'grace']
//      readStored(storage, 'somethingElse', isStringArray, []) -> []

function saveDarkMode(storage: Storage, on: boolean): void {
  storage.setItem('darkMode', String(on)); // stores 'true' or 'false'
}

function loadDarkMode(storage: Storage): boolean {
  const stored = storage.getItem('darkMode'); // 'true', 'false', or null when nothing is stored
  return Boolean(stored);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function writeStored(storage: Storage, key: string, value: unknown): void {
  // TODO
  throw new Error('TODO: implement writeStored');
}

function readStored<T>(storage: Storage, key: string, isValid: (value: unknown) => value is T, fallback: T): T {
  // TODO
  throw new Error('TODO: implement readStored');
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
