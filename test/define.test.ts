// Copyright (c) 2025 Marco Nikander

import { describe, it, expect } from 'vitest';
import { cpp_toolchain } from '../src/cpp_toolchain'
import { generate } from '../src/generate';
import { cpp_default, CppDocument } from '../src/cpp_document';

// (define x 2)
let define_x = ["define", "x", 2];

// (display x)
let display_x = ["display", "x"];

describe('Define', () => {

    it('(define x 2)', () => {
        let filename: string = "test_define";
        let content: CppDocument = generate(define_x, cpp_default());
        const result: string = cpp_toolchain(filename, content);
        expect(result).toBe("");
    });

    it('(define x 2); (display x)', () => {
        let filename: string = "test_define_display";
        let content: CppDocument = cpp_default();
        content = generate(define_x, content);
        content = generate(display_x, content);
        const result: string = cpp_toolchain(filename, content);
        expect(result).toBe("2\n");
    });
});
