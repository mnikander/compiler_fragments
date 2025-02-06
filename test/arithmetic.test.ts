// Copyright (c) 2025 Marco Nikander

import { describe, it, expect } from 'vitest';
import { cpp_toolchain } from "../src/cpp_toolchain";
import { generate } from "../src/generate";

describe('Arithmetic', () => {

    it('(display (add 1 2))', () => {
        let ast = ["display", ["add", 1, 2]];
        let filename: string = "test_add";
        let content: string = generate(ast);
        const result: string = cpp_toolchain(filename, content);
        expect(result).toBe("3\n");
    });

    it('(display (+ 1 2))', () => {
        let ast = ["display", ["+", 1, 2]];
        let filename: string = "test_add";
        let content: string = generate(ast);
        const result: string = cpp_toolchain(filename, content);
        expect(result).toBe("3\n");
    });

    it('(display (add 1 (add 2 4)))', () => {
        let ast = ["display", ["add", 1, ["add", 2, 4]]]
        let filename: string = "test_add_nested_right";
        let content: string = generate(ast);
        const result: string = cpp_toolchain(filename, content);
        expect(result).toBe("7\n");
    });

    it('(display (add (add 1 2) 4))', () => {
        let ast = ["display", ["add", ["add", 1, 2], 4]];
        let filename: string = "test_add_nested_left";
        let content: string = generate(ast);
        const result: string = cpp_toolchain(filename, content);
        expect(result).toBe("7\n");
    });

    it('(display (- 1 2))', () => {
        let ast = ["display", ["-", 1, 2]];
        let filename: string = "test_add";
        let content: string = generate(ast);
        const result: string = cpp_toolchain(filename, content);
        expect(result).toBe("-1\n");
    });
});
