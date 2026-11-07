/**
 * Exercises – Part 5: Objects under the hood and classes
 * (concepts 5.1–5.4 in JS-TS-Concepts.md)
 *
 * How to work through this file:
 *   1. Solve the exercises from top to bottom. Each one explains what to write; look for "TODO".
 *   2. Run the file to see which checks pass. Node.js 22.18 or newer runs TypeScript directly:
 *        node exercises-part-5.ts
 *      (On an older Node.js version, use: npx tsx exercises-part-5.ts)
 *   3. Check your types too. Your editor underlines type errors in red, using the settings in
 *      tsconfig.json (in this folder). To check just this file in the terminal, run:
 *        npx -p typescript tsc --ignoreConfig --noEmit exercises-part-5.ts
 *      Type errors in exercises you haven't solved yet are normal. Some exercises are about
 *      fixing exactly those errors.
 *   4. You're done when every check shows ✅ and the type check reports no errors.
 *
 * Stuck? Compare your code with exercises-part-5-solved.ts.
 */

export {}; // makes this file a module, so its names don't clash with other exercise files

// ---------------------------------------------------------------------------
// Exercise 1: Getters, setters and Object.freeze (concept 5.1)
// ---------------------------------------------------------------------------
// a) Implement `createTemperature`. The object it returns stores only `celsius`. Give it a
//    getter `fahrenheit` that calculates the value from celsius (celsius * 9 / 5 + 32), and a
//    setter `fahrenheit` that converts a new value back and stores it in celsius
//    ((fahrenheit - 32) * 5 / 9). The getter calculates fahrenheit on every read, so it can
//    never be out of date.
//      const temperature = createTemperature(20);
//      temperature.fahrenheit -> 68
//      temperature.fahrenheit = 50;    temperature.celsius -> 10
//
// b) Object.freeze(obj) blocks all changes to obj: no property can be changed, added or
//    deleted. But it only freezes obj itself, so the objects inside obj can still change.
//    Implement `deepFreeze`, which freezes obj and every object inside it, at any depth.
//    Hint: first call deepFreeze on every value of obj that is an object (and not null), then
//    freeze obj.
//      const settings = { theme: { colors: { text: 'black' } }, tags: ['a'] };
//      deepFreeze(settings);
//      Object.isFrozen(settings.theme.colors) -> true    (with only Object.freeze(settings): false)
//
// Try it: `colors` below is frozen. Uncomment the line `// colors.primary = 'red';`. TypeScript
// reports an error, because Object.freeze() returns a read-only type. Run the file anyway:
// Node.js stops with "TypeError: Cannot assign to read only property 'primary'", because the
// object really is frozen. Comment the line out again afterwards.

interface Temperature {
  celsius: number;
  fahrenheit: number;
}

function createTemperature(celsius: number): Temperature {
  // TODO
  throw new Error('TODO: implement createTemperature');
}

function deepFreeze(obj: object): void {
  // TODO
  throw new Error('TODO: implement deepFreeze');
}

const colors = Object.freeze({ primary: 'blue', secondary: 'grey' });

// colors.primary = 'red';

// ---------------------------------------------------------------------------
// Exercise 2: Prototypes and the prototype chain (concept 5.2)
// ---------------------------------------------------------------------------
// Every object has a hidden link to another object: its prototype. When you read a property
// that an object doesn't have itself, JavaScript looks for it in the prototype, then in the
// prototype's prototype, and so on. This is the prototype chain. It ends at Object.prototype,
// whose prototype is null.
//
// a) Implement `createRabbit`. Create the rabbit with Object.create(animal), which returns a
//    new, empty object whose prototype is `animal`. Then give the rabbit its own `name`. Don't
//    copy anything else: the rabbit inherits `eats` and describe() from animal.
//    (Object.create() returns the type any, so give your variable a type: const rabbit: Animal)
//      createRabbit('Bugs').describe() -> 'Bugs eats plants'
//      Object.keys(createRabbit('Bugs')) -> ['name']    (Object.keys() lists only own properties)
//
// b) Implement `findDepth`: how many steps up the prototype chain JavaScript has to go to find
//    `key`. 0 means that obj has the property itself, and -1 means that no object in the chain
//    has it. Hint: loop until you reach null. In each step, check Object.hasOwn(current, key),
//    then move on to Object.getPrototypeOf(current).
//      findDepth(['a', 'b'], 'length') -> 0            (every array has its own length)
//      findDepth(['a', 'b'], 'map') -> 1               (map() is stored in Array.prototype)
//      findDepth(['a', 'b'], 'hasOwnProperty') -> 2    (stored in Object.prototype)
//      findDepth(['a', 'b'], 'fly') -> -1

