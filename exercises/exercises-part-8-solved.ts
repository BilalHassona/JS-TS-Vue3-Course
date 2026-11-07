/**
 * Solutions – Part 8: Asynchronous JavaScript
 * (concepts 8.1–8.4 in JS-TS-Concepts.md)
 *
 * Try exercises-part-8.ts on your own first. Your solution doesn't have to match this one
 * exactly: if all checks pass and the type check reports no errors, your solution is fine.
 *
 *   Run:        node exercises-part-8-solved.ts
 *   Type check: npx -p typescript tsc --ignoreConfig --noEmit exercises-part-8-solved.ts
 */

export {}; // makes this file a module, so its names don't clash with other exercise files

// ---------------------------------------------------------------------------
// Exercise 1: The event loop (concept 8.1)
// ---------------------------------------------------------------------------

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

// A, D and F come first: the code that runs right away pushes them. D is part of it, because
// pushLater() runs right away up to its first await.
// Then the microtasks, in the order they were queued: C (the then() callback) and E (the rest of
// pushLater() after its await).
// B comes last: a setTimeout() callback is a task, and tasks run only after all microtasks.
const predictedOrder: string[] = ['A', 'D', 'F', 'C', 'E', 'B'];

// ---------------------------------------------------------------------------
// Exercise 2: Callbacks and promises (concept 8.2)
// ---------------------------------------------------------------------------

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
  return new Promise((resolve) => setTimeout(resolve, ms)); // setTimeout calls resolve after ms milliseconds
}

function fetchUser(id: number): Promise<User> {
  // resolve and reject are functions, so they can be the callbacks of the old API
  return new Promise((resolve, reject) => getUserLegacy(id, resolve, reject));
}

function userNameOrDefault(id: number): Promise<string> {
  return fetchUser(id)
    .then((user) => user.name) // the name becomes the value of the next promise
    .catch(() => 'Unknown user'); // a rejection anywhere above ends up here
}

// fetchUser(99); // Nothing handles the rejection: Node.js stops with "Error: No user with id 99".

// ---------------------------------------------------------------------------
// Exercise 3: async/await (concept 8.3)
// ---------------------------------------------------------------------------

interface ProfileState {
  loading: boolean;
  user: User | undefined; // undefined until the user has arrived
  error: string | undefined;
}

async function loadProfile(id: number, state: ProfileState): Promise<void> {
  state.loading = true; // runs right away, before the first await
  try {
    state.user = await fetchUser(id);
    state.error = undefined;
  } catch (error) {
    state.user = undefined;
    state.error = error instanceof Error ? error.message : String(error);
  } finally {
    state.loading = false; // after a success and after a failure
  }
}

async function loadUsers(ids: number[]): Promise<User[]> {
  // map() starts all the requests at once, and Promise.all waits for all of them. The results
  // keep the order of `ids`, no matter which request finishes first.
  return Promise.all(ids.map((id) => fetchUser(id)));
}

// ---------------------------------------------------------------------------
// Exercise 4: Typing asynchronous code (concept 8.4)
// ---------------------------------------------------------------------------

async function greetUser(id: number): Promise<string> {
  const user = await fetchUser(id); // without await, `user` would be the promise, not the user
  return `Hello, ${user.name}!`;
}

async function loadSettings() {
  return { theme: 'dark', fontSize: 14 };
}

type Settings = Awaited<ReturnType<typeof loadSettings>>; // { theme: string; fontSize: number }

function describeSettings(settings: Settings): string {
  return `${settings.theme} theme, font size ${settings.fontSize}`;
}

async function settingsLabel(): Promise<string> {
  return describeSettings(await loadSettings());
}

// ===========================================================================
// Checks: the same checks as in exercises-part-8.ts
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
