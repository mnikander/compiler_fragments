// Copyright (c) 2025 Marco Nikander

import assert from "assert";
import { CppDocument } from "../cpp_document";
import { generate } from "../generate";

export function is_equal(ast: any): boolean {
    let [head, ...tail] = ast;
    return head == "equal" || head == "==";
}

export function generate_equal(ast: any, doc: CppDocument): CppDocument {
    let [head, ...tail] = ast;
    assert(tail.length == 2, `'equal' requires 2 arguments, ${tail.length} provided: <${tail.toString()}>`);
    doc.body += `std::equal_to<>{}(`;
    doc = generate(tail[0], doc);
    doc.body += ", ";
    doc = generate(tail[1], doc);
    doc.body += ")";
    return doc;
}
