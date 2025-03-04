// Copyright (c) 2025 Marco Nikander

import { describe, it, expect } from 'vitest';
import { cpp_toolchain } from '../src/cpp_toolchain'
import { generate } from '../src/generate';
import { cpp_default, CppDocument } from '../src/cpp_document';

describe('lambda', () => {
    let simple = ["lambda", ["a", "b"], "a"]; // (lambda (a b) a)
    it('direct', () => {
        let content: CppDocument = cpp_default();
        content = generate(simple, content);
        expect(content.body).toBe("[](auto const& a, auto const& b){ return a; }");
    });
    
    it('(display ((lambda (a b) a) 1 2))', () => {
        let data = ["display", [["lambda", ["a", "b"], "a"], 1, 2]];
        let filename: string = "test_lambda_immediate";
        let content: CppDocument = cpp_default();
        content = generate(data, content);
        const result: string = cpp_toolchain(filename, content);
        expect(result).toBe("1\n");
    });

    it('(display ((-> (a b) a) 1 2))', () => {
        let data = ["display", [["->", ["a", "b"], "a"], 1, 2]];
        let filename: string = "test_lambda_arrow_immediate";
        let content: CppDocument = cpp_default();
        content = generate(data, content);
        const result: string = cpp_toolchain(filename, content);
        expect(result).toBe("1\n");
    });

    it('(define first (lambda (a b) a)); (display (first 1 2))', () => {
        let abstraction = ["define", "first", ["lambda", ["a", "b"], "a"]];
        let application = ["display", ["first", 1, 2]];
        let filename: string = "test_lambda_named";
        let content: CppDocument = cpp_default();
        content = generate(abstraction, content);
        content = generate(application, content);
        const result: string = cpp_toolchain(filename, content);
        expect(result).toBe("1\n");
    });

    it('(define first (lambda (a b) a)); (define second (lambda (a b) b)); (display ((first first second) 1 2))', () => {
        let first = ["define", "first", ["lambda", ["a", "b"], "a"]];
        let second = ["define", "second", ["lambda", ["a", "b"], "b"]];
        let application = ["display", [["first", "first", "second"], 1, 2]];
        let filename: string = "test_lambda_2nd_order";
        let content: CppDocument = cpp_default();
        content = generate(first, content);
        content = generate(second, content);
        content = generate(application, content);
        const result: string = cpp_toolchain(filename, content);
        expect(result).toBe("1\n");
    });

    // // TODO: make recursion possible; I will probably have to switch from lambdas to functions or function objects for this
    // it('(define countdown (lambda x (if (equal x 0)(0)(countdown (-x 1)))))', () => {
    //     let abstraction = ["define", "countdown", ["lambda", "x", ["if", ["equal", "x", 0], 0, ["countdown", ["-", "x", 1]]]]];
    //     let application = ["display", ["countdown", 5]];
    //     let filename: string = "test_lambda_recursion";
    //     let content: CppDocument = cpp_default();
    //     content = generate(abstraction, content);
    //     content = generate(application, content);
    //     const result: string = cpp_toolchain(filename, content);
    //     expect(result).toBe("1\n");
    // });

    // // TODO: make co-recursion possible. In C++ this requires a forward declaration. I would probably have to
    // //       switch from lambdas to function objects, and forward declare the object, in order to implement this
    // // (define even (lambda x (if (equal x 0) (True) (odd (- x 1))))
    // // (define odd (lambda x (even (- x 1)))
    // // (display (even 5))
    // it('even and odd', () => {
    //     let even = ["define", "even", ["lambda", "x", ["if", ["equal", "x", 0], "True",["odd", ["-", "x", 1]]]]];
    //     let odd = ["define", "second", ["lambda", "x", ["even", ["-", "x", 1]]]];
    //     let application = ["display", ["even", 5]];
    //     let filename: string = "test_lambda_2nd_order";
    //     let content: CppDocument = cpp_default();
    //     content = generate(even, content);
    //     content = generate(odd, content);
    //     content = generate(application, content);
    //     const result: string = cpp_toolchain(filename, content);
    //     expect(result).toBe("false\n");
    // });
});
