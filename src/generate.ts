// Copyright (c) 2025 Marco Nikander

import assert from "assert";
import { generate_atom } from "./lexeme/atom";
import { generate_function_application } from "./lexeme/application";
import { is_add, generate_add } from "./lexeme/add";
import { is_define, generate_define } from "./lexeme/define";
import { is_display, generate_display } from "./lexeme/display";
import { is_divide, generate_divide } from "./lexeme/divide";
import { is_error, generate_error } from "./lexeme/error";
import { is_multiply, generate_multiply } from "./lexeme/multiply";
import { is_subtract, generate_subtract } from "./lexeme/subtract";
import { is_equal, generate_equal } from "./lexeme/equal";
import { is_lambda, generate_lambda } from "./lexeme/lambda";
import { is_if, generate_if } from "./lexeme/if";
import { CppDocument } from "./cpp_document";

// TODO: set reasonable type information for the 'ast' parameter
export function generate(ast: any, doc: CppDocument): CppDocument {
    if (ast instanceof Array) {
        if (is_display(ast)) {
            doc = generate_display(ast, doc);
        }
        else if (is_error(ast)) {
            doc = generate_error(ast, doc);
        }
        else if (is_add(ast)) {
            doc = generate_add(ast, doc);
        }
        else if (is_subtract(ast)) {
            doc = generate_subtract(ast, doc);
        }
        else if (is_multiply(ast)) {
            doc = generate_multiply(ast, doc);
        }
        else if (is_divide(ast)) {
            doc = generate_divide(ast, doc);
        }
        else if (is_equal(ast)) {
            doc = generate_equal(ast, doc);
        }
        else if (is_define(ast)) {
            doc = generate_define(ast, doc);
        }
        else if (is_lambda(ast)) {
            doc = generate_lambda(ast, doc);
        }
        else if (is_if(ast)) {
            doc = generate_if(ast, doc);
        }
        else {
            doc = generate_function_application(ast, doc);
        }
    }
    else if (typeof ast !== 'undefined') {
        doc = generate_atom(ast, doc);
    }
    else {
        assert(false, "undefined node");
        doc.body += "/* ERROR: UNDEFINED NODE */";
    }
    return doc;
}
