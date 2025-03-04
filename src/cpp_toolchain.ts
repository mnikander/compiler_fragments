// Copyright (c) 2025 Marco Nikander

import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { CppDocument } from './cpp_document';

function clearfiles(filename: string): string {
    return `echo '// empty cpp file' > out/artifacts/${filename}.cpp && echo 'empty' > out/artifacts/${filename}.txt`;
}

function finalize(doc: CppDocument): CppDocument {
    doc = includes(doc);
    doc = main(doc);
    return doc;
}

function flatten(doc: CppDocument): string {
    let result: string = doc.includes + doc.functions + doc.body;
    return result;
}

function write(filename: string, doc: CppDocument): string {
    return "echo '" + flatten(doc) + `' > out/artifacts/${filename}.cpp`;
}

function compile(filename: string): string {
    return `g++ -o out/artifacts/${filename} out/artifacts/${filename}.cpp`;
}

function execute(filename: string): string {
    return `./out/artifacts/${filename} > out/artifacts/${filename}.txt`;
}

function read(filename: string): string {
    return `cat ./out/artifacts/${filename}.txt`;
}

export function cpp_toolchain(filename: string, doc: CppDocument): string {
    assert(!/\s/g.test(filename), "filename must not contain whitespace.");
    doc = finalize(doc);
    let command: string = clearfiles(filename) + " && "
                        + write(filename, doc) + " && "
                        + compile(filename) + " && "
                        + execute(filename) + " && "
                        + read(filename);

    try {
        // more info on execSync: https://nodejs.org/api/child_process.html#synchronous-process-creation
        let stdout = execSync(command, { stdio: 'pipe' });
        return stdout.toString();
    } catch (error) {
        return `Error while executing C++ toolchain:\n${error}`;
    }
}

function includes(doc: CppDocument): CppDocument {
    doc.includes += `// generated C++ code
#include <cmath>
#include <cstdlib>
#include <iostream>
#include <functional>

`;
    return doc;
}

function main(doc: CppDocument): CppDocument {
    doc.body = `int main() {
${doc.body}
return EXIT_SUCCESS;
}
`;
    return doc;
}
