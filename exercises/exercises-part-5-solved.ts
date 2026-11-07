/**
 * Solutions – Part 5: Objects under the hood and classes
 * (concepts 5.1–5.4 in JS-TS-Concepts.md)
 *
 * Try exercises-part-5.ts on your own first. Your solution doesn't have to match this one
 * exactly: if all checks pass and the type check reports no errors, your solution is fine.
 *
 *   Run:        node exercises-part-5-solved.ts
 *   Type check: npx -p typescript tsc --ignoreConfig --noEmit exercises-part-5-solved.ts
 */

export {}; // makes this file a module, so its names don't clash with other exercise files

// ---------------------------------------------------------------------------
// Exercise 1: Getters, setters and Object.freeze (concept 5.1)
// ---------------------------------------------------------------------------

interface Temperature {
  celsius: number;
  fahrenheit: number;
}

function createTemperature(celsius: number): Temperature {
  return {
    celsius, // the only value that is stored
    get fahrenheit(): number {
      return (this.celsius * 9) / 5 + 32; // calculated from celsius on every read
    },
    set fahrenheit(value: number) {
      this.celsius = ((value - 32) * 5) / 9; // converted back and stored in celsius
    },
  };
}

function deepFreeze(obj: object): void {
  for (const value of Object.values(obj)) {
    if (typeof value === 'object' && value !== null) {
      deepFreeze(value); // the function calls itself for the nested object, at any depth
    }
  }
  Object.freeze(obj);
}

const colors = Object.freeze({ primary: 'blue', secondary: 'grey' });

// colors.primary = 'red'; // Error: Cannot assign to 'primary' because it is a read-only property.

// ---------------------------------------------------------------------------
// Exercise 2: Prototypes and the prototype chain (concept 5.2)
// ---------------------------------------------------------------------------

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
  const rabbit: Animal = Object.create(animal); // a new, empty object whose prototype is animal
  rabbit.name = name; // an own property; it hides animal.name
  return rabbit; // eats and describe() are found in the prototype
}

function findDepth(obj: object, key: string): number {
  let current: object | null = obj;
  let depth = 0;
  while (current !== null) {
    if (Object.hasOwn(current, key)) return depth;
    current = Object.getPrototypeOf(current); // one step up the chain
    depth++;
  }
  return -1; // we reached the end of the chain without finding the key
}

// ---------------------------------------------------------------------------
// Exercise 3: Classes in JavaScript (concept 5.3)
// ---------------------------------------------------------------------------

class BankAccount {
  owner: string;
  #balance = 0; // private: only code inside this class can use it

  constructor(owner: string) {
    this.owner = owner;
  }

  get balance(): number {
    return this.#balance;
  }

  deposit(amount: number): void {
    this.#balance += amount;
  }

  withdraw(amount: number): boolean {
    if (amount > this.#balance) return false; // not enough money: change nothing
    this.#balance -= amount;
    return true;
  }
}

class SavingsAccount extends BankAccount {
  interestRate: number;

  constructor(owner: string, interestRate: number) {
    super(owner); // runs the constructor of BankAccount, which stores the owner
    this.interestRate = interestRate; // `this` can only be used after super()
  }

  addInterest(): void {
    // #balance is private to BankAccount, so use the getter and deposit()
    this.deposit(this.balance * this.interestRate);
  }
}

// ---------------------------------------------------------------------------
// Exercise 4: Classes in TypeScript (concept 5.4)
// ---------------------------------------------------------------------------

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

class Circle implements Shape {
  readonly name = 'Circle';
  readonly radius: number;

  constructor(radius: number) {
    this.radius = radius;
  }

  area(): number {
    return Math.PI * this.radius ** 2; // round the number only where you display it
  }
}

function totalArea(shapes: Shape[]): number {
  // Every Shape has area(), so TypeScript allows the call, whatever kind of shape it is
  return shapes.reduce((sum, shape) => sum + shape.area(), 0);
}

// new Square(2).side = 5; // Error: Cannot assign to 'side' because it is a read-only property.

// ===========================================================================
// Checks: the same checks as in exercises-part-5.ts
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
