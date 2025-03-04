// Copyright (c) 2025 Marco Nikander

import assert from "assert";
import { CppDocument } from "../cpp_document";
import { generate } from "../generate";

export function generate_function_application(ast: any[], doc: CppDocument): CppDocument {
    let [head, ...tail] = ast;
    doc = generate(head, doc);
    doc.body += "(";
    for (let i = 0; i < tail.length; i++) {
        doc = generate(tail[i], doc);
        if ((i + 1) < tail.length) {
            doc.body += ', ';
        }
    }
    doc.body +=  ")";
    return doc;
}
