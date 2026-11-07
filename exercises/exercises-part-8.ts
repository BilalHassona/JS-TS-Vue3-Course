/**
 * Exercises – Part 8: Asynchronous JavaScript
 * (concepts 8.1–8.4 in JS-TS-Concepts.md)
 *
 * How to work through this file:
 *   1. Solve the exercises from top to bottom. Each one explains what to write; look for "TODO".
 *   2. Run the file to see which checks pass. Node.js 22.18 or newer runs TypeScript directly:
 *        node exercises-part-8.ts
 *      (On an older Node.js version, use: npx tsx exercises-part-8.ts)
 *   3. Check your types too. Your editor underlines type errors in red, using the settings in
 *      tsconfig.json (in this folder). To check just this file in the terminal, run:
 *        npx -p typescript tsc --ignoreConfig --noEmit exercises-part-8.ts
 *      Type errors in exercises you haven't solved yet are normal. Some exercises are about
 *      fixing exactly those errors.
 *   4. You're done when every check shows ✅ and the type check reports no errors.
 *
 * Stuck? Compare your code with exercises-part-8-solved.ts.
 */

export {}; // makes this file a module, so its names don't clash with other exercise files

// ---------------------------------------------------------------------------
// Exercise 1: The event loop (concept 8.1)
// ---------------------------------------------------------------------------
// JavaScript runs one piece of code at a time, on a single thread. While code runs, nothing
// else can happen: a long loop would freeze a web page, because clicks and timers must wait.
// Code that has to wait runs later, in this order:
//   1. First, the code that is running now runs to its end. An async function that gets
//      called runs right away too, up to its first await.
//   2. Then all waiting microtasks, in the order they were queued: then() callbacks of
//      promises, and the rest of an async function after an await.
//   3. Then the next task, for example a setTimeout() callback, even with a timeout of 0 ms.
//
// a) In which order does `eventLoopDemo` push the letters A to F into `order`? Don't run the
//    file yet. Write your prediction into `predictedOrder`, then run the file: the check only
//    tells you whether your prediction is right. If it isn't, go through the rules above
//    again, line by line.

function eventLoopDemo(): Promise<string[]> {
  const order: string[] = [];
  order.push('A');
  setTimeout(() => order.push('B'), 0);
  Promise.resolve().then(() => order.push('C'));
  pushLater(order);
  order.push('F');
  // Hands over `order` after 10 ms, when all the callbacks above have run
  return new Promise((resolve) => setTimeout(() => resolve(order), 10));
}

async function pushLater(order: string[]): Promise<void> {
  order.push('D');
  await Promise.resolve();
  order.push('E');
}

const predictedOrder: string[] = []; // TODO: your prediction, for example ['A', ...]

// ---------------------------------------------------------------------------
// Exercise 2: Callbacks and promises (concept 8.2)
// ---------------------------------------------------------------------------
// The fake server below has an old, callback-based API: getUserLegacy() answers after 10 ms by
// calling onSuccess with the user, or onError with an error. Callbacks get hard to read when
// one request needs the result of another, which needs the result of the next ("callback
// hell"). Promises are easier to combine: you can chain them and await them.
//
// a) Implement `delay`: a promise that resolves after `ms` milliseconds. Create it with
//    new Promise((resolve) => ...), and call resolve from a setTimeout() callback.
//      await delay(30);    (continues after 30 ms)
//
// b) Implement `fetchUser`, which wraps getUserLegacy() in a promise: resolve it with the
//    user, or reject it with the error. Hint: resolve and reject are functions, so you can
//    pass them to getUserLegacy() as its callbacks.
//      await fetchUser(1) -> { id: 1, name: 'Ada' }
//      await fetchUser(99) -> rejects with Error: No user with id 99
//
// c) Implement `userNameOrDefault` with then() and catch(), without async/await: the name of
//    the user, or 'Unknown user' when fetchUser() fails. Whatever a then() callback returns
//    becomes the value of the next promise in the chain, and a rejection skips ahead to the
//    next catch().
//      await userNameOrDefault(1) -> 'Ada'    await userNameOrDefault(99) -> 'Unknown user'
//    Try it: once fetchUser works, uncomment the line `// fetchUser(99);`. Nothing handles the
//    rejection, so Node.js stops the program with the error. Comment it out again afterwards.

