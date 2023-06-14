# freeRASP 3.0.0

### Android

- ❗ BREAKING CHANGE: Raised minimum supported Android version to 6.0 (API level 23)

- 🆕 Added new `obfuscationIssues` check, which is triggered when Talsec doesn't detect any obfuscation of the source code. By applying obfuscation to the final package/application, it is more difficult to find the public API of Talsec and the API is also partially randomized for each application, therefore it cannot be automatically abused by generic hooking scripts.

### iOS

- ⚠️ `PasscodeChange` check has been deprecated
- 🛠️ Code refactoring

# freeRASP 2.0.3

### iOS

- ✔️ Fixed issue with metadata in iOS framework
- 📄 Documentation updates and improvements

# freeRASP 2.0.2

- 📄 Documentation updates and improvements

# freeRASP 2.0.1

- 📄 Documentation updates and improvements

# freeRASP 2.0.0

## What's new?

Most of the changes relates to accomodating a new way of choosing between the dev and release version of the SDK. There are also some breaking changes in the API, such as renaming parameters and changing types of callbacks. Android has also removed the HMS dependencies and improved the root detection capabilities.

### JS/TS interface

- ❗ BREAKING API CHANGE: Renamed **'device binding'** to **deviceBinding**
  - ❗ This allows us to remove apostrophes from other callbacks, too. E.g. **'privilegedAccess'** to **privilegedAccess**
- ❗ Added **isProd** boolean parameter, which now differentiates between the release (true) and dev (false) version of the SDK. By default set to **true**
- ❗ **androidConfig** and **iosConfig** are from now on optionals, you can omit a platform if you are not developing for it

### Android

- ❗ Removed the HMS dependencies
- ❗ Only one version of the SDK is used from now on, instead of two separate for dev and release
- ❗ The app's build.gradle does not have to be modified now
- ⚡ Improved root detection accuracy by moving the 'ro.debuggable' property state to an ignored group
- ⚡ Enhanced root detection capabilities by moving the selinux properties check to device state
- ⚡ Fine-tuning root evaluation strategy

### iOS

- ❗ Removed one of the xcframeworks
- ❗ Removed the dependency on the symlinks choosing the proper version (release/dev)
- ❗️ Removed pre-built script for changing the Debug and Release versions

### Other improvements

- 📄 Documentation updates and improvements
- ⚡ Updated demo app for new implementation

# freeRASP 1.1.0

We are proud to share with you the first batch of improvements of freeRASP!

## What's new?

Android devices now support device state listeners. What's more, we unified remaining Android and iOS interfaces for more convenient developer's experience.

### Android

- 🆕 Android now has support for device state callbacks:
  - 📲 **`Secure Hardware Not Available`**: fires when hardware-backed KeyStore is not available
  - 📲 **`Passcode`**: fires when freeRASP detects that device is not secured with any type of lock

### iOS

- ❗ BREAKING API CHANGE: Renamed `Missing Secure Enclave` to **`Secure Hardware Not Available`** to match the newly added Android callback. The functionality remains unchanged.

### Other improvements

- 📄 Documentation updates and improvements

# freeRASP 1.0.0

- Initial release of freeRASP.
