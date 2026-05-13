---
name: code-review-react-native
description: Performs strict code reviews on React Native plugin projects covering TypeScript, the Kotlin (Android) and Swift (iOS) native bridges, and the Expo config plugin. Focuses on optimal code, readability, maintainability, deduplication, single-responsibility, straightforward control flow, React Native best practices, the rule that native layers must not invent hardcoded fallbacks for values the TypeScript layer or platform SDK already owns, alignment of identifiers and API surface across TypeScript/Kotlin/Swift (especially NativeModules name, NativeEventEmitter channel data, and EventIdentifiers), and explicit documentation of platform-specific features. Use when the user asks to "review PR", "do a code review", "review this code", "code review for PR#N", or otherwise requests review of changes in a React Native plugin — including its built output (`lib/`), Expo config plugin output (`plugin/build/`), and native source under `android/` and `ios/`.
---

# Code Review (React Native)

Strict, opinionated code review for React Native plugin codebases with Kotlin + Swift bridges and an optional Expo config plugin. Optimised for catching the kinds of issues that survive linters and tests but degrade a codebase over time.

## Review priorities, in order

1. **Correctness & contract** — bugs, breaking changes, public-API violations, SemVer; identifiers and API surface aligned across TypeScript, Kotlin, and Swift.
2. **Native-layer cleanliness** — no hardcoded fallbacks for values owned by TypeScript or the platform SDK; no behaviour duplicated across language boundaries; platform-specific features explicitly documented.
3. **Single responsibility** — each function, class, and file does one thing.
4. **Deduplication (DRY)** — repeated parsing, serialisation, and validation patterns get extracted.
5. **Readability** — naming, argument styles, generated-vs-handwritten boundaries, no surprises.
6. **Maintainability** — generated files untouched, defaults documented in one place, tests for new public surface.
7. **React Native / TypeScript best practices** — `const`, `@deprecated` discipline, `null` vs `undefined`, strict tsconfig honoured.
8. **Polish** — JSDoc style, example brevity, changelog accuracy, PR description present.

## Workflow

### 1. Gather context

If the user references a GitHub PR by number:

```bash
gh pr view <N> --json title,body,author,state,baseRefName,headRefName,additions,deletions,changedFiles,files,url
gh pr diff <N>
git log <base>..<head> --oneline
```

If the changes are local:

```bash
git diff <base>..HEAD --stat
git diff <base>..HEAD
```

Always read the full file (not only the diff) for any non-trivial change so you see the surrounding context the diff hides — especially around native bridges, event emitter wiring, and `EventIdentifiers`.

### 2. Classify every changed file

Each file falls into exactly one of these buckets, and the bucket determines what's acceptable:

| Bucket | Examples | Rule |
|---|---|---|
| Hand-written TypeScript | `src/` | Full review applies. |
| Built JS output | `lib/commonjs/`, `lib/module/`, `lib/typescript/` | **Must not be hand-edited.** Regenerate via `yarn build` (react-native-builder-bob). |
| Expo config plugin source | `plugin/src/` | Full review applies. |
| Expo config plugin build | `plugin/build/` | **Must not be hand-edited.** Regenerate via `yarn build` or `tsc -p plugin/tsconfig.build.json`. |
| Hand-written native | `android/src/main/kotlin/**`, `ios/**/*.swift` | Full review applies, with extra scrutiny on the bridge layer. |
| Build / config | `package.json`, `*.gradle`, `*.podspec`, `tsconfig.json`, `babel.config.js` | Verify version bumps follow SemVer; confirm SDK/binary updates match changelog. |
| Docs / release | `CHANGELOG.md`, `README.md` | Verify claims match the diff (e.g. SDK versions, breaking-change list, public-API additions). |

### 3. Run the checklist below and produce the report

---

## Hard rules — block the merge

### 1. No hand-edits to generated / built files

`lib/` (built by react-native-builder-bob) and `plugin/build/` (compiled from `plugin/src/`) must be touched only by their build tool.

Red flags:
- Behaviour-changing edits inside `lib/` that differ from what `yarn build` would produce.
- `plugin/build/` edited directly instead of editing `plugin/src/` and re-running the build.
- A `// eslint-disable` or `// @ts-ignore` directive added to a file inside `lib/`.

Action: ask the author to run `yarn build` and commit the clean output.

### 2. SemVer must match the change

A breaking public-API change requires a major version bump. "Public" includes anything exported from `src/index.tsx` and anything that changes the wire format with the native side.

