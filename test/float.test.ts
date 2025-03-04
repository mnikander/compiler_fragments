// Copyright (c) 2025 Marco Nikander

import { describe, it, expect } from 'vitest';
import { cpp_toolchain } from '../src/cpp_toolchain'
import { generate } from '../src/generate';
import { cpp_default, CppDocument } from '../src/cpp_document';

// (display 0.1)
let data = ["display", 0.1];

describe('Float', () => {

    it('direct', () => {
        let content : CppDocument = cpp_default();
        content = generate(data[1], content);
        expect(content.body).toBe("0.1");
    });

    it('(display 0.1)', () => {
        let filename: string = "test_float";
        let content: CppDocument = cpp_default();
        content = generate(data, content);
        const result: string = cpp_toolchain(filename, content);
        expect(result).toBe("0.1\n");
    });
});
