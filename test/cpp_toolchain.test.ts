// Copyright (c) 2025 Marco Nikander

import { describe, it, expect } from 'vitest';
import { cpp_toolchain } from '../src/cpp_toolchain'
import { cpp_default, CppDocument } from '../src/cpp_document';

describe('C++ Toolchain', () => {

    // TODO: figure out why part of the error message still makes it through to the Vitest console
    //       maybe it's printing some stuff to stdout before the process exits with the error
    it('error message', () => {
        let filename: string = "test_cpp_error";
        let content: CppDocument = cpp_default();
        content.body = 'provoke_error; // use an unknown variable name to cause a compilation error';
        const result: string = cpp_toolchain(filename, content).split('\n')[0];
        expect(result).toBe("Error while executing C++ toolchain:");
    });

    it('hello world', () => {
        let filename: string = "test_cpp_hello";
        let content: CppDocument = cpp_default();
        content.body = 'std::cout << "Hello, world" << std::endl;';
        const result: string = cpp_toolchain(filename, content);
        expect(result).toBe("Hello, world\n");
    });
});
