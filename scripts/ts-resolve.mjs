// Test-only resolver.
//
// Bridges two things Node's ESM loader doesn't do but the Next bundler does:
//   1. extensionless relative imports  ("./types"  -> "./types.ts")
//   2. the "@/*" path alias from tsconfig ("@/lib/x" -> "<repo>/src/lib/x.ts")
//
// Loaded via `node --import ./scripts/ts-resolve.mjs`; it affects nothing that
// Next builds or ships.
import { registerHooks } from "node:module";
import { pathToFileURL } from "node:url";
import { dirname, resolve as resolvePath } from "node:path";
import { fileURLToPath } from "node:url";

const HAS_EXTENSION = /\.[cm]?[jt]sx?$/i;
const SRC_ROOT = resolvePath(dirname(fileURLToPath(import.meta.url)), "..", "src");

registerHooks({
  resolve(specifier, context, nextResolve) {
    // "@/lib/onboarding/types" -> "<repo>/src/lib/onboarding/types(.ts)"
    if (specifier.startsWith("@/")) {
      const base = resolvePath(SRC_ROOT, specifier.slice(2));
      for (const candidate of HAS_EXTENSION.test(base)
        ? [base]
        : [`${base}.ts`, `${base}.tsx`, `${base}/index.ts`]) {
        try {
          return nextResolve(pathToFileURL(candidate).href, context);
        } catch {
          // Try the next candidate.
        }
      }
    }

    if (
      (specifier.startsWith("./") || specifier.startsWith("../")) &&
      !HAS_EXTENSION.test(specifier)
    ) {
      try {
        return nextResolve(`${specifier}.ts`, context);
      } catch {
        // Fall through to the normal resolution below.
      }
    }

    return nextResolve(specifier, context);
  },
});