interface User {
  id: number;
  name: string;
}

const users: User[] = [
  { id: 1, name: 'Ada' },
  { id: 2, name: 'Grace' },
  { id: 3, name: 'Alan' },
];

// The fake server. It also counts how many requests are running at the same time.
const server = { running: 0, maxRunning: 0 };

function getUserLegacy(id: number, onSuccess: (user: User) => void, onError: (error: Error) => void): void {
  server.running++;
  server.maxRunning = Math.max(server.maxRunning, server.running);
  setTimeout(() => {
    server.running--;
    const user = users.find((candidate) => candidate.id === id);
    if (user) onSuccess(user);
    else onError(new Error(`No user with id ${id}`));
  }, 10);
}

function delay(ms: number): Promise<void> {
  // TODO
  throw new Error('TODO: implement delay');
}

function fetchUser(id: number): Promise<User> {
  // TODO
  throw new Error('TODO: implement fetchUser');
}

function userNameOrDefault(id: number): Promise<string> {
  // TODO: use then() and catch(), not async/await
  throw new Error('TODO: implement userNameOrDefault');
}

// fetchUser(99);

// ---------------------------------------------------------------------------
// Exercise 3: async/await (concept 8.3)
// ---------------------------------------------------------------------------
// Inside an async function, `await` pauses the function until a promise settles, and gives
// you its value. So asynchronous code reads from top to bottom like normal code, and you can
// catch its errors with try/catch. An async function always returns a promise.
//
// a) Implement `loadProfile` with async/await. It sets state.loading to true, waits for
//    fetchUser(id), and stores the user in state.user. When fetchUser() fails, it stores the
//    error message in state.error instead (try/catch). In every case, state.loading is false
//    at the end (finally). The code before the first await runs right away, so state.loading
//    is already true while the user is still on its way.
//      after await loadProfile(1, state):
//        { loading: false, user: { id: 1, name: 'Ada' }, error: undefined }
//      after await loadProfile(99, state):
//        { loading: false, user: undefined, error: 'No user with id 99' }
//
// b) Bug hunt: `loadUsers` returns the right users, but slowly: the await inside the loop
//    waits for each user before the next request even starts. The requests don't depend on
//    each other, so start them all at once: ids.map((id) => fetchUser(id)) gives you an array
//    of promises, and await Promise.all(...) waits until all of them are fulfilled. The
//    results keep the order of `ids`. The checks ask the fake server whether all requests
//    were running at the same time.
//      await loadUsers([2, 1]) -> [{ id: 2, name: 'Grace' }, { id: 1, name: 'Ada' }]
//    (Don't use forEach with an async callback for this: forEach doesn't wait for the
//    callbacks, so loadUsers would return before the first user has arrived.)

interface ProfileState {
  loading: boolean;
  user: User | undefined; // undefined until the user has arrived
  error: string | undefined;
}

async function loadProfile(id: number, state: ProfileState): Promise<void> {
  // TODO
  throw new Error('TODO: implement loadProfile');
}

async function loadUsers(ids: number[]): Promise<User[]> {
  const loaded: User[] = [];
  for (const id of ids) {
    loaded.push(await fetchUser(id)); // TODO: start all the requests at once instead
  }
  return loaded;
}

