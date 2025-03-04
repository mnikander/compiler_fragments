// Copyright (c) 2025 Marco Nikander

import assert from "assert";
import { CppDocument } from "../cpp_document";
import { generate } from "../generate";

export function is_error(ast: any): boolean {
    let [head, ...tail] = ast;
    return head == "error";
}

export function generate_error(ast: any, doc: CppDocument): CppDocument {
    let [head, ...tail] = ast;
    assert(tail.length == 1, `'error' requires 1 argument, ${tail.length} provided: <${tail.toString()}>`);
    doc.body += `std::cerr << "Error: " << `;
    doc = generate(tail[0], doc);
    doc.body += ` << std::endl;\nstd::abort();\n`;
    return doc;
}
