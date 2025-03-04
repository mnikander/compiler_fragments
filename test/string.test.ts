// Copyright (c) 2025 Marco Nikander

import { describe, it, expect } from 'vitest';
import { cpp_toolchain } from '../src/cpp_toolchain'
import { generate } from '../src/generate';
import { cpp_default, CppDocument } from '../src/cpp_document';

// (display "Hello, world.")
let data = ["display", "\"Hello, world.\""];

describe('String', () => {
    it('direct', () => {
        let content: CppDocument = cpp_default();
        content = generate(data[1], content);
        expect(content.body).toBe('"Hello, world."');
    });

    it('(display "Hello, world.")', () => {
        let filename: string = "test_string";
        let content: CppDocument = cpp_default();
        content = generate(data, content);
        const result: string = cpp_toolchain(filename, content);
        expect(result).toBe("Hello, world.\n");
    });
});
