// Copyright (c) 2025 Marco Nikander

import assert from "assert";
import { CppDocument } from "../cpp_document";
import { generate } from "../generate";

export function is_multiply(ast: any): boolean {
    let [head, ...tail] = ast;
    return head == "multiply" || head == "*";
}

export function generate_multiply(ast: any, doc: CppDocument): CppDocument {
    let [head, ...tail] = ast;
    assert(tail.length == 2, `'multiply' requires 2 arguments, ${tail.length} provided: <${tail.toString()}>`);
    doc.body += `std::multiplies<>{}(`
    doc = generate(tail[0], doc);
    doc.body += ", ";
    doc = generate(tail[1], doc);
    doc.body += `)`;
    return doc;
}
