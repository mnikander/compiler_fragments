// Copyright (c) 2025 Marco Nikander

import assert from "assert";
import { CppDocument } from "../cpp_document";
import { generate } from "../generate";

export function is_if(ast: any): boolean {
    let [head, ...tail] = ast;
    return head == "if"; // || head == "?";
}

export function generate_if(ast: any, doc: CppDocument): CppDocument {
    let [head, ...tail] = ast;
    assert(tail.length == 3, `'if' requires 3 arguments, ${tail.length} provided: <${tail.toString()}>`);
    doc.body += `((`;
    doc = generate(tail[0], doc);
    doc.body += `) ? (`;
    doc = generate(tail[1], doc);
    doc.body += `) : (`;
    doc = generate(tail[2], doc);
    doc.body += `))`;
    return doc;
}
