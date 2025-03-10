// Copyright (c) 2025 Marco Nikander

import { describe, it, expect } from 'vitest';
import { cpp_toolchain } from '../src/cpp_toolchain'
import { generate } from '../src/generate';

// (display 0.1)
let ast = ["display", 0.1];

describe('Float', () => {

    it('direct', () => {
        let code = generate(ast[1]);
        expect(code).toBe("0.1");
    });

    it('(display 0.1)', () => {
        let filename: string = "test_float";
        let content: string = generate(ast);
        const result: string = cpp_toolchain(filename, content);
        expect(result).toBe("0.1\n");
    });
});
