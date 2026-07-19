# Compiler fragments

This repository contains code fragments for the _intermediate code generation_ stage of a compiler, for a Lisp-like language.
The aim is to experiment with a few language features and learn more about compilers.
The following [symbolic expression](https://en.wikipedia.org/wiki/S-expression):

```lisp
(define x 5)
```
can easily be parsed into the following abstract syntax tree, in JSON form:

```json
["define", "x", 5]
```

This AST can then be transpiled into C++ code:

```c++
const auto x = 5;
```

## Getting Started

1. Clone this repo
2. Ensure you have _nodejs_, _npm_, and _g++_ installed
3. `npm run main` to build and run the example
4. `npm test` to build and run the unit tests

Both the main function and the unit tests will automatically transpile their abstract syntax trees to C++ and then compile and execute the resulting programs. 
If you wish to build the main program without immediately executing it, you can use `npm run build` and then manually execute it with `./out/artifacts/main`.
You can find all generated source files, executables, and result text files, in the directory `out/artifacts`.

## System Design
The following sections outline key design decisions, the system design, as well as the pipeline employed for development and testing.

### Choice of the Implementation Language

The code generator itself is written in TypeScript, in the hopes of running it inside of a browser one day.
_NodeJS_ and _npm_ also provide easy access to a huge number of libraries and modules.
Compared to a language such as C++, this can speed up development significantly.
The runtime performance of the _code generator_ is currently not a concern, since the goal is to prototype a few language features and not to create a production grade compiler.
This code generator could also be integrated into a project built with [Langium](https://langium.org/) to get syntax highlighting and auto-completion in VS code.

### Choice of the Target Language

Several target languages were considered: LLVM IR, WebAssembly, C, C++, JavaScript, and TypeScript.
The web-based languages allow executing the program in a browser, which is great for usability.
The assembly languages could provide the best runtime performance.
C++ was chosen as the target language, however, because it's fast and provides useful abstractions.
This makes it easier to develop and debug the code generator, than if LLVM IR or WebAssembly were used instead.
It is highly beneficial, though, if the architecture and testing pipelines support adding another target language later on.

### Notation for Abstract Syntax Trees

Depending on how the grammar is defined, the AST can become very complicated, very quickly.
The expression `(display (add 1 (add 2 4)))` _could_ be parsed to a huge AST such as:

```json
{
    "$type": "Display",
    "value": {
        "$type": "Call",
        "value": [
            {
                "$type": "Abstraction",
                "value": "add"
            },
            {
                "$type": "Integer",
                "value": 1
            },
            {
                "$type": "Call",
                "value": [
                    {
                        "$type": "Abstraction",
                        "value": "add"
                    },
                    {
                        "$type": "Integer",
                        "value": 2
                    },
                    {
                        "$type": "Integer",
                        "value": 4
                    }
                ]
            }
        ]
    }
}
```

Lisp-like languages have a [famously simple grammar](https://iamwilhelm.github.io/bnf-examples/lisp), though.
The explicit parentheses of the symbolic expressions make it very easy to create an AST in JSON form:
```json
{
    "symbolic_expression": "(display (add 1 (add 2 4)))",
    "json_ast" :  ["display", ["add", 1, ["add", 2, 4]]]
}
```
This far more compact notation is much easier to write and work with than the long-form notation above.
For these reasons, this minimalist approach was chosen.

Adding type-annotations would make the AST more complicated.
Every element in the JSON array must be replaced by an object.
This representation would still be quite simple, though:

```json
{
    "symbolic_expression": "(display (add 1 (add 2 4)))",
    "json_ast":
    [
        {"display": "i64 -> Output"},
        [
            {"add": "[i64 i64] -> i64"},
            {"1": "i64"},
            [
                {"add": "[i64 i64] -> i64"},
                {"2": "i64"},
                {"4": "i64"}
            ]
        ]
    ]
}
```

### Test Design

Testing the code generator effectively, presents a number of challenges:
1. How can the correctness of the code generation be ensured?
2. How can unit tests for code generation be written easily?
3. How can the maintenance effort for unit tests be kept low, even if the code generation is frequently refactored?
4. How could the code generation for two different target languages be tested effectively?
5. How can alternative implementations for the same language feature be tested?

In general, there are several options for how to test the code generation including:
1. string comparison on the generated C++ code
2. snapshot testing, where the generated code is compared to an earlier snapshot of the generated code
3. compile and execute the generated code

#### 1. String Comparison
The string comparison approach executes quickly and ensures that the code is exactly what is expected.
There are many ways to generate C++ code for one particular AST node, however.
For example: `const int x = 5;` and `int const x = 5;` mean the same thing.
An expression such as `(lambda (a b) a)` can be translated into C++ lambda expressions or into function objects.
Having to modify the unit tests, every time the code generation is tweaked slightly, could be very time-consuming.
Furthermore, test cases via string comparison would have to be re-implemented from scratch for each additional target language.
This makes testing via string comparisons unattractive for this project.

#### 2. Snapshot testing
Snapshot testing is easy to implement: just add the generated C++ files to the git repository and keep an eye out for changes.
Snapshot testing doesn't check the correctness of the code though.
It will probably be used, but not as the primary test mechanism.

#### 3. Compilation and Execution
The last option, to compile and execute the generated code can be tedious to implement.
It can also take a while to run a large number of test-cases.
This can be mitigated by executing only those test cases which are effected by recently modified files.
The chosen unit testing framework, Vitest, does exactly this.

This overall testing strategy means that the result of the executed code must be passed to the unit test.
This can be done by printing to stdout or writing the result to a file.
A test for addition could be `(display (+ 1 2))`, i.e. the expression to be tested is wrapped inside the command to print to the console.
Since these tests only check the output of the executed program, they are agnostic to implementation details.
Other than the call to the compilation pipeline, these tests are also agnostic to the target language.
This should keep the amount of maintenance work low, as the codebase evolves.

Testing only the output of the executable does have some drawbacks, however.
Some properties of the generated code cannot be tested directly.
This may require extra test cases.
Fortunately, most black-box tests should be fast and easy to write.

The C++ toolchain for unit testing has the following structure:

```
+-----------------------+
| TypeScript unit test  |
| - JSON string for AST |
| - Expected result     |
+-----------------------+
           v
           v  ... generate code
           v
  +------------------+
  | C++ source files |
  +------------------+
           v
           v  ... call a C++ compiler
           v
    +-------------+
    | Executable  |
    +-------------+
           v
           v  ... run executable and
           v      pipe output to a file
           v
    +-------------+
    | Result file |
    +-------------+
           v
           v
           v
  +------------------+
  | Check output vs. |
  | expected value   |
  +------------------+
```

**Note**: Piping the output to a file is optional, since stdout can be read by the unit test directly.
It _can_ be helpful for debugging purposes, but this step might be removed in the future, for simplicity.

---
**Copyright (c) 2025 Marco Nikander**
