# `null`

> The `null` value represents the intentional absence of any object value. It is one of JavaScript's primitive values and is treated as falsy for boolean operations. [#mdn][null]

```js
typeof null; // "object" (not "null" for legacy reasons)
typeof undefined; // "undefined"
null === undefined; // false
null == undefined; // true
null === null; // true
null == null; // true
!null; // true
Number.isNaN(1 + null); // false
Number.isNaN(1 + undefined); // true
```

# Optional chaining (`?.`)

```js
const dogName = adventurer.dog?.name; // undefined
console.log(adventurer.someNonExistentMethod?.()); // undefined
console.log(arr?.[42]); // undefined
```

> If the object accessed or function called using this operator is `undefined` or `null`, the expression short circuits and evaluates to **`undefined`** _instead of throwing an error_. [#mdn][opchain]

# Regular expression

```js
const re = /ab+c/;
```

```js
const re = new RegExp("ab+c");
```

```js
const myArray = /d(b+)d/g.exec("cdbbdbsbz");
// [ 'dbbd', 'bb', index: 1, input: 'cdbbdbsbz' ]
```

```js
const myArray = 'cdbbdbsbz'.match(/d(b+)d/g);
// [ "dbbd" ]
````

- `RegExp` methods:

  - `re.exec()`
  - `re.test()`

- `String` methods:

  - `string.match()`
  - `string.matchAll()`
  - `string.search()`
  - `string.replace()`
  - `string.replaceAll()`
  - `string.split()`

[#mdn][regex]

# Template literals (Template strings)

```js
`string text`

`string text line 1
 string text line 2`

`string text ${expression} string text`

tagFunction`string text ${expression} string text`
```

**Ref:** <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals>

# Try-catch

```js
try {
  throw new Error("oops");
} catch (ex) {
  console.error("inner", ex.message);
} finally {
  console.log("finally");
}

// "inner" "oops"
// "finally"
```

```js
try {
  try {
    throw new Error("oops");
  } catch (ex) {
    console.error("inner", ex.message);
    throw ex;
  } finally {
    console.log("finally");
  }
} catch (ex) {
  console.error("outer", ex.message);
}

// "inner" "oops"
// "finally"
// "outer" "oops"
```

> Control flow statements (return, throw, break, continue) in the finally block will "mask" any completion value of the try block or catch block. [#mdn][try]

> Note: If the finally block returns a value, this value becomes the return value of the entire try-catch-finally statement, regardless of any return statements in the try and catch blocks. [#mdn][try]

```js
(() => {
  try {
    try {
      throw new Error("oops");
    } catch (ex) {
      console.error("inner", ex.message);
      throw ex;
    } finally {
      console.log("finally");
      return;
    }
  } catch (ex) {
    console.error("outer", ex.message);
  }
})();

// "inner" "oops"
// "finally"
```

# export

* Named exports are useful when you need to export several values.
  When importing this module, named exports must be referred to
  by the exact same name (optionally renaming it with as),
  but the default export can be imported with any name.

* Having exports with duplicate names
  or using more than one `default` export
  will result in a `SyntaxError`.

## Named exports

- export var, let, const, function, class

```js
    export { myFunction2, myVariable2 };

    export { myFunction as function1, myVariable as variable };

    export let myVariable = Math.sqrt(2);

    export function myFunction() {}
```

- `export` is only a declaration, doesn't utilize the value of `x`.

```js
    export { x };
    const x = 1;
```

## Default exports

```js
    export { myFunction as default };

    export default myFunction;

    export default function foo() {}

    export default 1 + 1;
```

- As a special case, functions and classes
  are exported as declarations, not expressions,
  and these declarations can be anonymous.

```js
    export default function () {}

    export default class {}
```

## Re-exporting / Aggregating

```js
    export { x } from "mod";

    export { x as v } from "mod";

    export * as ns from "mod";

    export { default as DefaultExport } from "bar.js";

    export { default, function2 } from "bar.js";
```

**Ref:** <https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/export>

# import

* `import` declarations can only be present in modules,
  and only at the top-level (i.e. not inside blocks, functions, etc.).

* The imported bindings are called live bindings
  because they are updated by the module that exported the binding,
  but cannot be re-assigned by the importing module.

* Named and default imports
  are distinct syntaxes in JavaScript modules.

* There is `export * from "mod"`,
  there's no `import * from "mod"`.
  See [Namespace import](#namespace-import).

## Named import

- The value named `myExport` has been "exported" from the module `my-module`.

```js
    import { myExport } from "/modules/my-module.js";

    import { foo, bar } from "/modules/my-module.js";

    import { reallyReallyLongName as shortName } from "module.js";
```

## Default import

- You can give the identifier any name you like.

```js
    import myDefault from "/modules/my-module.js";
```

- The default import will have to be declared first.
  `myModule.default` and `myDefault` point to the same binding.

```js
    import myDefault, * as myModule from "/modules/my-module.js";

    import myDefault, { foo, bar } from "/modules/my-module.js";
```

## Namespace import

- `myModule` represents a namespace object
  which contains all exports as properties.

```js
    import * as myModule from "module.js";
```

- The default export available as a key called `default`.

## Import a JSON file

```js
    import data from './data.json' assert { type: 'JSON' };
    // or use `with` keyword (since March, 2023)
    import data from './data.json' with { type: 'JSON' };
```

**Ref:**

- <https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/import>
- <https://www.freecodecamp.org/news/how-to-read-json-file-in-javascript/>
- <https://bobbyhadz.com/blog/javascript-import-json-file>

# `import()`

* A function-like expression.
  Commonly called "dynamic import".
  Loads a module in a "non-module" environment,
  "asynchronously" and "dynamically".

* Use dynamic import only when necessary.
  The static form is preferable.

- Returns a promise
  which fulfills to a "module namespace object":
  an object containing all exports from `moduleName`.

```js
    import(moduleName)
```

- Each module specifier corresponds to a unique module namespace object.

```js
    import * as mod from "/my-module.js";

    import("/my-module.js").then((mod2) => {
        console.log(mod === mod2); // true
    });
```

## Module namespace object

- A sealed object with null prototype.
  All string keys of the object correspond to the exports,
  and there are never extra keys.

- All keys are enumerable in lexicographic order.
  The default export available as a key called `default`.
  It has a @@toStringTag property with the value `"Module"`.

> Warning: Do not export a function called `then()`.

## Import a JSON file

```js
    import('myData.json').then(({default: myData}) => myData);
```

```js
    import('myData.json').then(module => module.default);
```

```js
    import("foo.json", { assert: { type: "json" } });
```

**Ref:**

- <https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/import>
- <https://dev.to/thatamymac/dynamic-imports-of-json-ipl>
- <https://stackoverflow.com/questions/60140331/>

# Inheritance and the prototype chain

- When it comes to inheritance, JavaScript only has one construct: **objects**.

- JavaScript objects are dynamic "bags" of properties.

- Each object has a private property which holds
a link to another object called its prototype. 

- That prototype object has a prototype of its own,
and so on until an object is reached with null as its **prototype**.

- In JavaScript, as mentioned above, functions are able to have properties.
All functions have a special property named **prototype**.

- Classes are syntax sugar over constructor functions,
which means you can still manipulate prototype
to change the behavior of all instances.

```js
    function Base() {}
    function Derived() {}
    // Set the `[[Prototype]]` of `Derived.prototype`
    // to `Base.prototype`
    Object.setPrototypeOf(Derived.prototype, Base.prototype);

    const obj = new Derived();
    // obj ---> Derived.prototype ---> Base.prototype ---> Object.prototype ---> null
```

In class terms, this is equivalent to using the `extends` syntax:

```js
    class Base {}
    class Derived extends Base {}

    const obj = new Derived();
    // obj ---> Derived.prototype ---> Base.prototype ---> Object.prototype ---> null
```

**Ref:** <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain>

[null]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/null
[opchain]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining
[regex]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions
[try]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch
