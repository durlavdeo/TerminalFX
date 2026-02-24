export const successSignals = [
  // Node / JS frameworks
  "ready",
  "listening",
  "server running",
  "running at",
  "local:",
  "localhost",
  "compiled successfully",
  "build succeeded",
  "started server on",
  "webpack compiled",
  "hmr ready",

  // Python
  "running on http",
  "serving on",
  "application startup complete",  // uvicorn/fastapi
  "restarting with",               // flask debug
  "debugger is active",            // flask
  "started development server",

  // Rust
  "running `target",
  "finished in",
  "compiling",

  // Go
  "listening on",
  "http server started",

  // Java / Spring
  "started application",
  "tomcat started",
  "spring boot",
  "build success",                 // maven

  // Ruby
  "listening on tcp",
  "rails server starting",
  "puma starting",
  "use ctrl-c to stop",

  // PHP
  "development server started",
  "listening on",

  // .NET
  "now listening on",
  "application started",
  "content root path",
];

export const crashSignals = [
  // JS / Node errors
  "syntaxerror",
  "referenceerror",
  "typeerror",
  "rangeerror",
  "urierror",
  "evalerror",
  "uncaughtexception",
  "unhandledrejection",
  "cannot find module",
  "app crashed",
  "failed to compile",
  "module not found",
  "npm err!",
  "npm error",
  "yarn error",

  // Python
  "traceback (most recent call last)",
  "importerror",
  "modulenotfounderror",
  "nameerror",
  "attributeerror",
  "indentationerror",
  "valueerror",
  "keyerror",
  "indexerror",
  "zerodivisionerror",
  "oserror",
  "filenotfounderror",
  "exception",

  // Rust
  "error[e",                       // rust compiler errors like error[E0499]
  "thread 'main' panicked",
  "build failed",

  // Go
  "panic:",
  "undefined:",
  "cannot use",
  "build failed",

  // Java
  "exception in thread",
  "build failure",                 // maven
  "compilation failed",
  "nullpointerexception",
  "classnotfoundexception",
  "stackoverflowerror",

  // Ruby
  "syntaxerror",
  "nomethoderror",
  "nameerror",
  "loaderror",
  "runtimeerror",

  // PHP
  "fatal error",
  "parse error",
  "warning:",
  "uncaught error",

  // .NET / C#
  "unhandled exception",
  "build failed",
  "error cs",                      // C# compiler errors

  // C / C++
  "segmentation fault",
  "core dumped",
  "undefined reference",
  "linker error",

  // General
  "failed",
  "fatal",
  "killed",
  "oom",                           // out of memory
  "permission denied",
  "command not found",
  "no such file or directory",
];