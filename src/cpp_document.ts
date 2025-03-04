// Copyright (c) 2025 Marco Nikander

export interface CppDocument {
    includes: string,
    functions: string,
    body: string
    lambda_counter: number;
}

export function cpp_default(): CppDocument {
    let doc: CppDocument = { includes: "", functions: "", body: "", lambda_counter: 0};
    return doc;
}