// ---------------------------------------------------------------------------
// Exercise 4: Typing asynchronous code (concept 8.4)
// ---------------------------------------------------------------------------
// The type of a promise says what it resolves to: fetchUser() returns a Promise<User>. An
// async function always returns a promise, so its return type is always a Promise<...>.
// Promise.all keeps the types in order: await Promise.all([fetchUser(1), delay(5)]) gives you
// a tuple of type [User, void].
//
// a) Bug hunt: `greetUser` forgot to await fetchUser(id). It gets a Promise<User> instead of a
//    User, so TypeScript reports that `name` doesn't exist on the promise, and the function
//    returns 'Hello, undefined!'. Make greetUser async and await fetchUser(id). TypeScript then
//    reports that the return type of an async function must be a promise: change it to
//    Promise<string>.
//      await greetUser(1) -> 'Hello, Ada!'
//
// b) `loadSettings` has no written return type, so TypeScript infers one:
//    Promise<{ theme: string; fontSize: number }>. ReturnType<typeof loadSettings> gives you
//    that promise type, and Awaited<...> unwraps it to the value inside. Replace unknown in
//    `Settings` with Awaited<ReturnType<typeof loadSettings>>. Then implement
//    `describeSettings`.
//      describeSettings(await loadSettings()) -> 'dark theme, font size 14'

function greetUser(id: number): string {
  const user = fetchUser(id);
  return `Hello, ${user.name}!`;
}

async function loadSettings() {
  return { theme: 'dark', fontSize: 14 };
}

type Settings = unknown; // TODO: the type of the value that loadSettings() resolves to

function describeSettings(settings: Settings): string {
  // TODO
  throw new Error('TODO: implement describeSettings');
}

// Uses Settings. If Settings is the promise instead of the value inside it, TypeScript reports
// an error here.
async function settingsLabel(): Promise<string> {
  return describeSettings(await loadSettings());
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
    timer = setTimeout(
      () => reject(new Error('still waiting after 1 second: is resolve or reject never called?')),
      1000,
    );
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
  await check('1a your prediction of the order', async () => isEqual(await eventLoopDemo(), predictedOrder), true);

  // Exercise 2
  await check(
    '2a await delay(30) continues after about 30 ms',
    async () => {
      const start = Date.now();
      await delay(30);
      return Date.now() - start >= 25;
    },
    true,
  );
  await check('2b await fetchUser(1)', () => fetchUser(1), { id: 1, name: 'Ada' });
  await check(
    '2b fetchUser(99) rejects with an Error',
    () => errorOf(() => fetchUser(99)),
    'Error: No user with id 99',
  );
  await check('2c await userNameOrDefault(1)', () => userNameOrDefault(1), 'Ada');
  await check('2c await userNameOrDefault(99)', () => userNameOrDefault(99), 'Unknown user');

  // Exercise 3
  await check(
    '3a loadProfile(1, state): [state.loading while waiting, state afterwards]',
    async () => {
      const state: ProfileState = { loading: false, user: undefined, error: undefined };
      const loading = loadProfile(1, state);
      const loadingWhileWaiting = state.loading;
      await loading;
      return [loadingWhileWaiting, state];
    },
    [true, { loading: false, user: { id: 1, name: 'Ada' }, error: undefined }],
  );
  await check(
    '3a loadProfile(99, state): state afterwards',
    async () => {
      const state: ProfileState = { loading: false, user: undefined, error: undefined };
      await loadProfile(99, state);
      return state;
    },
    { loading: false, user: undefined, error: 'No user with id 99' },
  );
  await check('3b await loadUsers([2, 1])', () => loadUsers([2, 1]), [
    { id: 2, name: 'Grace' },
    { id: 1, name: 'Ada' },
  ]);
  await check(
    '3b loadUsers([1, 2, 3]) runs all 3 requests at the same time',
    async () => {
      server.maxRunning = 0;
      await loadUsers([1, 2, 3]);
      return server.maxRunning;
    },
    3,
  );

  // Exercise 4
  await check('4a await greetUser(1)', () => greetUser(1), 'Hello, Ada!');
  await check('4b describeSettings(await loadSettings())', () => settingsLabel(), 'dark theme, font size 14');

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed === 0) console.log('All checks pass. Well done! 🎉');
}

runChecks();