Common breaks to flag:
- Renamed or retyped fields on exported TypeScript types or interfaces.
- Renamed string values consumers may pattern-match against.
- Removed or repurposed enum variants that map to native callback codes.
- Changed required/optional status on config parameters.

If `CHANGELOG.md` claims SemVer adherence and the bump doesn't match the change, call it out with the affected symbols and the recommended version.

### 3. No hardcoded fallbacks in the native layer

The native layer (Kotlin / Swift) is a transport adapter between TypeScript and the platform SDK. It must not:

- **Invent default values** for fields the TypeScript layer marks required. Such defaults are unreachable but advertise an optional contract that doesn't exist.
- **Substitute defaults** for nullable/optional fields. Either the SDK has its own default (skip the call) or the default belongs in TypeScript.
- **Encode the same default in multiple places.** A default as a literal in `optString("foo", "BAR")`, as an enum in `getOrDefault(Foo.BAR)`, and again as a fallback object is three sources of truth.
- **Hardcode enum names as raw strings** (e.g. `"SIDELOADED_ONLY"`). Use the SDK enum's `.name` property or avoid manual parsing entirely.

Recommended remediation:
- For **required** TypeScript fields: drop the native default; let parsing throw and surface through the existing error path.
- For **optional** TypeScript fields: skip the builder/setter call when the field is absent; let the SDK apply its own default.
- Document the default once — in the TypeScript JSDoc — so the public contract is unambiguous.

### 4. `NativeModules` name must be consistent across all layers

The string used to register and look up the native module must agree across three places:

| Layer | Location | Value |
|---|---|---|
| TypeScript | `src/api/nativeModules.ts` — `NativeModules.FreeraspReactNative` | `"FreeraspReactNative"` |
| Kotlin | `FreeraspReactNativeModule.kt` companion — `const val NAME = "FreeraspReactNative"` | `"FreeraspReactNative"` |
| iOS | `RCT_EXPORT_MODULE()` / `moduleName` override in Swift/ObjC bridge | `"FreeraspReactNative"` |

Any drift in this string causes the module to be `undefined` at runtime with no compile-time error.

### 5. NativeEventEmitter channel data aligned across TypeScript, Kotlin, and Swift

Threats and execution state are delivered through obfuscated event channels. The channel metadata is fetched at runtime from native via two methods:

| Method | Returns | Kotlin | Swift |
|---|---|---|---|
| `getThreatChannelData` | **3 strings**: `[channelName, threatKey, malwareKey]` | `getThreatChannelData()` promise | `getThreatChannelData(_:resolve:reject:)` |
| `getRaspExecutionStateChannelData` | **2 strings**: `[channelName, key]` | `getRaspExecutionStateChannelData()` | `getRaspExecutionStateChannelData(_:resolve:reject:)` |

Verify for every change touching these methods:
- Array length is the same on Kotlin and Swift sides.
- The semantic order of items in the array is the same on both native sides and matches what `src/channels/threat.ts` and `src/channels/raspExecutionState.ts` destructure by index.
- The TypeScript type declarations in `src/types/types.ts` (`TalsecPlugin` interface) reflect any change to the array shape.

### 6. `EventIdentifiers` must stay obfuscated — never replace with hardcoded strings

`ios/utils/EventIdentifiers.swift` derives all channel identifiers at runtime from `RandomGenerator.generateRandomIdentifiers(length: N)`. This obfuscation is intentional and security-relevant.

Hard blocks:
- Replacing a `generatedNumbers[i]` reference with a hardcoded string or integer constant.
- Adding a new identifier slot without expanding `length` and updating all index references consistently.
- Using the same index in two different identifier roles (index collision).

The Kotlin side generates its own independent random identifiers via an equivalent mechanism; they are not shared with iOS. This is by design — each process re-generates at launch. Do not attempt to synchronise iOS and Android identifier values.

### 7. `NativeEventEmitter` listener registration and cleanup symmetry

Every `addListener(channelName, callback)` call on `NativeEventEmitter(FreeraspReactNative)` must have a matching cleanup path.

Check:
- `removeListenerForEvent(channelName)` is called in Kotlin's `removeListenerForEvent` react method, and the matching Swift handler does the same.
- The returned `EmitterSubscription` (or the subscription stored in `useFreeRasp`) is `.remove()`d on cleanup.
- Kotlin's `addListener` increments the listener count so the native module doesn't drop events on multi-listener setups.

### 8. Platform-specific features must be documented and gated

Not every API works on both platforms. Some checks are Android-only (e.g. malware detection, package introspection), some iOS-only (e.g. jailbreak sub-checks).

