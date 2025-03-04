// Copyright (c) 2025 Marco Nikander

import assert from "assert";
import { CppDocument } from "../cpp_document";

export function generate_atom(ast: any, doc: CppDocument): CppDocument {
    if (typeof ast === 'string') {
        if (ast == "True") {
            doc.body += "true";
        }
        else if (ast === "False") {
            doc.body += "false";
        }
        else {
            doc.body += ast;
        }
    }
    else if (ast !== Object(ast)) { // primitive data-type (not an object)
        doc.body += ast.toString();
    }
    else {
        assert(false, `invalid symbol <${ast.toString()}> of type <${typeof ast}>`);
        doc.body += "/* ERROR: INVALID SYMBOL */";
    }
    return doc;
}
