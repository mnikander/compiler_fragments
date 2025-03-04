// Copyright (c) 2025 Marco Nikander

import { cpp_default, CppDocument } from "./cpp_document";
import { cpp_toolchain } from "./cpp_toolchain";
import { generate } from './generate';

// (display "Hello, world.")
let text = ["display", "\"Hello, world.\""];

// (display (add 1 2))
let addition = ["display", ["add", 1, 2]];

let filename: string = "main";
let document: CppDocument = cpp_default();
document = generate(text, document);
document = generate(addition, document);
const result: string = cpp_toolchain(filename, document);
console.log(result);
