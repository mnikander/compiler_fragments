// Copyright (c) 2025 Marco Nikander

import assert from "assert";
import { CppDocument } from "../cpp_document";
import { generate } from "../generate";

export function is_lambda(ast: any): boolean {
    let [head, ...tail] = ast;
    return head == "lambda" || head == "->";
}

export function generate_lambda(ast: string[] | string[][], doc: CppDocument): CppDocument {
    let [head, ...tail] = ast;
    if (tail.length == 2) {
        doc.body += "[](";
        doc = generate_lambda_arguments(tail[0], doc);
        doc.body += "){ return ";
        doc = generate(tail[1], doc);
        doc.body += "; }";
    }
    else {
        assert(false, `'lambda' requires 2 arguments, ${tail.length} provided <${tail.toString}>`);
        doc.body += " /* ERROR: INCORRECT NUMBER OF ARGUMENTS */ ";
    }
    return doc;
}

function generate_lambda_arguments(args: string | string[], doc: CppDocument): CppDocument {
    if (args instanceof Array) {
        for (let i = 0; i < args.length; i++) {
            doc.body += `auto const& ${args[i]}`;
            if ((i + 1) < args.length) {
                doc.body += ', ';
            }
        }
    }
    else if (typeof args === 'string') {
        doc.body += `auto const& ${args}`;
    }
    else
    {
        assert(false, `invalid function argument <${args}> of type <${typeof args}>`);
        doc.body += "/* ERROR: INVALID FUNCTION ARGUMENT */";
    }
    return doc;
}