interface Animal {
  name: string;
  eats: string;
  describe(): string;
}

const animal: Animal = {
  name: 'Animal',
  eats: 'plants',
  describe(): string {
    return `${this.name} eats ${this.eats}`;
  },
};

function createRabbit(name: string): Animal {
  // TODO
  throw new Error('TODO: implement createRabbit');
}

function findDepth(obj: object, key: string): number {
  // TODO
  throw new Error('TODO: implement findDepth');
}

// ---------------------------------------------------------------------------
// Exercise 3: Classes in JavaScript (concept 5.3)
// ---------------------------------------------------------------------------
// Classes are built on prototypes: the methods of BankAccount are stored once, in
// BankAccount.prototype, and every account finds them through its prototype chain.
//
// a) Implement the methods `deposit` and `withdraw`. withdraw() takes the money out and returns
//    true. When the balance is too low, it changes nothing and returns false.
//      const account = new BankAccount('Ada');
//      account.deposit(100);    account.withdraw(30) -> true    account.withdraw(500) -> false
//      account.balance -> 70
//
// b) The underscore in `_balance` is only a naming convention that means "please don't touch".
//    Any code can still change it: account._balance = 1000000. Make the field really private:
//    rename it to `#balance`, everywhere in the class. JavaScript then blocks every access from
//    outside the class. The getter `balance` still lets other code read the balance, but not
//    change it.
//      Object.keys(new BankAccount('Ada')) -> ['owner']    (a #private field is not a property)
//
// c) `SavingsAccount` extends BankAccount: it has everything a BankAccount has, plus an
//    interest rate. Implement its constructor: first call super(owner), which runs the
//    constructor of BankAccount, then store the interest rate. TypeScript reports an error
//    until the constructor calls super(). Then implement addInterest(): it deposits
//    balance * interestRate. #balance belongs to BankAccount alone, so even a subclass can't
//    use it. Use the getter `balance` and deposit() instead.
//      const savings = new SavingsAccount('Grace', 0.05);
//      savings.deposit(1000);    savings.addInterest();    savings.balance -> 1050
//      savings instanceof BankAccount -> true    (a SavingsAccount is also a BankAccount)

class BankAccount {
  owner: string;
  _balance = 0; // TODO: make this field private (task b)

  constructor(owner: string) {
    this.owner = owner;
  }

  get balance(): number {
    return this._balance;
  }

  deposit(amount: number): void {
    // TODO
    throw new Error('TODO: implement deposit');
  }

  withdraw(amount: number): boolean {
    // TODO
    throw new Error('TODO: implement withdraw');
  }
}

class SavingsAccount extends BankAccount {
  interestRate: number;

  constructor(owner: string, interestRate: number) {
    // TODO: call super(owner), then store interestRate
    throw new Error('TODO: implement the SavingsAccount constructor');
  }

  addInterest(): void {
    // TODO
    throw new Error('TODO: implement addInterest');
  }
}

// ---------------------------------------------------------------------------
// Exercise 4: Classes in TypeScript (concept 5.4)
// ---------------------------------------------------------------------------
// TypeScript adds a few keywords to classes. It checks them, then removes them before the code
// runs:
//   - `implements Shape`: the class must have everything that the interface Shape describes.
//   - `readonly`: the field can't change after the constructor has set it.
//   - `private` and `protected`: only the class itself (with protected, also its subclasses)
//     may use the member. Unlike #private (Exercise 3), this is only checked by TypeScript.
//
// a) `Circle` should be a Shape, but nothing tells TypeScript so, and area() has a bug: it
//    returns a string, because toFixed() turns the number into text. Write `implements Shape`
//    after `class Circle`, like Square does. TypeScript now reports that area() doesn't fit
//    the interface. Fix area(), so that it returns the area as a number.
//      new Circle(2).area() -> 12.566370614359172    (Math.PI * radius ** 2)
//
// b) Implement `totalArea`: the sum of the areas of all the shapes in the list. The type
//    Shape[] accepts every object with a name and an area() method: Squares, Circles, and
//    even plain objects that no class created.
//      totalArea([new Square(2), new Square(3)]) -> 13
//      totalArea([new Square(1), { name: 'Blob', area: () => 10 }]) -> 11
//
// Try it: uncomment the line `// new Square(2).side = 5;`. TypeScript reports an error, because
// `side` is readonly. Run the file anyway: unlike Object.freeze() in Exercise 1, the line runs
// without a problem, because readonly only exists in TypeScript. Comment it out again afterwards.
//
// TypeScript also has a shorthand for fields that the constructor sets, parameter properties:
//   class Square { constructor(readonly side: number) {} }
// Like an enum, it makes TypeScript generate extra JavaScript code, so Node.js can't run it
// without a build step. That's why the classes in this file declare their fields separately.

