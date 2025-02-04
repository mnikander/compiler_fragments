# Compiler fragments

This repository contains code fragments for the _intermediate code generation_ stage of a compiler.
The aim is to experiment with a few language features and learn more about compilers.
Each code fragment transforms one kind of node in an abstract syntax tree (AST) into target code.
The underlying assumption is that the AST nodes all have a homogeneous structure, stemming from a language similar to Lisp, for example.
The following function application:

```lisp
(define x 5)
```

might be parsed into the following AST node in JSON form:

```json
{
    "lexeme": "Application",
    "operator": {
        "lexeme": "Abstraction",
        "value": "define"
    },
    "arguments": [
        {
            "lexeme": "Variable",
            "value": "x"
        },
        {
            "lexeme": "Integer",
            "value": 5
        }
    ]
}
```

This AST node could then be transformed into the following C++ code:

```c++
const int x = 5;
```

## Getting Started

1. Clone this repo
2. Ensure you have _nodejs_, _npm_, and _g++_ installed
3. `npm run main` to build and run the example
4. `npm test` to build and run the unit tests

Both the main function and the unit tests will automatically transpile their abstract syntax trees to C++ and then compile and execute the resulting programs. 
If you wish to build the main program without immediately executing it, you can use `npm run build` and then manually execute it with `./out/artifacts/main`.
You can find all generated source files, executables, and result files containing the output on stdout, in the directory `out/artifacts`.

## System Design
This section outlines key design decisions, the system design, and the pipeline employed for development and testing.

### Choice of the Implementation Language

The code generator itself is written in TypeScript, so that it can be integrated into a [Langium](https://langium.org/) project.
The ecosystem provided by _NodeJS_ and _npm_ also provide much easier access to a huge number of libraries and packages, which speeds up development.
The runtime performance of the _code generator_ is currently not a concern, since the goal is to prototype a few language features.

### Choice of the Target Language

Several target languages were considered: LLVM IR, WebAssembly, C, C++, JavaScript, and TypeScript.
The web-based languages allow executing the program in a browser, which is great for usability.
The assembly languages could provide the best runtime performance.
C++ was chosen as the target language because it's fast and provides useful abstractions.
This makes it easier to develop and debug the code generator, than if LLVM IR or WebAssembly were used instead.
It is beneficial if the architecture and testing pipelines support adding another target language later on though.

### Test Design

There are many ways to generate C++ code for one particular language keyword or feature.
For example, `const int x = 5;` and `int const x = 5;` mean the same thing.
Another example is that an expression such as `(lambda (a b) a)` can be translated into C++ lambda expressions or into function objects.
Being able to easily experiment with several different implementations, is an important factor during development.
There are several options for how to test the code generation alongside its development:
1. string comparison on the generated C++ code
2. snapshot testing, where the generated code is compared to an earlier snapshot of the generated code
3. compile and execute the generated code

#### 1. String Comparison
The string comparison approach executes quickly and ensures that the code is exactly what is expected.
String comparision tests require updating of test-cases though, if the code generation is refactored even a little bit.
Furthermore, test cases via string comparison would have to be re-implemented from scratch for each additional target language.

#### 2. Snapshot testing
Snapshot testing is easy to implement: just add the generated C++ files to the git repository and keep an eye out for changes.
Snapshot testing doesn't check the correctness of the code though.
It will probably be used, but not as the primary test mechanism.

#### 3. Compilation and Execution
The last option, to compile and execute the generated code can be tedious to implement and may take a while especially when the number of test-cases is large.
This can be mitigated by only executing the test cases for files which have been modified.
The chosen unit testing framework, Vitest, does exactly this.

This testing strategy means that the result of the executed code must be passed to the surrounding unit test somehow, for example by printing to stdout.
A test for addition could be `(display (+ 1 2))`, i.e. the expression to be tested is wrapped inside the command to print to the console.
Since these tests only check the output of the executed program, these tests are agnostic to implementation details.
Other than the call to the compilation pipeline, these tests are also agnostic with regard to the chosen target language.
This should keep the amount of maintenance work low, as the codebase evolves.

Since only the output of the executable is tested, some properties of the generated code cannot be tested directly.
This may require extra test cases.
Since only the expected result must be specified in the test-case, unit tests should be fast and easy to write.

Since the transpiler is implemented in TypeScript, the unit tests will also be implemented in TypeScript.
This avoids unecessary complexity and allows using excellent packages available via _npm_.
The primary testing strategy will look like this:

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
It _can_ be helpful for debugging purposes, but this step might be removed soon.

---
**Copyright (c) 2025 Marco Nikander**
