// Copyright (c) 2025 Marco Nikander

import assert from "assert";
import { CppDocument } from "../cpp_document";
import { generate } from "../generate";

export function is_display(ast: any): boolean {
    let [head, ...tail] = ast;
    return head == "display";
}

export function generate_display(ast: any, doc: CppDocument): CppDocument {
    let [head, ...tail] = ast;
    assert(tail.length == 1, `'display' requires 1 argument, ${tail.length} provided: <${tail.toString()}>`);
    doc.body += "std::cout << ";
    doc = generate(tail[0], doc);
    doc.body += " << std::endl;\n";
    return doc;
}