interface Shape {
  readonly name: string;
  area(): number;
}

class Square implements Shape {
  readonly name = 'Square';
  readonly side: number;

  constructor(side: number) {
    this.side = side;
  }

  area(): number {
    return this.side ** 2;
  }
}

// TODO: make Circle implement Shape, then fix area()
class Circle {
  readonly name = 'Circle';
  readonly radius: number;

  constructor(radius: number) {
    this.radius = radius;
  }

  area(): string {
    return (Math.PI * this.radius ** 2).toFixed(2);
  }
}

function totalArea(shapes: Shape[]): number {
  // TODO
  throw new Error('TODO: implement totalArea');
}

// new Square(2).side = 5;

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
check('1a createTemperature(20).fahrenheit', () => createTemperature(20).fahrenheit, 68);
check('1a createTemperature(100).fahrenheit', () => createTemperature(100).fahrenheit, 212);
check(
  '1a fahrenheit follows changes of celsius',
  () => {
    const temperature = createTemperature(0);
    temperature.celsius = 30;
    return temperature.fahrenheit;
  },
  86,
);
check(
  '1a setting fahrenheit to 50 updates celsius',
  () => {
    const temperature = createTemperature(0);
    temperature.fahrenheit = 50;
    return temperature.celsius;
  },
  10,
);
check(
  '1b deepFreeze(settings) freezes settings',
  () => {
    const settings = { language: 'en', theme: { colors: { text: 'black' } }, tags: ['a', 'b'] };
    deepFreeze(settings);
    return Object.isFrozen(settings);
  },
  true,
);
check(
  '1b deepFreeze(settings) also freezes theme, theme.colors and tags',
  () => {
    const settings = { language: 'en', theme: { colors: { text: 'black' } }, tags: ['a', 'b'] };
    deepFreeze(settings);
    return [Object.isFrozen(settings.theme), Object.isFrozen(settings.theme.colors), Object.isFrozen(settings.tags)];
  },
  [true, true, true],
);

// Exercise 2
check("2a createRabbit('Bugs').describe()", () => createRabbit('Bugs').describe(), 'Bugs eats plants');
check(
  "2a the prototype of createRabbit('Bugs') is animal",
  () => Object.getPrototypeOf(createRabbit('Bugs')) === animal,
  true,
);
check("2a Object.keys(createRabbit('Bugs'))", () => Object.keys(createRabbit('Bugs')), ['name']);
check("2b findDepth(['a', 'b'], 'length')", () => findDepth(['a', 'b'], 'length'), 0);
check("2b findDepth(['a', 'b'], 'map')", () => findDepth(['a', 'b'], 'map'), 1);
check("2b findDepth(['a', 'b'], 'hasOwnProperty')", () => findDepth(['a', 'b'], 'hasOwnProperty'), 2);
check("2b findDepth(['a', 'b'], 'fly')", () => findDepth(['a', 'b'], 'fly'), -1);

// Exercise 3
check(
  '3a deposit(100), then withdraw(30): [result, balance]',
  () => {
    const account = new BankAccount('Ada');
    account.deposit(100);
    return [account.withdraw(30), account.balance];
  },
  [true, 70],
);
check(
  '3a withdraw(500) from a balance of 100: [result, balance]',
  () => {
    const account = new BankAccount('Ada');
    account.deposit(100);
    return [account.withdraw(500), account.balance];
  },
  [false, 100],
);
check("3b Object.keys(new BankAccount('Ada'))", () => Object.keys(new BankAccount('Ada')), ['owner']);
check(
  '3c SavingsAccount at 5%: deposit(1000), then addInterest(): [owner, balance]',
  () => {
    const savings = new SavingsAccount('Grace', 0.05);
    savings.deposit(1000);
    savings.addInterest();
    return [savings.owner, savings.balance];
  },
  ['Grace', 1050],
);
check(
  '3c a SavingsAccount is also a BankAccount',
  () => new SavingsAccount('Grace', 0.05) instanceof BankAccount,
  true,
);

// Exercise 4
check('4a new Circle(2).area()', () => new Circle(2).area(), Math.PI * 4);
check('4b totalArea([new Square(2), new Square(3)])', () => totalArea([new Square(2), new Square(3)]), 13);
check(
  "4b totalArea([new Square(1), { name: 'Blob', area: () => 10 }])",
  () => totalArea([new Square(1), { name: 'Blob', area: () => 10 }]),
  11,
);

console.log(`\n${passed} passed, ${failed} failed`);
if (failed === 0) console.log('All checks pass. Well done! 🎉');