Required:
- **JSDoc states the platform**: any type, field, enum variant, or callback that only works on one platform must say so — e.g. `/** Android only. No-op on iOS. */`
- **Config class isolation**: platform-specific config fields belong on the platform-specific config class, not on the shared `TalsecConfig`.
- **CHANGELOG calls out the platform**: bullets for added/changed/removed features must say "(Android)" or "(iOS)" when applicable.

Red flags:
- A `TalsecConfig`-level field read only by one of the two native handlers, with no platform marker.
- A callback that fires only on one platform without a JSDoc note.
- An enum variant with no native producer on one side.

### 9. Expo config plugin changes are complete and tested

If `plugin/src/` changes:
- Verify `plugin/build/` is regenerated and committed.
- Confirm the plugin modifies the correct build artifact (`AndroidManifest.xml`, `Info.plist`, Gradle properties, etc.) and does not duplicate a modification the user's `app.json` already handles.
- The example app `example/` should demonstrate or at least not break the plugin path.

### 10. Tests for new public API

Every newly exported type, enum, or function needs at least:
- Construction / instantiation test (defaults, required fields).
- Round-trip serialisation test if the type crosses the JS–native bridge as JSON.
- Enum-name stability test if the enum maps to native callback codes (catching drift from native renames).

---

## Significant issues — should fix

### Single responsibility

- A function that parses, validates, defaults, and constructs in one body is doing four things. Split.
- A Kotlin class with `parse*`, `build*`, and `dispatch*` methods is three classes.
- A TypeScript file that mixes API methods, listener helpers, and type definitions is three modules.

### Deduplication

Flag verbatim or near-verbatim repetition, especially:
- The same `(0 until arr.length()).map { arr.getString(it) }` pattern repeated for every JSON array field in Kotlin. Extract a helper.
- The same `value ?? defaultValue` pattern repeated across multiple config fields. Use a helper or map.
- Multiple `runCatching { Enum.valueOf(s) }.getOrDefault(...)` calls in Kotlin. Extract a generic `parseEnumOr(default)` helper.

### Argument style for many-parameter constructors

Constructors with **3+ parameters of similar type** should be called with named arguments. Positional calls are swap-bug magnets.

### Old API still wired alongside the new one

When deprecating an API path, ensure the new path doesn't quietly run both code paths. Either short-circuit the deprecated path or document the precedence explicitly.

### `useFreeRasp` hook completeness

The hook is the primary consumer entry point. If new config fields or callbacks are added, verify:
- The hook's internal types accept the new fields.
- Cleanup logic (in `useEffect` return) covers any new subscriptions.
- The hook is re-exported from `src/index.tsx`.

---

## Style & polish — call out, don't block

- **Trailing newlines, formatting churn**: separate from the feature; mention but don't argue.
- **Verbose examples**: example code that explicitly sets parameters to their defaults teaches nothing. Either drop the assignment or assign a non-default to demonstrate customisation.
- **Inconsistent terminology**: e.g. `MalwareConfig` vs `SuspiciousAppDetectionConfig` in one PR is one term too many. Pin it before release.
- **JSDoc consistency**: full sentences, end with a period, match the project's existing style.
- **`@deprecated` discipline**: deprecating a field is fine; leaving the constructor accepting it with no warning is inconsistent.
- **PR description**: an empty PR body for a release PR is a defect of its own. Aggregate conventional commits into a short summary.
- **Changelog accuracy**: every bullet in `CHANGELOG.md` should be verifiable from `git diff <base>..HEAD`.
- **Yarn vs npm**: this repo uses Yarn. Any instruction in the README or PR description to run `npm install` is wrong.

---

## Output format

Structure the review as:

```markdown
## Summary

<2–3 sentences: what the PR does, overall verdict>

## Blockers / Major issues

### 1. <short title — one line>

<context, citing file:line; show the offending snippet using a code reference>

<concrete remediation>

### 2. ...

## Significant issues

(same shape, less severe)

## Minor / polish

(numbered list, one to three lines each)

## Recommended action

<numbered, ordered list of what must change before merge>
```

Rules for the report:
- Cite specific files and line numbers for every issue. When showing existing code, use the `startLine:endLine:filepath` reference form so the user can click through.
- Prefer one detailed example over a vague generality; if a pattern repeats, mention it once and list the other locations.
- Distinguish between "this is wrong" and "I'd prefer this." Flag the first as Major, the second as Polish.
- Never assert facts about a closed-source SDK without verifying. If the SDK isn't readable from the repo, phrase findings as "verify whether the SDK provides X; if so, do not duplicate it."
- End with a short, ordered "Recommended action" list — the actual gating items, not a wishlist.
