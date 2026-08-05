// Test-only resolver.
//
// The app's modules import each other without file extensions ("./types"),
// which the Next bundler resolves but Node's ESM loader does not. Rather than
// rewriting every production import just to run tests, this hook retries an
// extensionless relative specifier with ".ts" appended.
//
// Loaded via `node --import ./scripts/ts-resolve.mjs`; it affects nothing that
// Next builds or ships.
import { registerHooks } from "node:module";

const HAS_EXTENSION = /\.[cm]?[jt]sx?$/i;

registerHooks({
  resolve(specifier, context, nextResolve) {
    if ((specifier.startsWith("./") || specifier.startsWith("../")) && !HAS_EXTENSION.test(specifier)) {
      try {
        return nextResolve(`${specifier}.ts`, context);
      } catch {
        // Fall through to the normal resolution below.
      }
    }
    return nextResolve(specifier, context);
  },
});
