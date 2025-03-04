// Copyright (c) 2025 Marco Nikander

import assert from "assert";
import { CppDocument } from "../cpp_document";
import { generate } from "../generate";

export function is_define(ast: any): boolean {
    let [head, ...tail] = ast;
    return head == "define";
}

export function generate_define(ast: any, doc: CppDocument): CppDocument {
    let [head, ...tail] = ast;
    if (tail.length == 1) {
        doc.body += "auto const "
        doc = generate(tail[0], doc);
        doc.body += ";";
    }
    else if (tail.length == 2) {
        doc.body += "auto const ";
        doc = generate(tail[0], doc);
        doc.body += " = ";
        doc = generate(tail[1], doc);
        doc.body += ";\n";
    } else {
        assert(false, `'define' requires 1 or 2 arguments, ${tail.length} provided <${tail.toString}>`);
        doc.body += " /* ERROR: INCORRECT NUMBER OF ARGUMENTS */ ";
    }
    return doc;
}
