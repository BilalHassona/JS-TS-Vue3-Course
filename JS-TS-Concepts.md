# JavaScript + TypeScript: Concept List with Tutorials

This list covers the JavaScript and TypeScript concepts students should know by the end of the course. It starts where the [w3schools JavaScript Tutorial](https://www.w3schools.com/js/) leaves off: students already know the chapters from **JS Syntax** to **JS Maps**, plus **JS Data Types**. JavaScript and TypeScript are taught side by side. TypeScript basics come first, then every later JavaScript topic is written and typed in TypeScript.

Each concept links free tutorials from 2–3 websites. Most come from [javascript.info](https://javascript.info/), [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript), [w3schools](https://www.w3schools.com/typescript/), the official [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html) and the free online book [Total TypeScript Essentials](https://www.totaltypescript.com/books/total-typescript-essentials). Students can try TypeScript snippets in the [TypeScript Playground](https://www.typescriptlang.org/play/).

## How to use this list

- **Tags:**
  - `[JS]` JavaScript concept
  - `[TS]` TypeScript concept
  - `[JS+TS]` JavaScript feature plus how to type it in TypeScript
  - `[Tool]` tooling
- **Order:** Parts are in teaching order, roughly one Part per week. Later Parts build on earlier ones.
- **Each concept** has two parts:
  - **Learn** lists the subtopics to cover.
  - **Sources** lists one link per bullet, taken from 2–3 websites.
- **Optional:** Part 13 contains stretch topics.

## Contents

- [Part 0: Setup and tooling](#part-0-setup-and-tooling)
- [Part 1: TypeScript basics for what you already know](#part-1-typescript-basics-for-what-you-already-know)
- [Part 2: Modern JavaScript for working with data](#part-2-modern-javascript-for-working-with-data)
- [Part 3: Functions in depth](#part-3-functions-in-depth)
- [Part 4: Unions, narrowing and modeling data](#part-4-unions-narrowing-and-modeling-data)
- [Part 5: Objects under the hood and classes](#part-5-objects-under-the-hood-and-classes)
- [Part 6: Generics and deriving types](#part-6-generics-and-deriving-types)
- [Part 7: Error handling](#part-7-error-handling)
- [Part 8: Asynchronous JavaScript](#part-8-asynchronous-javascript)
- [Part 9: Data from the outside world](#part-9-data-from-the-outside-world)
- [Part 10: Modules and project tooling](#part-10-modules-and-project-tooling)
- [Part 11: The browser: DOM and events](#part-11-the-browser-dom-and-events)
- [Part 12: Proxies and the observer pattern](#part-12-proxies-and-the-observer-pattern)
- [Part 13 (optional): Stretch topics](#part-13-optional-stretch-topics)

---

## Part 0: Setup and tooling

### 0.1 Node.js and nvm `[Tool]`
- **Learn:** what Node.js is (JavaScript outside the browser) and why front-end tools need it; LTS vs Current releases; installing Node.js with nvm (Node Version Manager) instead of a system installer; `nvm install --lts`, `nvm use`, `nvm ls` and `nvm alias default`; pinning a project's Node.js version in an `.nvmrc` file; nvm-windows, a separate tool with similar commands, for Windows; checking versions with `node -v` and `npm -v`.
- **Sources:**
  - [nvm – README: installing and using nvm (macOS/Linux)](https://github.com/nvm-sh/nvm)
  - [nvm-windows – README: the Node.js version manager for Windows](https://github.com/nvm-windows/nvm)
  - [Node.js – Download Node.js](https://nodejs.org/en/download) (shows the nvm install commands for the current LTS)
  - [Node.js – Node.js Releases](https://nodejs.org/en/about/previous-releases) (what LTS means)

### 0.2 npm and package.json `[Tool]`
- **Learn:** creating a project with `npm init`; what `package.json` contains (`name`, `version`, `scripts`, `dependencies`, `devDependencies`, `"type": "module"`); installing packages (`npm install`, `npm install -D`); version ranges (`^`, `~`); `package-lock.json` and `npm ci`; the `node_modules` folder (never committed to Git); running npm scripts; `npx`.
- **Sources:**
  - [Node.js – An introduction to the npm package manager](https://nodejs.org/learn/getting-started/an-introduction-to-the-npm-package-manager)
  - [npm Docs – Creating a package.json file](https://docs.npmjs.com/creating-a-package-json-file/)
  - [npm Docs – package.json](https://docs.npmjs.com/cli/configuring-npm/package-json/) (reference for every field)
  - [MDN – Package management basics](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Client-side_tools/Package_management)

### 0.3 Vite `[Tool]`
- **Learn:** what a dev server and a build tool do; creating a project with `npm create vite@latest` (vanilla + TypeScript template); the project structure (`index.html`, `src/`, `public/`); `npm run dev`, `npm run build` and `npm run preview`; hot module replacement (HMR); Vite only strips types, so type-checking is a separate step (`tsc --noEmit`).
- **Sources:**
  - [Vite – Getting Started](https://vite.dev/guide/)
  - [Vite – Features: TypeScript](https://vite.dev/guide/features#typescript)
  - [MDN – Client-side tooling overview](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Client-side_tools/Overview)

### 0.4 What TypeScript is and how it runs `[TS]`
- **Learn:** static vs dynamic typing; TypeScript as "JavaScript + types"; types are checked at compile time and erased at runtime; type-checking with `tsc` vs tools that only strip types (Vite, recent Node.js versions); reading type errors in the editor; the TypeScript Playground.
- **Sources:**
  - [TypeScript Handbook – TypeScript for JavaScript Programmers](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)
  - [w3schools – TS Introduction](https://www.w3schools.com/typescript/typescript_intro.php)
  - [w3schools – TS Get Started](https://www.w3schools.com/typescript/typescript_getstarted.php)
  - [Total TypeScript Essentials – TypeScript in the Development Pipeline](https://www.totaltypescript.com/books/total-typescript-essentials/typescript-in-the-development-pipeline)

### 0.5 tsconfig.json and strict mode `[TS]`
- **Learn:** what `tsconfig.json` controls (`target`, `lib`, `module`, `moduleResolution`, `include`, `noEmit`); the `strict` family (`noImplicitAny`, `strictNullChecks`, …) and why to keep it on; running `tsc --noEmit` as a type-check step; TypeScript 6.0 defaults (`strict: true`, `types: []`); splitting settings across several tsconfig files with project references.
- **Sources:**
  - [TypeScript Handbook – What is a tsconfig.json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)
  - [TSConfig Reference – strict](https://www.typescriptlang.org/tsconfig/#strict)
  - [w3schools – TS Configuration](https://www.w3schools.com/typescript/typescript_config.php)
  - [Total TypeScript Essentials – Configuring TypeScript](https://www.totaltypescript.com/books/total-typescript-essentials/configuring-typescript)

### 0.6 Debugging `[Tool]`
- **Learn:** `console` methods (`log`, `table`, `error`, `dir`); browser DevTools (Sources panel, breakpoints, conditional breakpoints, stepping, watch expressions, call stack); source maps for debugging TypeScript in the browser; the IDE debugger.
- **Sources:**
  - [javascript.info – Debugging in the browser](https://javascript.info/debugging-chrome)
  - [Chrome DevTools – Debug JavaScript](https://developer.chrome.com/docs/devtools/javascript)
  - [w3schools – JS Debugging](https://www.w3schools.com/js/js_debugging.asp)
  - [w3schools – Debug Breakpoints](https://www.w3schools.com/js/js_debugging_breakpoints.asp)

---

## Part 1: TypeScript basics for what you already know

### 1.1 JavaScript types recap: coercion, equality and truthiness `[JS]`
- **Learn:** primitive vs reference types; `typeof` quirks (`null`, arrays, functions); implicit type coercion; `==` vs `===` vs `Object.is` (including `NaN` and `-0`); truthy and falsy values. These are the bugs that motivate TypeScript.
- **Sources:**
  - [javascript.info – Type Conversions](https://javascript.info/type-conversions)
  - [javascript.info – Comparisons](https://javascript.info/comparison)
  - [MDN – Equality comparisons and sameness](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Equality_comparisons_and_sameness)
  - [w3schools – JS Type Coercion](https://www.w3schools.com/js/js_type_coercion.asp)

### 1.2 Type annotations and type inference `[TS]`
- **Learn:** annotating variables, parameters and return values; primitive types (`string`, `number`, `boolean`, `bigint`, `symbol`, `null`, `undefined`); letting TypeScript infer types vs annotating explicitly; literal inference with `const` vs `let`; reading error messages and hover info in the editor.
- **Sources:**
  - [TypeScript Handbook – Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)
  - [w3schools – TS Simple Types](https://www.w3schools.com/typescript/typescript_simple_types.php)
  - [w3schools – TS Explicit & Inference](https://www.w3schools.com/typescript/typescript_explicit_inference.php)
  - [Total TypeScript Essentials – Essential Types and Annotations](https://www.totaltypescript.com/books/total-typescript-essentials/essential-types-and-annotations)

### 1.3 Special types: any, unknown, never, void, null and undefined `[TS]`
- **Learn:** why `any` switches off type checking; `unknown` as the safe alternative, which must be narrowed before use; `never` for impossible values; `void` for functions that return nothing; `null` and `undefined` under `strictNullChecks`; annotating values that start as `null` (`let user: User | null = null`); optional (`?`) vs `| undefined`.
- **Sources:**
  - [w3schools – TS Special Types](https://www.w3schools.com/typescript/typescript_special_types.php)
  - [w3schools – TS Null](https://www.w3schools.com/typescript/typescript_null.php)
  - [TypeScript Handbook – Other Types to Know About](https://www.typescriptlang.org/docs/handbook/2/functions.html#other-types-to-know-about)
  - [Total TypeScript Essentials – Unions, Literals, and Narrowing](https://www.totaltypescript.com/books/total-typescript-essentials/unions-literals-and-narrowing) (section "unknown and never")

### 1.4 Arrays and tuples `[TS]`
- **Learn:** `T[]` vs `Array<T>`; arrays of objects and of unions; `readonly` arrays; tuples (fixed length, named and optional elements); annotating empty arrays (`const ids: number[] = []`).
- **Sources:**
  - [w3schools – TS Arrays](https://www.w3schools.com/typescript/typescript_arrays.php)
  - [w3schools – TS Tuples](https://www.w3schools.com/typescript/typescript_tuples.php)
  - [TypeScript Handbook – Tuple Types](https://www.typescriptlang.org/docs/handbook/2/objects.html#tuple-types)
  - [Total TypeScript Essentials – Essential Types and Annotations](https://www.totaltypescript.com/books/total-typescript-essentials/essential-types-and-annotations) (section "Arrays and Tuples")

### 1.5 Object types `[TS]`
- **Learn:** inline object types; optional (`?`) and `readonly` properties; nested objects; excess property checks; dynamic keys with index signatures and `Record<K, V>`.
- **Sources:**
  - [TypeScript Handbook – Object Types](https://www.typescriptlang.org/docs/handbook/2/objects.html)
  - [w3schools – TS Object Types](https://www.w3schools.com/typescript/typescript_object_types.php)
  - [w3schools – TS Index Signatures](https://www.w3schools.com/typescript/typescript_index_signatures.php)
  - [Total TypeScript Essentials – Objects](https://www.totaltypescript.com/books/total-typescript-essentials/objects)

### 1.6 Type aliases and interfaces `[TS]`
- **Learn:** naming types with `type` and `interface`; extending with `extends` vs combining with intersections (`&`); the differences between the two and when to use which; declaration merging (awareness).
- **Sources:**
  - [w3schools – TS Aliases & Interfaces](https://www.w3schools.com/typescript/typescript_aliases_and_interfaces.php)
  - [TypeScript Handbook – Differences Between Type Aliases and Interfaces](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#differences-between-type-aliases-and-interfaces)
  - [Total TypeScript – Type vs Interface: Which Should You Use?](https://www.totaltypescript.com/type-vs-interface-which-should-you-use)

### 1.7 Typing functions `[TS]`
- **Learn:** parameter and return type annotations; optional, default and rest parameters; function type expressions (`(a: number) => string`); typing callback parameters; the `void` return type; call signatures in object types; function overloads (awareness).
- **Sources:**
  - [TypeScript Handbook – More on Functions](https://www.typescriptlang.org/docs/handbook/2/functions.html)
  - [w3schools – TS Functions](https://www.w3schools.com/typescript/typescript_functions.php)
  - [Total TypeScript Essentials – Essential Types and Annotations](https://www.totaltypescript.com/books/total-typescript-essentials/essential-types-and-annotations) (section "Typing Functions")

---

## Part 2: Modern JavaScript for working with data

### 2.1 Destructuring in depth `[JS+TS]`
- **Learn:** object and array destructuring with default values, renaming, nested patterns and rest elements; swapping variables; destructuring function parameters; destructured variables are copies of the current values, not live links to the source object; typing destructured parameters.
- **Sources:**
  - [javascript.info – Destructuring assignment](https://javascript.info/destructuring-assignment)
  - [MDN – Destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring)
  - [TypeScript Handbook – Parameter Destructuring](https://www.typescriptlang.org/docs/handbook/2/functions.html#parameter-destructuring)

### 2.2 Spread and rest `[JS+TS]`
- **Learn:** spreading arrays, objects and function arguments; rest parameters; shallow copying and merging of arrays and objects; immutable updates (`{ ...user, name: 'Ada' }`); typing rest parameters and spread arguments.
- **Sources:**
  - [javascript.info – Rest parameters and spread syntax](https://javascript.info/rest-parameters-spread)
  - [MDN – Spread syntax (...)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
  - [TypeScript Handbook – Rest Parameters and Arguments](https://www.typescriptlang.org/docs/handbook/2/functions.html#rest-parameters-and-arguments)

### 2.3 Working with objects `[JS+TS]`
- **Learn:** property and method shorthand; computed property names; `Object.keys`, `Object.values`, `Object.entries` and `Object.fromEntries`; `for...in` vs `Object.entries()`; grouping with `Object.groupBy()`; why `Object.keys()` returns `string[]` in TypeScript.
- **Sources:**
  - [javascript.info – Objects](https://javascript.info/object)
  - [javascript.info – Object.keys, values, entries](https://javascript.info/keys-values-entries)
  - [w3schools – JS Object Iterations](https://www.w3schools.com/js/js_object_iterations.asp)
  - [Total TypeScript Essentials – The Weird Parts](https://www.totaltypescript.com/books/total-typescript-essentials/the-weird-parts) (section "Object Keys Are Loosely Typed")

### 2.4 Optional chaining, nullish coalescing and logical assignment `[JS+TS]`
- **Learn:** `?.` for properties, method calls and indexes; `??` vs `||` (`??` only falls back on `null`/`undefined`, `||` on any falsy value); `??=`, `||=` and `&&=`; how these operators work with `strictNullChecks`.
- **Sources:**
  - [javascript.info – Optional chaining '?.'](https://javascript.info/optional-chaining)
  - [javascript.info – Nullish coalescing operator '??'](https://javascript.info/nullish-coalescing-operator)
  - [MDN – Optional chaining (?.)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining)
  - [MDN – Nullish coalescing assignment (??=)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_assignment)
  - [TypeScript 3.7 release notes – Optional Chaining](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#optional-chaining)
  - [TypeScript 3.7 release notes – Nullish Coalescing](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#nullish-coalescing)

### 2.5 Array methods for data processing `[JS+TS]`
- **Learn:** `map`, `filter`, `reduce`, `find`/`findIndex`/`findLast`, `some`/`every`, `includes`, `flat`/`flatMap`, `at()`; sorting with a compare function; chaining methods; mutating methods vs copying methods (`toSorted`, `toReversed`, `toSpliced`, `with`); how TypeScript infers callback parameter types; typing `reduce` accumulators.
- **Sources:**
  - [javascript.info – Array methods](https://javascript.info/array-methods)
  - [MDN – Array: copying methods and mutating methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array#copying_methods_and_mutating_methods)
  - [w3schools – JS Array Iterations](https://www.w3schools.com/js/js_array_iteration.asp)

### 2.6 References, copying and immutability `[JS+TS]`
- **Learn:** primitives are copied by value, objects by reference; shallow copies (spread, `Object.assign`) vs deep copies (`structuredClone`); accidental mutation bugs; `Object.freeze`; TypeScript's `readonly`, `Readonly<T>`, `ReadonlyArray<T>` and `as const`.
- **Sources:**
  - [javascript.info – Object references and copying](https://javascript.info/object-copy)
  - [MDN – structuredClone()](https://developer.mozilla.org/en-US/docs/Web/API/Window/structuredClone)
  - [Total TypeScript Essentials – Mutability](https://www.totaltypescript.com/books/total-typescript-essentials/mutability)

---

## Part 3: Functions in depth

### 3.1 First-class and higher-order functions `[JS+TS]`
- **Learn:** functions as values; passing callbacks; passing a function instead of a value to delay evaluation (`() => user.name`); functions that return functions; higher-order functions (using `map`/`filter`, then writing your own); pure functions vs side effects; typing callbacks and function-returning functions.
- **Sources:**
  - [Eloquent JavaScript – Ch. 5: Higher-Order Functions](https://eloquentjavascript.net/05_higher_order.html)
  - [Eloquent JavaScript – Ch. 3: Functions](https://eloquentjavascript.net/03_functions.html) (side effects and pure functions)
  - [w3schools – Function Callbacks](https://www.w3schools.com/js/js_callback.asp)
  - [MDN – First-class Function](https://developer.mozilla.org/en-US/docs/Glossary/First-class_Function)

### 3.2 Scope and closures `[JS]`
- **Learn:** lexical scope; closures; function factories; private state through closures; `let` vs `var` in loops; practical closures (counters, `once`, `memoize`, `debounce`).
- **Sources:**
  - [javascript.info – Variable scope, closure](https://javascript.info/closure)
  - [MDN – Closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures)
  - [w3schools – Function Closures](https://www.w3schools.com/js/js_function_closures.asp)

### 3.3 `this`, call/apply/bind and arrow functions `[JS+TS]`
- **Learn:** how `this` is set (method call, plain function call, `new`, event handler); losing `this` when a method is passed as a callback; `call`, `apply` and `bind`; arrow functions take `this` from the surrounding scope; TypeScript's `this` parameter and `noImplicitThis`.
- **Sources:**
  - [MDN – this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)
  - [javascript.info – Function binding](https://javascript.info/bind)
  - [javascript.info – Arrow functions revisited](https://javascript.info/arrow-functions)
  - [TypeScript Handbook – Declaring this in a Function](https://www.typescriptlang.org/docs/handbook/2/functions.html#declaring-this-in-a-function)

---

## Part 4: Unions, narrowing and modeling data

### 4.1 Union and literal types `[TS]`
- **Learn:** union types (`string | number`); literal types (`'sm' | 'md' | 'lg'`) instead of "magic strings"; only members shared by every type in a union can be used directly; combining unions; literal inference and `as const`.
- **Sources:**
  - [TypeScript Handbook – Union Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types)
  - [TypeScript Handbook – Literal Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types)
  - [w3schools – TS Union Types](https://www.w3schools.com/typescript/typescript_union_types.php)
  - [w3schools – TS Literal Types](https://www.w3schools.com/typescript/typescript_literal_types.php)
  - [Total TypeScript Essentials – Unions, Literals, and Narrowing](https://www.totaltypescript.com/books/total-typescript-essentials/unions-literals-and-narrowing)

### 4.2 Narrowing and type guards `[TS]`
- **Learn:** control-flow narrowing with `typeof`, truthiness, equality, `in` and `instanceof` (plain JavaScript checks that TypeScript understands); user-defined type predicates (`value is User`); assertion functions (awareness).
- **Sources:**
  - [TypeScript Handbook – Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
  - [w3schools – TS Type Guards](https://www.w3schools.com/typescript/typescript_type_guards.php)
  - [Total TypeScript Essentials – Utility Folder Development](https://www.totaltypescript.com/books/total-typescript-essentials/utility-folder-development-in-typescript) (sections "Type Predicates" and "Assertion Functions")

### 4.3 Discriminated unions and exhaustiveness checking `[TS]`
- **Learn:** tagged unions with a shared `kind` or `status` property; narrowing with `switch`; exhaustiveness checks with `never`; modeling states such as `idle` / `loading` / `success` / `error` instead of several booleans.
- **Sources:**
  - [TypeScript Handbook – Discriminated unions](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions)
  - [TypeScript Handbook – Exhaustiveness checking](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#exhaustiveness-checking)
  - [Total TypeScript Essentials – Unions, Literals, and Narrowing](https://www.totaltypescript.com/books/total-typescript-essentials/unions-literals-and-narrowing) (section "Discriminated Unions")
  - [TypeScript Deep Dive – Discriminated Unions](https://basarat.gitbook.io/typescript/type-system/discriminated-unions)

### 4.4 Enums vs literal unions vs `as const` objects `[TS]`
- **Learn:** numeric and string enums; enums produce runtime JavaScript, unlike most TypeScript syntax; alternatives: unions of string literals and `as const` objects (`typeof obj[keyof typeof obj]`); choosing between them; the `erasableSyntaxOnly` option (awareness).
- **Sources:**
  - [TypeScript Handbook – Enums](https://www.typescriptlang.org/docs/handbook/enums.html)
  - [TypeScript Handbook – Objects vs Enums](https://www.typescriptlang.org/docs/handbook/enums.html#objects-vs-enums)
  - [w3schools – TS Enums](https://www.w3schools.com/typescript/typescript_enums.php)
  - [Total TypeScript Essentials – TypeScript-only Features](https://www.totaltypescript.com/books/total-typescript-essentials/typescript-only-features)
  - [Total TypeScript Essentials – Deriving Types](https://www.totaltypescript.com/books/total-typescript-essentials/deriving-types) (section "Using as const for JavaScript-Style Enums")

### 4.5 Type assertions, non-null assertion and `satisfies` `[TS]`
- **Learn:** annotation vs assertion; `as` and why it can hide bugs; the non-null assertion `!`; `satisfies` to check a value without widening its type; `@ts-expect-error` vs `@ts-ignore`.
- **Sources:**
  - [w3schools – TS Casting](https://www.w3schools.com/typescript/typescript_casting.php)
  - [Total TypeScript Essentials – Annotations and Assertions](https://www.totaltypescript.com/books/total-typescript-essentials/annotations-and-assertions)
  - [TypeScript 4.9 release notes – The satisfies Operator](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html#the-satisfies-operator)

---

## Part 5: Objects under the hood and classes

### 5.1 Getters, setters and property descriptors `[JS]`
- **Learn:** `get`/`set` accessors in object literals and classes; computed values and validation in setters; `Object.defineProperty` and property flags (`writable`, `enumerable`, `configurable`); `Object.freeze` vs `Object.seal`.
- **Sources:**
  - [javascript.info – Property getters and setters](https://javascript.info/property-accessors)
  - [javascript.info – Property flags and descriptors](https://javascript.info/property-descriptors)
  - [MDN – get](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get)
  - [w3schools – Object Get / Set](https://www.w3schools.com/js/js_object_accessors.asp)

### 5.2 Prototypes and the prototype chain `[JS]`
- **Learn:** `[[Prototype]]` and property lookup along the chain; own vs inherited properties; `Object.create`; how `class` syntax maps onto prototypes. Conceptual understanding is enough.
- **Sources:**
  - [javascript.info – Prototypal inheritance](https://javascript.info/prototype-inheritance)
  - [MDN – Inheritance and the prototype chain](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Inheritance_and_the_prototype_chain)
  - [w3schools – Object Prototypes](https://www.w3schools.com/js/js_object_prototypes.asp)

### 5.3 Classes in JavaScript `[JS]`
- **Learn:** class syntax; constructor, fields and methods; getters and setters; static members; private `#fields` and `#methods`; inheritance with `extends` and `super`; `instanceof`.
- **Sources:**
  - [javascript.info – Classes](https://javascript.info/classes) (chapter)
  - [MDN – Using classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_classes)
  - [w3schools – JS Classes](https://www.w3schools.com/js/js_classes.asp)
  - [w3schools – Class Inheritance](https://www.w3schools.com/js/js_class_inheritance.asp)

### 5.4 Classes in TypeScript `[TS]`
- **Learn:** typing fields and constructors; `public`/`private`/`protected` vs JavaScript `#private`; `readonly`; parameter properties; `implements` an interface; abstract classes; using a class as a type.
- **Sources:**
  - [TypeScript Handbook – Classes](https://www.typescriptlang.org/docs/handbook/2/classes.html)
  - [w3schools – TS Classes](https://www.w3schools.com/typescript/typescript_classes.php)
  - [Total TypeScript Essentials – Classes](https://www.totaltypescript.com/books/total-typescript-essentials/classes)

---

## Part 6: Generics and deriving types

### 6.1 Generics `[TS]`
- **Learn:** generic functions (`function first<T>(items: T[]): T | undefined`); type argument inference vs passing type arguments explicitly (`first<string>(names)`); generic types and interfaces (`ApiResponse<T>`); constraints (`T extends …`); default type parameters; generic classes; built-in generics such as `Array<T>`, `Promise<T>`, `Map<K, V>` and `Set<T>`.
- **Sources:**
  - [TypeScript Handbook – Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)
  - [w3schools – TS Basic Generics](https://www.w3schools.com/typescript/typescript_basic_generics.php)
  - [Total TypeScript Essentials – Utility Folder Development](https://www.totaltypescript.com/books/total-typescript-essentials/utility-folder-development-in-typescript) (section "Generic Functions")
  - [Total TypeScript Essentials – Designing Your Types](https://www.totaltypescript.com/books/total-typescript-essentials/designing-your-types-in-typescript) (section "Generic Types")

### 6.2 keyof, typeof and indexed access types `[TS]`
- **Learn:** `keyof T`; the `typeof` type operator (deriving a type from a value); indexed access types `T[K]` and `(typeof list)[number]`; keeping one source of truth instead of duplicating types.
- **Sources:**
  - [TypeScript Handbook – Keyof Type Operator](https://www.typescriptlang.org/docs/handbook/2/keyof-types.html)
  - [TypeScript Handbook – Typeof Type Operator](https://www.typescriptlang.org/docs/handbook/2/typeof-types.html)
  - [TypeScript Handbook – Indexed Access Types](https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html)
  - [w3schools – TS Keyof](https://www.w3schools.com/typescript/typescript_keyof.php)
  - [Total TypeScript Essentials – Deriving Types](https://www.totaltypescript.com/books/total-typescript-essentials/deriving-types)

### 6.3 Utility types `[TS]`
- **Learn:** `Partial`, `Required`, `Readonly`, `Pick`, `Omit`, `Record`; `Exclude`, `Extract`, `NonNullable`; `ReturnType`, `Parameters`, `Awaited`, `InstanceType`; combining them, e.g. `Omit<User, 'id'>` for a "create" payload or `ReturnType<typeof setTimeout>`.
- **Sources:**
  - [TypeScript Handbook – Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)
  - [w3schools – TS Utility Types](https://www.w3schools.com/typescript/typescript_utility_types.php)
  - [Total TypeScript Essentials – Objects](https://www.totaltypescript.com/books/total-typescript-essentials/objects) (section "Reducing Duplication with Utility Types")
  - [Total TypeScript Essentials – Deriving Types](https://www.totaltypescript.com/books/total-typescript-essentials/deriving-types)

---

## Part 7: Error handling

### 7.1 Errors and exceptions `[JS]`
- **Learn:** `try`/`catch`/`finally`; `throw`; the `Error` object (`name`, `message`, `stack`, `cause`) and built-in error types; custom error classes (`class ValidationError extends Error`); rethrowing; why errors thrown in async callbacks escape a surrounding `try`.
- **Sources:**
  - [javascript.info – Error handling, "try...catch"](https://javascript.info/try-catch)
  - [javascript.info – Custom errors, extending Error](https://javascript.info/custom-errors)
  - [MDN – Control flow and error handling: Exception handling statements](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Control_flow_and_error_handling#exception_handling_statements)
  - [w3schools – JS Error Statements](https://www.w3schools.com/js/js_errors.asp)
  - [w3schools – JS Error Object](https://www.w3schools.com/js/js_error_object.asp)

### 7.2 Type-safe error handling `[TS]`
- **Learn:** under `strict`, the error in `catch (error)` is `unknown` (`useUnknownInCatchVariables`); narrowing errors with `instanceof Error`; a `getErrorMessage(error: unknown)` helper; typed custom errors; returning a result object instead of throwing (awareness).
- **Sources:**
  - [w3schools – TS Error Handling](https://www.w3schools.com/typescript/typescript_error_handling.php)
  - [Kent C. Dodds – Get a catch block error message with TypeScript](https://kentcdodds.com/blog/get-a-catch-block-error-message-with-typescript)
  - [TSConfig Reference – useUnknownInCatchVariables](https://www.typescriptlang.org/tsconfig/#useUnknownInCatchVariables)

---

## Part 8: Asynchronous JavaScript

### 8.1 The event loop `[JS]`
- **Learn:** JavaScript runs on a single thread; the call stack; tasks (macrotasks) vs microtasks; where `setTimeout`, promises and events fit in; why long synchronous code freezes the page.
- **Sources:**
  - [javascript.info – Event loop: microtasks and macrotasks](https://javascript.info/event-loop)
  - [MDN – JavaScript execution model](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model)
  - [w3schools – Async Event Loop](https://www.w3schools.com/js/js_async_event_loop.asp)

### 8.2 Callbacks and Promises `[JS]`
- **Learn:** callback-based async code and "callback hell"; creating promises (`resolve`/`reject`); `then`/`catch`/`finally`; chaining and returning values; error propagation; `Promise.all`, `allSettled`, `race` and `any`; turning `setTimeout` into a promise.
- **Sources:**
  - [javascript.info – Promises, async/await](https://javascript.info/async) (chapter)
  - [MDN – Using promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)
  - [w3schools – Async Promises](https://www.w3schools.com/js/js_async_promises.asp)

### 8.3 async/await `[JS]`
- **Learn:** `async` functions always return a promise; `await`; code before the first `await` runs immediately, the rest runs later; error handling with `try`/`catch`; sequential vs parallel awaiting (`await` in a loop vs `Promise.all`); top-level `await` in modules; common mistakes (forgotten `await`, unhandled rejections).
- **Sources:**
  - [javascript.info – Async/await](https://javascript.info/async-await)
  - [MDN – async function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
  - [w3schools – Async Await](https://www.w3schools.com/js/js_async_await.asp)
  - [w3schools – Async Mistakes](https://www.w3schools.com/js/js_async_mistakes.asp)

### 8.4 Typing asynchronous code `[TS]`
- **Learn:** `Promise<T>` as a return type; annotating `async` functions; `Awaited<T>`; how `Promise.all` infers a tuple of results; typing values that arrive later (`T | undefined`, loading states).
- **Sources:**
  - [Total TypeScript Essentials – Essential Types and Annotations](https://www.totaltypescript.com/books/total-typescript-essentials/essential-types-and-annotations) (section "Typing Async Functions")
  - [TypeScript Handbook – Functions Which Return Promises](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#functions-which-return-promises)
  - [TypeScript Handbook – `Awaited<Type>`](https://www.typescriptlang.org/docs/handbook/utility-types.html#awaitedtype)
  - [w3schools – TS Async Programming](https://www.w3schools.com/typescript/typescript_async.php)

---

## Part 9: Data from the outside world

### 9.1 JSON `[JS+TS]`
- **Learn:** JSON syntax vs JavaScript object literals; `JSON.parse` and `JSON.stringify` (indentation, replacer/reviver); what JSON cannot represent (`Date`, `Map`, `undefined`, functions); `JSON.parse` returns `any`, so treat the result as `unknown` and check it.
- **Sources:**
  - [javascript.info – JSON methods, toJSON](https://javascript.info/json)
  - [MDN – Working with JSON](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/JSON)
  - [w3schools – JS JSON](https://www.w3schools.com/js/js_json.asp)

### 9.2 Fetch API and HTTP basics `[JS]`
- **Learn:** HTTP methods and status codes (basics); `fetch` for GET and POST (JSON body, headers); `fetch` rejects only on network failures, so check `response.ok` and `status` (a 404 or 500 does not throw); `response.json()`; cancelling requests and timeouts with `AbortController` / `AbortSignal.timeout()`; race conditions where an older, slower response arrives after a newer one; CORS (awareness).
- **Sources:**
  - [javascript.info – Fetch](https://javascript.info/fetch)
  - [javascript.info – Fetch: Abort](https://javascript.info/fetch-abort)
  - [MDN – Using the Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
  - [w3schools – JS Fetch API](https://www.w3schools.com/js/js_api_fetch.asp)
  - [w3schools – Async AbortController](https://www.w3schools.com/js/js_async_abortcontroller.asp)

### 9.3 Typing and validating API data `[TS]`
- **Learn:** describing API responses with types and interfaces; a generic helper such as `fetchJson<T>(url): Promise<T>`; why `as User` on fetched data is only a promise to the compiler; validating `unknown` data with type guards; schema validation with Zod and deriving types from schemas (`z.infer`).
- **Sources:**
  - [Kent C. Dodds – Using fetch with TypeScript](https://kentcdodds.com/blog/using-fetch-with-type-script)
  - [TypeScript Handbook – Using type predicates](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates)
  - [Zod – Basic usage](https://zod.dev/basics)

### 9.4 Web Storage `[JS+TS]`
- **Learn:** `localStorage` vs `sessionStorage`; `setItem`/`getItem`/`removeItem`; storing objects as JSON; the `storage` event; size limits and security (never store secrets); a typed helper that reads a stored value with a fallback.
- **Sources:**
  - [javascript.info – LocalStorage, sessionStorage](https://javascript.info/localstorage)
  - [MDN – Using the Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API)
  - [w3schools – API Web Storage](https://www.w3schools.com/js/js_api_web_storage.asp)

---

## Part 10: Modules and project tooling

### 10.1 ES modules `[JS]`
- **Learn:** named vs default exports; import syntax, renaming (`as`) and namespace imports (`import * as`); re-exports and index ("barrel") files; module scope and strict mode; a module runs only once, so module-level variables are shared by every importer; `<script type="module">`; dynamic `import()` for lazy loading; `import.meta`; CommonJS (`require`) awareness.
- **Sources:**
  - [javascript.info – Modules](https://javascript.info/modules) (chapter)
  - [MDN – JavaScript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
  - [w3schools – JS Modules](https://www.w3schools.com/js/js_modules.asp)

### 10.2 Modules and declaration files in TypeScript `[TS]`
- **Learn:** type-only imports and exports (`import type`, `verbatimModuleSyntax`); declaration files (`.d.ts`), the `declare` keyword and `/// <reference types="…" />` directives; types bundled with libraries vs DefinitelyTyped (`@types/…`); module augmentation (awareness); `moduleResolution: "bundler"`; path aliases with `paths`.
- **Sources:**
  - [TypeScript Handbook – Modules](https://www.typescriptlang.org/docs/handbook/2/modules.html)
  - [TypeScript Handbook – Declaration Files: Introduction](https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html)
  - [w3schools – TS Definitely Typed](https://www.w3schools.com/typescript/typescript_definitely_typed.php)
  - [Total TypeScript Essentials – Modules, Scripts, and Declaration Files](https://www.totaltypescript.com/books/total-typescript-essentials/modules-scripts-and-declaration-files)

### 10.3 Linting and formatting `[Tool]`
- **Learn:** what a linter catches that the type checker does not; ESLint with a flat config (`eslint.config.js`); typescript-eslint's recommended rules; Prettier for consistent formatting; running both from npm scripts and the IDE.
- **Sources:**
  - [ESLint – Getting Started](https://eslint.org/docs/latest/use/getting-started)
  - [typescript-eslint – Getting Started](https://typescript-eslint.io/getting-started/)
  - [Prettier – Install](https://prettier.io/docs/install)

---

## Part 11: The browser: DOM and events

### 11.1 DOM fundamentals `[JS]`
- **Learn:** the DOM tree and nodes; selecting elements (`querySelector`, `querySelectorAll`, `getElementById`); `textContent` vs `innerHTML` (and the XSS risk); attributes vs properties; `classList` and `style`; creating, inserting and removing elements; when scripts run (`defer`, `DOMContentLoaded`).
- **Sources:**
  - [javascript.info – Document](https://javascript.info/document) (chapter)
  - [MDN – DOM scripting introduction](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/DOM_scripting)
  - [w3schools – JS HTML DOM](https://www.w3schools.com/js/js_htmldom.asp)

### 11.2 Events `[JS]`
- **Learn:** `addEventListener`/`removeEventListener` (removing needs the same function reference); the event object; `target` vs `currentTarget`; bubbling and capturing; event delegation; `preventDefault()` and `stopPropagation()`; form events (`input`, `change`, `submit`) and reading form controls (`value`, `checked`); keyboard and mouse events; custom events (`CustomEvent`).
- **Sources:**
  - [javascript.info – Introduction to Events](https://javascript.info/events) (chapter)
  - [MDN – Introduction to events](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Events)
  - [w3schools – JS HTML Events](https://www.w3schools.com/js/js_events.asp)

### 11.3 Typing the DOM and events `[TS]`
- **Learn:** DOM types from `lib.dom` (`HTMLElement`, `HTMLInputElement`, `HTMLButtonElement`, …); `querySelector` returns `Element | null`; `querySelector<HTMLInputElement>()` and `getElementById(…) as HTMLCanvasElement`; narrowing with `instanceof`; event types (`Event`, `MouseEvent`, `KeyboardEvent`, `SubmitEvent`); typing `event.target`.
- **Sources:**
  - [TypeScript Handbook – DOM Manipulation](https://www.typescriptlang.org/docs/handbook/dom-manipulation.html)
  - [TypeScript Handbook – Type Assertions](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions)
  - [bobbyhadz – How to use document.querySelector() in TypeScript](https://bobbyhadz.com/blog/typescript-queryselector)
  - [MDN – Interfaces based on Event](https://developer.mozilla.org/en-US/docs/Web/API/Event#interfaces_based_on_event)

---

## Part 12: Proxies and the observer pattern

### 12.1 Proxy and Reflect `[JS+TS]`
- **Learn:** what a `Proxy` is; common traps (`get`, `set`, `has`, `deleteProperty`); forwarding operations with `Reflect`; use cases (validation, logging, reacting to changes); limitations (a proxy is a different object from its target, and primitives cannot be proxied); typing handlers with `ProxyHandler<T>`.
- **Sources:**
  - [javascript.info – Proxy and Reflect](https://javascript.info/proxy)
  - [MDN – Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)
  - [w3schools – Meta Proxy](https://www.w3schools.com/js/js_meta_proxy.asp)
  - [w3schools – Meta Reflect](https://www.w3schools.com/js/js_meta_reflect.asp)

### 12.2 The observer (publish/subscribe) pattern `[JS+TS]`
- **Learn:** subjects and observers; `subscribe` / `unsubscribe` / `notify`; returning an unsubscribe function; a small typed event emitter (`on<K extends keyof Events>(…)`); how DOM events follow the same idea.
- **Sources:**
  - [patterns.dev – Observer Pattern](https://www.patterns.dev/vanilla/observer-pattern/)
  - [Refactoring.Guru – Observer](https://refactoring.guru/design-patterns/observer)
  - [Refactoring.Guru – Observer in TypeScript](https://refactoring.guru/design-patterns/observer/typescript/example)

---

## Part 13 (optional): Stretch topics

### 13.1 Mapped, conditional and template literal types `[TS]`
- **Learn:** mapped types (`{ [K in keyof T]: … }`) and key remapping; conditional types (`T extends U ? X : Y`) and `infer` (awareness); template literal types; how the built-in utility types are built from these; enough to read complex library types in editor hovers and error messages.
- **Sources:**
  - [TypeScript Handbook – Mapped Types](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html)
  - [TypeScript Handbook – Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)
  - [TypeScript Handbook – Template Literal Types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html)
  - [w3schools – TS Mapped Types](https://www.w3schools.com/typescript/typescript_mapped_types.php)
  - [w3schools – TS Conditional Types](https://www.w3schools.com/typescript/typescript_conditional_types.php)
  - [Total TypeScript Essentials – Designing Your Types](https://www.totaltypescript.com/books/total-typescript-essentials/designing-your-types-in-typescript)

### 13.2 Iterators and generators `[JS]`
- **Learn:** the iteration protocol (`Symbol.iterator`, `next()`); making your own objects iterable; generator functions (`function*`, `yield`); lazy sequences; async iteration with `for await...of` (awareness).
- **Sources:**
  - [javascript.info – Iterables](https://javascript.info/iterable)
  - [javascript.info – Generators](https://javascript.info/generators)
  - [MDN – Iterators and generators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_generators)
  - [w3schools – JS Iterables](https://www.w3schools.com/js/js_iterables.asp)
  - [w3schools – JS Generators](https://www.w3schools.com/js/js_generators.asp)

### 13.3 Regular expressions `[JS]`
- **Learn:** creating patterns and flags; character classes, quantifiers, anchors and groups; `test`, `match`, `matchAll`, `replace`; practical validation patterns (e-mail addresses, postal codes) and their limits.
- **Sources:**
  - [javascript.info – Regular expressions](https://javascript.info/regular-expressions)
  - [MDN – Regular expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions)
  - [w3schools – JS RegExp](https://www.w3schools.com/js/js_regexp.asp)

### 13.4 Unit testing with Vitest `[Tool]`
- **Learn:** why automated tests matter; test structure (`describe`, `it`/`test`, `expect`); testing pure functions first; running tests in watch mode; test-driven development (awareness).
- **Sources:**
  - [Vitest – Getting Started](https://vitest.dev/guide/)
  - [javascript.info – Automated testing with Mocha](https://javascript.info/testing-mocha) (the concepts carry over to Vitest)

### 13.5 JavaScript versions, browser support and transpiling `[JS]`
- **Learn:** yearly ECMAScript versions (ES2015 to today); checking browser support (Baseline); transpilers vs polyfills; how TypeScript's `target` and `lib` options relate to this.
- **Sources:**
  - [javascript.info – Polyfills and transpilers](https://javascript.info/polyfills)
  - [w3schools – JS Versions](https://www.w3schools.com/js/js_versions.asp)
  - [web.dev – Baseline](https://web.dev/baseline)

---

**Not covered:** this list leaves out jQuery, XMLHttpRequest/AJAX and JSONP, Canvas and graphics libraries, Typed Arrays/ArrayBuffer/Atomics, Web Workers, TypeScript namespaces, decorators, mixins and the new Temporal date API.
